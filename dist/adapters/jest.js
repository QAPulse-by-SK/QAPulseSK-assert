"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qaPulseMatchers = void 0;
exports.setupQAPulseMatchers = setupQAPulseMatchers;
const fuzzy_1 = require("../assertions/fuzzy");
const semantic_1 = require("../assertions/semantic");
const accessibility_1 = require("../assertions/accessibility");
const api_1 = require("../assertions/api");
let _aiConfig;
function requireAI() {
    if (!_aiConfig?.enabled || !_aiConfig?.apiKey) {
        throw new Error('[QAPulseSK-assert] AI matchers require setup with setupQAPulseMatchers({ ai: { enabled: true, apiKey: "..." } })');
    }
    return _aiConfig;
}
const qaPulseMatchers = {
    // ─── Free matchers ──────────────────────────────────────────────────
    toFuzzyMatch(received, expected, options = {}) {
        const result = (0, fuzzy_1.assertFuzzyMatch)(received, expected, options);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    toContainText(received, expected) {
        const result = (0, fuzzy_1.assertContains)(received, expected);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    toContainObject(received, expected) {
        const result = (0, fuzzy_1.assertObjectContains)(received, expected);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    toContainItem(received, expected) {
        const result = (0, fuzzy_1.assertArrayContains)(received, expected);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    toBeAccessible(received, options = {}) {
        const result = (0, accessibility_1.assertAccessibility)(received, options);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    // ─── API matchers ────────────────────────────────────────────────────
    toHaveStatus(received, expected) {
        const result = (0, api_1.assertStatus)(received, expected);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    toBeSuccessful(received) {
        const result = (0, api_1.assertSuccess)(received);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    toHaveBody(received, expected) {
        const result = (0, api_1.assertBodyContains)(received, expected);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    toRespondWithin(received, maxMs) {
        const result = (0, api_1.assertResponseTime)(received, maxMs);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    toMatchSchema(received, schema) {
        const result = (0, api_1.assertSchema)(received, schema);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    // ─── AI matchers (opt-in) ────────────────────────────────────────────
    async toMean(received, expectation) {
        const ai = requireAI();
        const result = await (0, semantic_1.assertContainsMeaning)(received, expectation, ai);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    async toMatchSpec(received, spec) {
        const ai = requireAI();
        const result = await (0, semantic_1.assertMatchesSpec)(received, spec, ai);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
    async toSatisfyRule(received, rule) {
        const ai = requireAI();
        const result = await (0, semantic_1.assertSatisfiesRule)(received, rule, ai);
        return { pass: result.passed, message: () => `[QAPulseSK-assert] ${result.message}` };
    },
};
exports.qaPulseMatchers = qaPulseMatchers;
/**
 * Setup QAPulseSK custom matchers for Jest or Vitest.
 *
 * @example
 * // jest.setup.ts or vitest.setup.ts
 * import { setupQAPulseMatchers } from 'qapulsesk-assert/jest';
 * setupQAPulseMatchers({ ai: { enabled: true, provider: 'anthropic', apiKey: process.env.AI_KEY } });
 */
function setupQAPulseMatchers(config = {}) {
    _aiConfig = config.ai;
    // Works with both Jest and Vitest (both expose expect.extend)
    if (typeof expect !== 'undefined' && typeof expect.extend === 'function') {
        expect.extend(qaPulseMatchers);
    }
}
exports.default = setupQAPulseMatchers;
//# sourceMappingURL=jest.js.map