import { AssertResult, AIAssertConfig } from '../core/types';

async function callAI(
  systemPrompt: string,
  userPrompt: string,
  config: AIAssertConfig
): Promise<{ passed: boolean; reason: string } | null> {
  const provider = config.provider || 'anthropic';
  const apiKey = config.apiKey!;

  const parse = (text: string): { passed: boolean; reason: string } | null => {
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean) as { passed: boolean; reason: string };
    } catch {
      // Try to extract from plain text
      const passed = /passed|true|yes|correct/i.test(text) && !/failed|false|no|incorrect/i.test(text);
      return { passed, reason: text.trim() };
    }
  };

  try {
    if (provider === 'anthropic') {
      const model = config.model || 'claude-3-5-haiku-20241022';
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 256,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json() as { content: Array<{ type: string; text: string }> };
      const text = data.content.find(c => c.type === 'text')?.text || '';
      return parse(text);
    }

    if (provider === 'openai') {
      const model = config.model || 'gpt-4o-mini';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          max_tokens: 256,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });
      if (!res.ok) return null;
      const data = await res.json() as { choices: Array<{ message: { content: string } }> };
      return parse(data.choices[0]?.message?.content || '');
    }

    if (provider === 'gemini') {
      const model = config.model || 'gemini-1.5-flash';
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: { maxOutputTokens: 256 },
          }),
        }
      );
      if (!res.ok) return null;
      const data = await res.json() as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> };
      return parse(data.candidates[0]?.content?.parts[0]?.text || '');
    }
  } catch {
    return null;
  }

  return null;
}

const SEMANTIC_SYSTEM = `You are a QA test assertion engine. 
Evaluate if the actual content semantically matches the expectation.
Respond ONLY with JSON: { "passed": true|false, "reason": "brief explanation" }`;

const VISUAL_SYSTEM = `You are a QA visual testing engine.
Compare the two UI descriptions/screenshots and evaluate if they match within acceptable tolerance.
Respond ONLY with JSON: { "passed": true|false, "reason": "brief explanation" }`;

const A11Y_SYSTEM = `You are an accessibility expert.
Analyze the provided HTML for WCAG accessibility violations.
Respond ONLY with JSON: { 
  "passed": true|false, 
  "reason": "summary", 
  "violations": [{ "id": "rule-id", "impact": "minor|moderate|serious|critical", "description": "...", "nodes": ["selector"] }]
}`;

/**
 * Semantically asserts that content matches an expectation using AI.
 * Example: assertContainsMeaning("Welcome back, John!", "user is logged in")
 */
export async function assertContainsMeaning(
  actual: string,
  expectation: string,
  config: AIAssertConfig,
  context?: string
): Promise<AssertResult> {
  if (!config.enabled || !config.apiKey) {
    throw new Error('AI assertions require ai config with an apiKey.\nAdd: { ai: { enabled: true, provider: "anthropic", apiKey: "..." } }');
  }

  const prompt = `Actual content: "${actual}"\nExpectation: "${expectation}"${context ? `\nContext: ${context}` : ''}`;
  const result = await callAI(SEMANTIC_SYSTEM, prompt, config);

  if (!result) {
    return {
      passed: false,
      message: 'AI assertion failed — could not get response. Check your API key.',
      expected: expectation,
      actual,
    };
  }

  return {
    passed: result.passed,
    message: result.passed
      ? `Semantic assertion passed: ${result.reason}`
      : `Semantic assertion failed: ${result.reason}`,
    expected: expectation,
    actual,
  };
}

/**
 * Asserts that a page/component matches a spec description using AI.
 * Example: assertMatchesSpec(pageText, "login form with email and password fields")
 */
export async function assertMatchesSpec(
  actual: string,
  spec: string,
  config: AIAssertConfig
): Promise<AssertResult> {
  if (!config.enabled || !config.apiKey) {
    throw new Error('AI assertions require ai config with an apiKey.');
  }

  const prompt = `Page/component content:\n${actual.slice(0, 2000)}\n\nExpected spec: "${spec}"`;
  const result = await callAI(SEMANTIC_SYSTEM, prompt, config);

  if (!result) {
    return { passed: false, message: 'AI spec assertion failed — no response', expected: spec, actual };
  }

  return {
    passed: result.passed,
    message: result.passed
      ? `Spec assertion passed: ${result.reason}`
      : `Spec assertion failed: ${result.reason}`,
    expected: spec,
    actual: actual.slice(0, 200) + (actual.length > 200 ? '...' : ''),
  };
}

/**
 * Asserts that two visual descriptions or texts match visually using AI.
 */
export async function assertVisualMatch(
  actual: string,
  expected: string,
  config: AIAssertConfig
): Promise<AssertResult> {
  if (!config.enabled || !config.apiKey) {
    throw new Error('AI assertions require ai config with an apiKey.');
  }

  const prompt = `Actual: "${actual}"\nExpected: "${expected}"\nAre these visually equivalent?`;
  const result = await callAI(VISUAL_SYSTEM, prompt, config);

  if (!result) {
    return { passed: false, message: 'AI visual assertion failed — no response', expected, actual };
  }

  return {
    passed: result.passed,
    message: result.passed
      ? `Visual assertion passed: ${result.reason}`
      : `Visual assertion failed: ${result.reason}`,
    expected,
    actual,
  };
}

/**
 * Asserts WCAG accessibility compliance using AI analysis of HTML.
 */
export async function assertAccessible(
  html: string,
  config: AIAssertConfig,
  level: 'A' | 'AA' | 'AAA' = 'AA'
): Promise<AssertResult & { violations?: Array<{ id: string; impact: string; description: string }> }> {
  if (!config.enabled || !config.apiKey) {
    throw new Error('AI assertions require ai config with an apiKey.');
  }

  const prompt = `WCAG Level: ${level}\nHTML:\n${html.slice(0, 3000)}`;
  const result = await callAI(A11Y_SYSTEM, prompt, config);

  if (!result) {
    return { passed: false, message: 'AI accessibility assertion failed — no response' };
  }

  const fullResult = result as { passed: boolean; reason: string; violations?: Array<{ id: string; impact: string; description: string }> };
  const violations = fullResult.violations || [];

  return {
    passed: result.passed,
    message: result.passed
      ? `Accessibility check passed (WCAG ${level}): ${result.reason}`
      : `Accessibility violations found (WCAG ${level}):\n${violations.map(v => `  [${v.impact}] ${v.id}: ${v.description}`).join('\n')}`,
    violations,
  };
}

/**
 * Asserts that response/content satisfies a business rule described in plain English.
 * Example: assertSatisfiesRule(responseBody, "all prices must be positive numbers")
 */
export async function assertSatisfiesRule(
  actual: string,
  rule: string,
  config: AIAssertConfig
): Promise<AssertResult> {
  if (!config.enabled || !config.apiKey) {
    throw new Error('AI assertions require ai config with an apiKey.');
  }

  const prompt = `Content: ${actual.slice(0, 2000)}\nBusiness rule: "${rule}"\nDoes the content satisfy this rule?`;
  const result = await callAI(SEMANTIC_SYSTEM, prompt, config);

  if (!result) {
    return { passed: false, message: 'AI rule assertion failed — no response', expected: rule, actual };
  }

  return {
    passed: result.passed,
    message: result.passed
      ? `Rule satisfied: ${result.reason}`
      : `Rule violated: ${result.reason}`,
    expected: rule,
    actual: actual.slice(0, 100) + '...',
  };
}
