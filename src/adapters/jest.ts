import { QAPulseAssertConfig, AIAssertConfig } from '../core/types';
import { assertFuzzyMatch, assertContains, assertObjectContains, assertArrayContains } from '../assertions/fuzzy';
import { assertContainsMeaning, assertMatchesSpec, assertSatisfiesRule } from '../assertions/semantic';
import { assertAccessibility } from '../assertions/accessibility';
import { assertStatus, assertSuccess, assertBodyContains, assertResponseTime, assertSchema, APIResponse } from '../assertions/api';

let _aiConfig: AIAssertConfig | undefined;

function requireAI(): AIAssertConfig {
  if (!_aiConfig?.enabled || !_aiConfig?.apiKey) {
    throw new Error(
      '[QAPulseSK-assert] AI matchers require setup with setupQAPulseMatchers({ ai: { enabled: true, apiKey: "..." } })'
    );
  }
  return _aiConfig;
}

const qaPulseMatchers = {
  // ─── Free matchers ──────────────────────────────────────────────────

  toFuzzyMatch(received: string, expected: string, options: { threshold?: number } = {}) {
    const result = assertFuzzyMatch(received, expected, options);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  toContainText(received: string, expected: string) {
    const result = assertContains(received, expected);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  toContainObject(received: Record<string, unknown>, expected: Record<string, unknown>) {
    const result = assertObjectContains(received, expected);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  toContainItem<T>(received: T[], expected: T) {
    const result = assertArrayContains(received, expected);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  toBeAccessible(received: string, options: { ignoreRules?: string[] } = {}) {
    const result = assertAccessibility(received, options);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  // ─── API matchers ────────────────────────────────────────────────────

  toHaveStatus(received: APIResponse, expected: number) {
    const result = assertStatus(received, expected);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  toBeSuccessful(received: APIResponse) {
    const result = assertSuccess(received);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  toHaveBody(received: APIResponse, expected: Record<string, unknown>) {
    const result = assertBodyContains(received, expected);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  toRespondWithin(received: APIResponse, maxMs: number) {
    const result = assertResponseTime(received, maxMs);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  toMatchSchema(received: APIResponse, schema: Record<string, string>) {
    const result = assertSchema(received, schema);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  // ─── AI matchers (opt-in) ────────────────────────────────────────────

  async toMean(received: string, expectation: string) {
    const ai = requireAI();
    const result = await assertContainsMeaning(received, expectation, ai);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  async toMatchSpec(received: string, spec: string) {
    const ai = requireAI();
    const result = await assertMatchesSpec(received, spec, ai);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },

  async toSatisfyRule(received: string, rule: string) {
    const ai = requireAI();
    const result = await assertSatisfiesRule(received, rule, ai);
    return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
  },
};

/**
 * Setup QAPulseSK custom matchers for Jest or Vitest.
 *
 * @example
 * // jest.setup.ts or vitest.setup.ts
 * import { setupQAPulseMatchers } from 'qapulsesk-assert/jest';
 * setupQAPulseMatchers({ ai: { enabled: true, provider: 'anthropic', apiKey: process.env.AI_KEY } });
 */
export function setupQAPulseMatchers(config: QAPulseAssertConfig = {}): void {
  _aiConfig = config.ai;

  // Works with both Jest and Vitest (both expose expect.extend)
  if (typeof expect !== 'undefined' && typeof expect.extend === 'function') {
    expect.extend(qaPulseMatchers);
  }
}

export { qaPulseMatchers };
export type { APIResponse };
export default setupQAPulseMatchers;
