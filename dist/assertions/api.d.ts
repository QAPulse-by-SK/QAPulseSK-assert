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
export declare function assertStatus(response: APIResponse, expected: number): AssertResult;
/**
 * Assert response status is in 2xx range.
 */
export declare function assertSuccess(response: APIResponse): AssertResult;
/**
 * Assert response body contains expected key/value pairs.
 */
export declare function assertBodyContains(response: APIResponse, expected: Record<string, unknown>): AssertResult;
/**
 * Assert response header exists and optionally matches a value.
 */
export declare function assertHeader(response: APIResponse, name: string, expectedValue?: string): AssertResult;
/**
 * Assert response time is under a threshold (ms).
 */
export declare function assertResponseTime(response: APIResponse, maxMs: number): AssertResult;
/**
 * Assert JSON response matches a schema shape (key types).
 */
export declare function assertSchema(response: APIResponse, schema: Record<string, string>): AssertResult;
//# sourceMappingURL=api.d.ts.map