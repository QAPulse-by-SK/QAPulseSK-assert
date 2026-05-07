import { QAPulseAssertConfig } from '../core/types';
type Page = any;
export declare class QAPulsePlaywrightAssert {
    private page;
    private aiConfig?;
    constructor(page: Page, config?: QAPulseAssertConfig);
    private requireAI;
    toBeVisible(selector: string): Promise<void>;
    toFuzzyHaveText(selector: string, expected: string, options?: {
        threshold?: number;
    }): Promise<void>;
    toContainText(selector: string, expected: string): Promise<void>;
    toBeAccessible(options?: {
        ignoreRules?: string[];
    }): Promise<void>;
    toMean(selector: string, expectation: string): Promise<void>;
    pageMatchesSpec(spec: string): Promise<void>;
    toBeAccessibleAI(level?: 'A' | 'AA' | 'AAA'): Promise<void>;
    satisfiesRule(selector: string, rule: string): Promise<void>;
}
export declare function qaPulseAssert(page: Page, config?: QAPulseAssertConfig): QAPulsePlaywrightAssert;
export default qaPulseAssert;
//# sourceMappingURL=playwright.d.ts.map