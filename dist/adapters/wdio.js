"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QAPulseWdioAssert = void 0;
exports.qaPulseWdioAssert = qaPulseWdioAssert;
const fuzzy_1 = require("../assertions/fuzzy");
const semantic_1 = require("../assertions/semantic");
const accessibility_1 = require("../assertions/accessibility");
class QAPulseWdioAssert {
    constructor(browser, config = {}) {
        this.browser = browser;
        this.aiConfig = config.ai;
    }
    requireAI() {
        if (!this.aiConfig?.enabled || !this.aiConfig?.apiKey) {
            throw new Error('[QAPulseSK-assert] AI assertions require ai config with an apiKey.');
        }
        return this.aiConfig;
    }
    async toFuzzyHaveText(selector, expected, options = {}) {
        const el = await this.browser.$(selector);
        const actual = await el.getText();
        const result = (0, fuzzy_1.assertFuzzyMatch)(actual, expected, options);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async toContainText(selector, expected) {
        const el = await this.browser.$(selector);
        const actual = await el.getText();
        const result = (0, fuzzy_1.assertContains)(actual, expected);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async toBeAccessible(options = {}) {
        const html = await this.browser.getPageSource();
        const result = (0, accessibility_1.assertAccessibility)(html, options);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async toMean(selector, expectation) {
        const ai = this.requireAI();
        const el = await this.browser.$(selector);
        const actual = await el.getText();
        const result = await (0, semantic_1.assertContainsMeaning)(actual, expectation, ai);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async satisfiesRule(selector, rule) {
        const ai = this.requireAI();
        const el = await this.browser.$(selector);
        const actual = await el.getText();
        const result = await (0, semantic_1.assertSatisfiesRule)(actual, rule, ai);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
}
exports.QAPulseWdioAssert = QAPulseWdioAssert;
function qaPulseWdioAssert(browser, config = {}) {
    return new QAPulseWdioAssert(browser, config);
}
exports.default = qaPulseWdioAssert;
//# sourceMappingURL=wdio.js.map