import { AssertResult } from '../core/types';
export interface A11yCheckResult {
    passed: boolean;
    message: string;
    violations: Array<{
        id: string;
        description: string;
        impact: string;
        nodes: string[];
    }>;
    passCount: number;
}
/**
 * Free rule-based accessibility check — no AI required.
 * Checks common WCAG 2.1 AA patterns against raw HTML.
 */
export declare function checkAccessibility(html: string, options?: {
    ignoreRules?: string[];
}): A11yCheckResult;
/**
 * Assert that HTML has no accessibility violations.
 */
export declare function assertAccessibility(html: string, options?: {
    ignoreRules?: string[];
}): AssertResult;
//# sourceMappingURL=accessibility.d.ts.map