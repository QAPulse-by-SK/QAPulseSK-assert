import { QAPulseAssertConfig } from '../core/types';
type WdioBrowser = any;
export declare class QAPulseWdioAssert {
    private browser;
    private aiConfig?;
    constructor(browser: WdioBrowser, config?: QAPulseAssertConfig);
    private requireAI;
    toFuzzyHaveText(selector: string, expected: string, options?: {
        threshold?: number;
    }): Promise<void>;
    toContainText(selector: string, expected: string): Promise<void>;
    toBeAccessible(options?: {
        ignoreRules?: string[];
    }): Promise<void>;
    toMean(selector: string, expectation: string): Promise<void>;
    satisfiesRule(selector: string, rule: string): Promise<void>;
}
export declare function qaPulseWdioAssert(browser: WdioBrowser, config?: QAPulseAssertConfig): QAPulseWdioAssert;
export default qaPulseWdioAssert;
//# sourceMappingURL=wdio.d.ts.map