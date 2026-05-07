"use strict";
// QAPulseSK-assert — All-in-one assertion library by QAPulse by SK
// https://skakarh.com · https://github.com/QAPulse-by-SK
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSchema = exports.assertResponseTime = exports.assertHeader = exports.assertBodyContains = exports.assertSuccess = exports.assertStatus = exports.checkAccessibility = exports.assertAccessibility = exports.assertSatisfiesRule = exports.assertAccessible = exports.assertVisualMatch = exports.assertMatchesSpec = exports.assertContainsMeaning = exports.assertObjectContains = exports.assertArrayContains = exports.assertApproximately = exports.assertMatches = exports.assertContains = exports.assertFuzzyMatch = exports.qaPulseWdioAssert = exports.QAPulseWdioAssert = exports.qaPulseMatchers = exports.setupQAPulseMatchers = exports.qaPulseAssert = exports.QAPulsePlaywrightAssert = void 0;
// Adapters
var playwright_1 = require("./adapters/playwright");
Object.defineProperty(exports, "QAPulsePlaywrightAssert", { enumerable: true, get: function () { return playwright_1.QAPulsePlaywrightAssert; } });
Object.defineProperty(exports, "qaPulseAssert", { enumerable: true, get: function () { return playwright_1.qaPulseAssert; } });
var jest_1 = require("./adapters/jest");
Object.defineProperty(exports, "setupQAPulseMatchers", { enumerable: true, get: function () { return jest_1.setupQAPulseMatchers; } });
Object.defineProperty(exports, "qaPulseMatchers", { enumerable: true, get: function () { return jest_1.qaPulseMatchers; } });
var wdio_1 = require("./adapters/wdio");
Object.defineProperty(exports, "QAPulseWdioAssert", { enumerable: true, get: function () { return wdio_1.QAPulseWdioAssert; } });
Object.defineProperty(exports, "qaPulseWdioAssert", { enumerable: true, get: function () { return wdio_1.qaPulseWdioAssert; } });
// Core assertions (framework-agnostic)
var fuzzy_1 = require("./assertions/fuzzy");
Object.defineProperty(exports, "assertFuzzyMatch", { enumerable: true, get: function () { return fuzzy_1.assertFuzzyMatch; } });
Object.defineProperty(exports, "assertContains", { enumerable: true, get: function () { return fuzzy_1.assertContains; } });
Object.defineProperty(exports, "assertMatches", { enumerable: true, get: function () { return fuzzy_1.assertMatches; } });
Object.defineProperty(exports, "assertApproximately", { enumerable: true, get: function () { return fuzzy_1.assertApproximately; } });
Object.defineProperty(exports, "assertArrayContains", { enumerable: true, get: function () { return fuzzy_1.assertArrayContains; } });
Object.defineProperty(exports, "assertObjectContains", { enumerable: true, get: function () { return fuzzy_1.assertObjectContains; } });
var semantic_1 = require("./assertions/semantic");
Object.defineProperty(exports, "assertContainsMeaning", { enumerable: true, get: function () { return semantic_1.assertContainsMeaning; } });
Object.defineProperty(exports, "assertMatchesSpec", { enumerable: true, get: function () { return semantic_1.assertMatchesSpec; } });
Object.defineProperty(exports, "assertVisualMatch", { enumerable: true, get: function () { return semantic_1.assertVisualMatch; } });
Object.defineProperty(exports, "assertAccessible", { enumerable: true, get: function () { return semantic_1.assertAccessible; } });
Object.defineProperty(exports, "assertSatisfiesRule", { enumerable: true, get: function () { return semantic_1.assertSatisfiesRule; } });
var accessibility_1 = require("./assertions/accessibility");
Object.defineProperty(exports, "assertAccessibility", { enumerable: true, get: function () { return accessibility_1.assertAccessibility; } });
Object.defineProperty(exports, "checkAccessibility", { enumerable: true, get: function () { return accessibility_1.checkAccessibility; } });
var api_1 = require("./assertions/api");
Object.defineProperty(exports, "assertStatus", { enumerable: true, get: function () { return api_1.assertStatus; } });
Object.defineProperty(exports, "assertSuccess", { enumerable: true, get: function () { return api_1.assertSuccess; } });
Object.defineProperty(exports, "assertBodyContains", { enumerable: true, get: function () { return api_1.assertBodyContains; } });
Object.defineProperty(exports, "assertHeader", { enumerable: true, get: function () { return api_1.assertHeader; } });
Object.defineProperty(exports, "assertResponseTime", { enumerable: true, get: function () { return api_1.assertResponseTime; } });
Object.defineProperty(exports, "assertSchema", { enumerable: true, get: function () { return api_1.assertSchema; } });
//# sourceMappingURL=index.js.map