"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.qaPulseMatchers = exports.setupQAPulseMatchers = void 0;
// Vitest uses the same expect.extend API as Jest
// This adapter re-exports the Jest adapter for clarity
var jest_1 = require("./jest");
Object.defineProperty(exports, "setupQAPulseMatchers", { enumerable: true, get: function () { return jest_1.setupQAPulseMatchers; } });
Object.defineProperty(exports, "qaPulseMatchers", { enumerable: true, get: function () { return jest_1.qaPulseMatchers; } });
var jest_2 = require("./jest");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return jest_2.setupQAPulseMatchers; } });
//# sourceMappingURL=vitest.js.map