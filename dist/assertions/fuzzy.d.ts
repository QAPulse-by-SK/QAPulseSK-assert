import { AssertResult, FuzzyOptions } from '../core/types';
/**
 * Asserts that actual text fuzzy-matches expected text.
 * Threshold: 0-1 (default 0.8). Handles typos, minor differences.
 */
export declare function assertFuzzyMatch(actual: string, expected: string, opts?: FuzzyOptions): AssertResult;
/**
 * Asserts that actual text contains expected text (case-insensitive by default).
 */
export declare function assertContains(actual: string, expected: string, opts?: FuzzyOptions): AssertResult;
/**
 * Asserts that text matches a pattern (string or regex).
 */
export declare function assertMatches(actual: string, pattern: string | RegExp): AssertResult;
/**
 * Asserts that a number is within an acceptable range (±tolerance).
 */
export declare function assertApproximately(actual: number, expected: number, tolerance: number): AssertResult;
/**
 * Asserts that an array contains an item (deep equality check).
 */
export declare function assertArrayContains<T>(actual: T[], expected: T): AssertResult;
/**
 * Asserts that an object has all expected keys with matching values.
 */
export declare function assertObjectContains(actual: Record<string, unknown>, expected: Record<string, unknown>): AssertResult;
//# sourceMappingURL=fuzzy.d.ts.map