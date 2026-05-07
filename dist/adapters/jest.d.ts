import { QAPulseAssertConfig } from '../core/types';
import { APIResponse } from '../assertions/api';
declare const qaPulseMatchers: {
    toFuzzyMatch(received: string, expected: string, options?: {
        threshold?: number;
    }): {
        pass: boolean;
        message: () => string;
    };
    toContainText(received: string, expected: string): {
        pass: boolean;
        message: () => string;
    };
    toContainObject(received: Record<string, unknown>, expected: Record<string, unknown>): {
        pass: boolean;
        message: () => string;
    };
    toContainItem<T>(received: T[], expected: T): {
        pass: boolean;
        message: () => string;
    };
    toBeAccessible(received: string, options?: {
        ignoreRules?: string[];
    }): {
        pass: boolean;
        message: () => string;
    };
    toHaveStatus(received: APIResponse, expected: number): {
        pass: boolean;
        message: () => string;
    };
    toBeSuccessful(received: APIResponse): {
        pass: boolean;
        message: () => string;
    };
    toHaveBody(received: APIResponse, expected: Record<string, unknown>): {
        pass: boolean;
        message: () => string;
    };
    toRespondWithin(received: APIResponse, maxMs: number): {
        pass: boolean;
        message: () => string;
    };
    toMatchSchema(received: APIResponse, schema: Record<string, string>): {
        pass: boolean;
        message: () => string;
    };
    toMean(received: string, expectation: string): Promise<{
        pass: boolean;
        message: () => string;
    }>;
    toMatchSpec(received: string, spec: string): Promise<{
        pass: boolean;
        message: () => string;
    }>;
    toSatisfyRule(received: string, rule: string): Promise<{
        pass: boolean;
        message: () => string;
    }>;
};
/**
 * Setup QAPulseSK custom matchers for Jest or Vitest.
 *
 * @example
 * // jest.setup.ts or vitest.setup.ts
 * import { setupQAPulseMatchers } from 'qapulsesk-assert/jest';
 * setupQAPulseMatchers({ ai: { enabled: true, provider: 'anthropic', apiKey: process.env.AI_KEY } });
 */
export declare function setupQAPulseMatchers(config?: QAPulseAssertConfig): void;
export { qaPulseMatchers };
export type { APIResponse };
export default setupQAPulseMatchers;
//# sourceMappingURL=jest.d.ts.map