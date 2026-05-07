"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QAPulsePlaywrightAssert = void 0;
exports.qaPulseAssert = qaPulseAssert;
const fuzzy_1 = require("../assertions/fuzzy");
const semantic_1 = require("../assertions/semantic");
const accessibility_1 = require("../assertions/accessibility");
class QAPulsePlaywrightAssert {
    constructor(page, config = {}) {
        this.page = page;
        this.aiConfig = config.ai;
    }
    requireAI() {
        if (!this.aiConfig?.enabled || !this.aiConfig?.apiKey) {
            throw new Error('[QAPulseSK-assert] AI assertions require ai config with an apiKey.');
        }
        return this.aiConfig;
    }
    async toBeVisible(selector) {
        const el = await this.page.locator(selector);
        if (!(await el.isVisible()))
            throw new Error(`[QAPulseSK-assert] Expected "${selector}" to be visible`);
    }
    async toFuzzyHaveText(selector, expected, options = {}) {
        const actual = await this.page.locator(selector).innerText();
        const result = (0, fuzzy_1.assertFuzzyMatch)(actual, expected, options);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async toContainText(selector, expected) {
        const actual = await this.page.locator(selector).innerText();
        const result = (0, fuzzy_1.assertContains)(actual, expected);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async toBeAccessible(options = {}) {
        const html = await this.page.content();
        const result = (0, accessibility_1.assertAccessibility)(html, options);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async toMean(selector, expectation) {
        const ai = this.requireAI();
        const actual = await this.page.locator(selector).innerText();
        const result = await (0, semantic_1.assertContainsMeaning)(actual, expectation, ai);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async pageMatchesSpec(spec) {
        const ai = this.requireAI();
        const content = await this.page.innerText('body');
        const result = await (0, semantic_1.assertMatchesSpec)(content, spec, ai);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async toBeAccessibleAI(level = 'AA') {
        const ai = this.requireAI();
        const html = await this.page.content();
        const result = await (0, semantic_1.assertAccessible)(html, ai, level);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
    async satisfiesRule(selector, rule) {
        const ai = this.requireAI();
        const actual = await this.page.locator(selector).innerText();
        const result = await (0, semantic_1.assertSatisfiesRule)(actual, rule, ai);
        if (!result.passed)
            throw new Error(`[QAPulseSK-assert] ${result.message}`);
    }
}
exports.QAPulsePlaywrightAssert = QAPulsePlaywrightAssert;
function qaPulseAssert(page, config = {}) {
    return new QAPulsePlaywrightAssert(page, config);
}
exports.default = qaPulseAssert;
//# sourceMappingURL=playwright.js.map