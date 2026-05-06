import { Page, Locator, expect } from '@playwright/test';
import { AIAssertConfig, QAPulseAssertConfig } from '../core/types';
import { assertFuzzyMatch, assertContains } from '../assertions/fuzzy';
import { assertContainsMeaning, assertMatchesSpec, assertAccessible, assertSatisfiesRule } from '../assertions/semantic';
import { assertAccessibility } from '../assertions/accessibility';

export class QAPulsePlaywrightAssert {
  private page: Page;
  private aiConfig?: AIAssertConfig;

  constructor(page: Page, config: QAPulseAssertConfig = {}) {
    this.page = page;
    this.aiConfig = config.ai;
  }

  // ─── Standard Playwright Assertions (pass-through) ───────────────────

  async toBeVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async toHaveText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  async toHaveURL(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async toHaveTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  // ─── Fuzzy Assertions (free) ──────────────────────────────────────────

  /**
   * Fuzzy text match — handles typos and minor differences.
   * @example await qa.toFuzzyHaveText('#heading', 'Welcme to Dashboard', { threshold: 0.8 })
   */
  async toFuzzyHaveText(
    selector: string,
    expected: string,
    options: { threshold?: number } = {}
  ): Promise<void> {
    const actual = await this.page.locator(selector).innerText();
    const result = assertFuzzyMatch(actual, expected, options);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  /**
   * Assert page text contains a substring (case-insensitive).
   */
  async toContainText(selector: string, expected: string): Promise<void> {
    const actual = await this.page.locator(selector).innerText();
    const result = assertContains(actual, expected);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  // ─── Free Accessibility Check ─────────────────────────────────────────

  /**
   * Free rule-based accessibility assertion — no AI key needed.
   */
  async toBeAccessible(options: { ignoreRules?: string[] } = {}): Promise<void> {
    const html = await this.page.content();
    const result = assertAccessibility(html, options);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  // ─── AI Assertions (opt-in, user's key) ──────────────────────────────

  private requireAI(): AIAssertConfig {
    if (!this.aiConfig?.enabled || !this.aiConfig?.apiKey) {
      throw new Error(
        '[QAPulseSK-assert] AI assertions require ai config.\n' +
        'Pass: new QAPulsePlaywrightAssert(page, { ai: { enabled: true, provider: "anthropic", apiKey: "..." } })'
      );
    }
    return this.aiConfig;
  }

  /**
   * 🤖 AI: Assert page content semantically matches an expectation.
   * @example await qa.toMean('#status', 'user is logged in successfully')
   */
  async toMean(selector: string, expectation: string): Promise<void> {
    const ai = this.requireAI();
    const actual = await this.page.locator(selector).innerText();
    const result = await assertContainsMeaning(actual, expectation, ai);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  /**
   * 🤖 AI: Assert the full page matches a spec description.
   * @example await qa.pageMatchesSpec('login page with email and password fields and a submit button')
   */
  async pageMatchesSpec(spec: string): Promise<void> {
    const ai = this.requireAI();
    const content = await this.page.innerText('body');
    const result = await assertMatchesSpec(content, spec, ai);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  /**
   * 🤖 AI: Assert WCAG accessibility using AI analysis.
   * For deeper checks than the free rule-based version.
   */
  async toBeAccessibleAI(level: 'A' | 'AA' | 'AAA' = 'AA'): Promise<void> {
    const ai = this.requireAI();
    const html = await this.page.content();
    const result = await assertAccessible(html, ai, level);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  /**
   * 🤖 AI: Assert element content satisfies a business rule.
   * @example await qa.satisfiesRule('#price', 'price must be a positive number with currency symbol')
   */
  async satisfiesRule(selector: string, rule: string): Promise<void> {
    const ai = this.requireAI();
    const actual = await this.page.locator(selector).innerText();
    const result = await assertSatisfiesRule(actual, rule, ai);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }
}

/**
 * Factory function — create a QAPulse assert instance for a Playwright page.
 * @example const qa = qaPulseAssert(page, { ai: { enabled: true, apiKey: process.env.AI_KEY } })
 */
export function qaPulseAssert(page: Page, config: QAPulseAssertConfig = {}): QAPulsePlaywrightAssert {
  return new QAPulsePlaywrightAssert(page, config);
}

export default qaPulseAssert;
