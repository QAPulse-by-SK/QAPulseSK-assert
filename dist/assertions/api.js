"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertStatus = assertStatus;
exports.assertSuccess = assertSuccess;
exports.assertBodyContains = assertBodyContains;
exports.assertHeader = assertHeader;
exports.assertResponseTime = assertResponseTime;
exports.assertSchema = assertSchema;
/**
 * Assert HTTP response status code.
 */
function assertStatus(response, expected) {
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
function assertSuccess(response) {
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
function assertBodyContains(response, expected) {
    const body = response.body;
    const missing = [];
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
function assertHeader(response, name, expectedValue) {
    const headerName = name.toLowerCase();
    const actual = Object.entries(response.headers).find(([k]) => k.toLowerCase() === headerName)?.[1];
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
function assertResponseTime(response, maxMs) {
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
function assertSchema(response, schema) {
    const body = response.body;
    const errors = [];
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
//# sourceMappingURL=api.js.map