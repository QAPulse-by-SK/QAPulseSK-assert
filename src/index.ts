// QAPulseSK-assert — All-in-one assertion library by QAPulse by SK
// https://skakarh.com · https://github.com/QAPulse-by-SK

// Adapters
export { QAPulsePlaywrightAssert, qaPulseAssert } from './adapters/playwright';
export { setupQAPulseMatchers, qaPulseMatchers } from './adapters/jest';
export { QAPulseWdioAssert, qaPulseWdioAssert } from './adapters/wdio';

// Core assertions (framework-agnostic)
export {
  assertFuzzyMatch,
  assertContains,
  assertMatches,
  assertApproximately,
  assertArrayContains,
  assertObjectContains,
} from './assertions/fuzzy';

export {
  assertContainsMeaning,
  assertMatchesSpec,
  assertVisualMatch,
  assertAccessible,
  assertSatisfiesRule,
} from './assertions/semantic';

export {
  assertAccessibility,
  checkAccessibility,
} from './assertions/accessibility';

export {
  assertStatus,
  assertSuccess,
  assertBodyContains,
  assertHeader,
  assertResponseTime,
  assertSchema,
} from './assertions/api';

// Types
export type {
  QAPulseAssertConfig,
  AIAssertConfig,
  AssertResult,
  FuzzyOptions,
  SemanticOptions,
  AccessibilityOptions,
  A11yViolation,
  A11yResult,
  SupportedFramework,
} from './core/types';

export type { APIResponse } from './assertions/api';
