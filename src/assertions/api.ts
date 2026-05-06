import { AssertResult } from '../core/types';

export interface APIResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  duration?: number;
}

/**
 * Assert HTTP response status code.
 */
export function assertStatus(response: APIResponse, expected: number): AssertResult {
  const passed = response.status === expected;
  return {
    passed,
    message: passed
      ? `Response status is ${expected}`
      : `Expected status ${expected} but got ${response.status}`,
    expected,
    actual: response.status,
  };
}

/**
 * Assert response status is in 2xx range.
 */
export function assertSuccess(response: APIResponse): AssertResult {
  const passed = response.status >= 200 && response.status < 300;
  return {
    passed,
    message: passed
      ? `Response is successful (${response.status})`
      : `Expected successful response but got ${response.status}`,
    expected: '2xx',
    actual: response.status,
  };
}

/**
 * Assert response body contains expected key/value pairs.
 */
export function assertBodyContains(
  response: APIResponse,
  expected: Record<string, unknown>
): AssertResult {
  const body = response.body as Record<string, unknown>;
  const missing: string[] = [];

  for (const [key, val] of Object.entries(expected)) {
    const actual = body?.[key];
    if (JSON.stringify(actual) !== JSON.stringify(val)) {
      missing.push(`"${key}": expected ${JSON.stringify(val)}, got ${JSON.stringify(actual)}`);
    }
  }

  const passed = missing.length === 0;
  return {
    passed,
    message: passed
      ? `Response body contains all expected values`
      : `Response body mismatch:\n${missing.join('\n')}`,
    expected,
    actual: body,
  };
}

/**
 * Assert response header exists and optionally matches a value.
 */
export function assertHeader(
  response: APIResponse,
  name: string,
  expectedValue?: string
): AssertResult {
  const headerName = name.toLowerCase();
  const actual = Object.entries(response.headers).find(
    ([k]) => k.toLowerCase() === headerName
  )?.[1];

  if (actual === undefined) {
    return {
      passed: false,
      message: `Expected header "${name}" to be present but it was missing`,
      expected: expectedValue || `header "${name}" to exist`,
      actual: undefined,
    };
  }

  if (expectedValue !== undefined) {
    const passed = actual === expectedValue;
    return {
      passed,
      message: passed
        ? `Header "${name}" is "${expectedValue}"`
        : `Header "${name}" expected "${expectedValue}" but got "${actual}"`,
      expected: expectedValue,
      actual,
    };
  }

  return {
    passed: true,
    message: `Header "${name}" is present with value "${actual}"`,
    actual,
  };
}

/**
 * Assert response time is under a threshold (ms).
 */
export function assertResponseTime(response: APIResponse, maxMs: number): AssertResult {
  if (response.duration === undefined) {
    return {
      passed: true,
      message: 'Response time not measured (duration not provided)',
    };
  }

  const passed = response.duration <= maxMs;
  return {
    passed,
    message: passed
      ? `Response time ${response.duration}ms is within ${maxMs}ms limit`
      : `Response time ${response.duration}ms exceeds ${maxMs}ms limit`,
    expected: maxMs,
    actual: response.duration,
  };
}

/**
 * Assert JSON response matches a schema shape (key types).
 */
export function assertSchema(
  response: APIResponse,
  schema: Record<string, string>
): AssertResult {
  const body = response.body as Record<string, unknown>;
  const errors: string[] = [];

  for (const [key, expectedType] of Object.entries(schema)) {
    const val = body?.[key];
    const actualType = val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val;
    if (actualType !== expectedType) {
      errors.push(`"${key}": expected ${expectedType} but got ${actualType}`);
    }
  }

  const passed = errors.length === 0;
  return {
    passed,
    message: passed
      ? `Response schema is valid`
      : `Schema validation failed:\n${errors.join('\n')}`,
    expected: schema,
    actual: body,
  };
}
