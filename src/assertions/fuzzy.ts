import { AssertResult, FuzzyOptions } from '../core/types';

function normalize(str: string, opts: FuzzyOptions): string {
  let s = opts.caseSensitive ? str : str.toLowerCase();
  if (opts.ignoreWhitespace) s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Asserts that actual text fuzzy-matches expected text.
 * Threshold: 0-1 (default 0.8). Handles typos, minor differences.
 */
export function assertFuzzyMatch(
  actual: string,
  expected: string,
  opts: FuzzyOptions = {}
): AssertResult {
  const threshold = opts.threshold ?? 0.8;
  const a = normalize(actual, opts);
  const e = normalize(expected, opts);
  const score = similarity(a, e);
  const passed = score >= threshold;

  return {
    passed,
    message: passed
      ? `Fuzzy match passed (similarity: ${(score * 100).toFixed(1)}%)`
      : `Fuzzy match failed. Expected similarity ≥${(threshold * 100).toFixed(0)}% but got ${(score * 100).toFixed(1)}%`,
    expected,
    actual,
  };
}

/**
 * Asserts that actual text contains expected text (case-insensitive by default).
 */
export function assertContains(
  actual: string,
  expected: string,
  opts: FuzzyOptions = {}
): AssertResult {
  const a = normalize(actual, opts);
  const e = normalize(expected, opts);
  const passed = a.includes(e);
  return {
    passed,
    message: passed
      ? `Text contains expected value`
      : `Expected text to contain "${expected}" but it did not.\nActual: "${actual}"`,
    expected,
    actual,
  };
}

/**
 * Asserts that text matches a pattern (string or regex).
 */
export function assertMatches(
  actual: string,
  pattern: string | RegExp
): AssertResult {
  const passed = typeof pattern === 'string'
    ? actual.includes(pattern)
    : pattern.test(actual);
  return {
    passed,
    message: passed
      ? `Pattern match passed`
      : `Expected "${actual}" to match ${pattern}`,
    expected: String(pattern),
    actual,
  };
}

/**
 * Asserts that a number is within an acceptable range (±tolerance).
 */
export function assertApproximately(
  actual: number,
  expected: number,
  tolerance: number
): AssertResult {
  const diff = Math.abs(actual - expected);
  const passed = diff <= tolerance;
  return {
    passed,
    message: passed
      ? `Value ${actual} is within ±${tolerance} of ${expected}`
      : `Expected ${actual} to be within ±${tolerance} of ${expected} (diff: ${diff})`,
    expected,
    actual,
  };
}

/**
 * Asserts that an array contains an item (deep equality check).
 */
export function assertArrayContains<T>(actual: T[], expected: T): AssertResult {
  const passed = actual.some(
    item => JSON.stringify(item) === JSON.stringify(expected)
  );
  return {
    passed,
    message: passed
      ? `Array contains expected item`
      : `Expected array to contain ${JSON.stringify(expected)}`,
    expected,
    actual,
  };
}

/**
 * Asserts that an object has all expected keys with matching values.
 */
export function assertObjectContains(
  actual: Record<string, unknown>,
  expected: Record<string, unknown>
): AssertResult {
  const missing: string[] = [];
  for (const [key, val] of Object.entries(expected)) {
    if (JSON.stringify(actual[key]) !== JSON.stringify(val)) {
      missing.push(`${key}: expected ${JSON.stringify(val)}, got ${JSON.stringify(actual[key])}`);
    }
  }
  const passed = missing.length === 0;
  return {
    passed,
    message: passed
      ? `Object contains all expected properties`
      : `Object mismatch:\n${missing.join('\n')}`,
    expected,
    actual,
  };
}
