/* eslint-disable @typescript-eslint/no-explicit-any */
import { QAPulseAssertConfig, AIAssertConfig } from '../core/types';
import { assertFuzzyMatch, assertContains } from '../assertions/fuzzy';
import { assertContainsMeaning, assertMatchesSpec, assertSatisfiesRule, assertAccessible } from '../assertions/semantic';
import { assertAccessibility } from '../assertions/accessibility';

type Page = any;

export class QAPulsePlaywrightAssert {
  private page: Page;
  private aiConfig?: AIAssertConfig;

  constructor(page: Page, config: QAPulseAssertConfig = {}) {
    this.page = page;
    this.aiConfig = config.ai;
  }

  private requireAI(): AIAssertConfig {
    if (!this.aiConfig?.enabled || !this.aiConfig?.apiKey) {
      throw new Error('[QAPulseSK-assert] AI assertions require ai config with an apiKey.');
    }
    return this.aiConfig;
  }

  async toBeVisible(selector: string): Promise<void> {
    const el = await this.page.locator(selector);
    if (!(await el.isVisible())) throw new Error(`[QAPulseSK-assert] Expected "${selector}" to be visible`);
  }

  async toFuzzyHaveText(selector: string, expected: string, options: { threshold?: number } = {}): Promise<void> {
    const actual = await this.page.locator(selector).innerText();
    const result = assertFuzzyMatch(actual, expected, options);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async toContainText(selector: string, expected: string): Promise<void> {
    const actual = await this.page.locator(selector).innerText();
    const result = assertContains(actual, expected);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async toBeAccessible(options: { ignoreRules?: string[] } = {}): Promise<void> {
    const html = await this.page.content();
    const result = assertAccessibility(html, options);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async toMean(selector: string, expectation: string): Promise<void> {
    const ai = this.requireAI();
    const actual = await this.page.locator(selector).innerText();
    const result = await assertContainsMeaning(actual, expectation, ai);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async pageMatchesSpec(spec: string): Promise<void> {
    const ai = this.requireAI();
    const content = await this.page.innerText('body');
    const result = await assertMatchesSpec(content, spec, ai);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async toBeAccessibleAI(level: 'A' | 'AA' | 'AAA' = 'AA'): Promise<void> {
    const ai = this.requireAI();
    const html = await this.page.content();
    const result = await assertAccessible(html, ai, level);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async satisfiesRule(selector: string, rule: string): Promise<void> {
    const ai = this.requireAI();
    const actual = await this.page.locator(selector).innerText();
    const result = await assertSatisfiesRule(actual, rule, ai);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }
}

export function qaPulseAssert(page: Page, config: QAPulseAssertConfig = {}): QAPulsePlaywrightAssert {
  return new QAPulsePlaywrightAssert(page, config);
}

export default qaPulseAssert;
