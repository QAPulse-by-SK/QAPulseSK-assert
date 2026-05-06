import { AIAssertConfig, QAPulseAssertConfig } from '../core/types';
import { assertFuzzyMatch, assertContains } from '../assertions/fuzzy';
import { assertContainsMeaning, assertSatisfiesRule } from '../assertions/semantic';
import { assertAccessibility } from '../assertions/accessibility';

export class QAPulseWdioAssert {
  private browser: WebdriverIO.Browser;
  private aiConfig?: AIAssertConfig;

  constructor(browser: WebdriverIO.Browser, config: QAPulseAssertConfig = {}) {
    this.browser = browser;
    this.aiConfig = config.ai;
  }

  private requireAI(): AIAssertConfig {
    if (!this.aiConfig?.enabled || !this.aiConfig?.apiKey) {
      throw new Error(
        '[QAPulseSK-assert] AI assertions require ai config.\n' +
        'Pass: new QAPulseWdioAssert(browser, { ai: { enabled: true, apiKey: "..." } })'
      );
    }
    return this.aiConfig;
  }

  // ─── Free assertions ─────────────────────────────────────────────────

  async toFuzzyHaveText(selector: string, expected: string, options: { threshold?: number } = {}): Promise<void> {
    const el = await this.browser.$(selector);
    const actual = await el.getText();
    const result = assertFuzzyMatch(actual, expected, options);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async toContainText(selector: string, expected: string): Promise<void> {
    const el = await this.browser.$(selector);
    const actual = await el.getText();
    const result = assertContains(actual, expected);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async toBeAccessible(options: { ignoreRules?: string[] } = {}): Promise<void> {
    const html = await this.browser.getPageSource();
    const result = assertAccessibility(html, options);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  // ─── AI assertions ───────────────────────────────────────────────────

  async toMean(selector: string, expectation: string): Promise<void> {
    const ai = this.requireAI();
    const el = await this.browser.$(selector);
    const actual = await el.getText();
    const result = await assertContainsMeaning(actual, expectation, ai);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }

  async satisfiesRule(selector: string, rule: string): Promise<void> {
    const ai = this.requireAI();
    const el = await this.browser.$(selector);
    const actual = await el.getText();
    const result = await assertSatisfiesRule(actual, rule, ai);
    if (!result.passed) throw new Error(`[QAPulseSK-assert] ${result.message}`);
  }
}

export function qaPulseWdioAssert(browser: WebdriverIO.Browser, config: QAPulseAssertConfig = {}): QAPulseWdioAssert {
  return new QAPulseWdioAssert(browser, config);
}

export default qaPulseWdioAssert;
