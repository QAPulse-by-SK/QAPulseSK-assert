import { AssertResult, AIAssertConfig } from '../core/types';
/**
 * Semantically asserts that content matches an expectation using AI.
 * Example: assertContainsMeaning("Welcome back, John!", "user is logged in")
 */
export declare function assertContainsMeaning(actual: string, expectation: string, config: AIAssertConfig, context?: string): Promise<AssertResult>;
/**
 * Asserts that a page/component matches a spec description using AI.
 * Example: assertMatchesSpec(pageText, "login form with email and password fields")
 */
export declare function assertMatchesSpec(actual: string, spec: string, config: AIAssertConfig): Promise<AssertResult>;
/**
 * Asserts that two visual descriptions or texts match visually using AI.
 */
export declare function assertVisualMatch(actual: string, expected: string, config: AIAssertConfig): Promise<AssertResult>;
/**
 * Asserts WCAG accessibility compliance using AI analysis of HTML.
 */
export declare function assertAccessible(html: string, config: AIAssertConfig, level?: 'A' | 'AA' | 'AAA'): Promise<AssertResult & {
    violations?: Array<{
        id: string;
        impact: string;
        description: string;
    }>;
}>;
/**
 * Asserts that response/content satisfies a business rule described in plain English.
 * Example: assertSatisfiesRule(responseBody, "all prices must be positive numbers")
 */
export declare function assertSatisfiesRule(actual: string, rule: string, config: AIAssertConfig): Promise<AssertResult>;
//# sourceMappingURL=semantic.d.ts.map