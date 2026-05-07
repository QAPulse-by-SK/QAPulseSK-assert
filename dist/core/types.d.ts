export interface QAPulseAssertConfig {
    ai?: AIAssertConfig;
    fuzzyThreshold?: number;
    screenshotDir?: string;
}
export interface AIAssertConfig {
    enabled: boolean;
    provider?: 'anthropic' | 'openai' | 'gemini';
    apiKey?: string;
    model?: string;
}
export interface AssertResult {
    passed: boolean;
    message: string;
    expected?: unknown;
    actual?: unknown;
    diff?: string;
}
export interface FuzzyOptions {
    threshold?: number;
    caseSensitive?: boolean;
    ignoreWhitespace?: boolean;
}
export interface SemanticOptions {
    aiConfig: AIAssertConfig;
    context?: string;
}
export interface VisualOptions {
    threshold?: number;
    screenshotDir?: string;
    updateBaseline?: boolean;
}
export interface AccessibilityOptions {
    level?: 'A' | 'AA' | 'AAA';
    rules?: string[];
    ignoreRules?: string[];
}
export interface A11yViolation {
    id: string;
    impact: 'minor' | 'moderate' | 'serious' | 'critical';
    description: string;
    nodes: string[];
}
export interface A11yResult {
    violations: A11yViolation[];
    passes: number;
    incomplete: number;
}
export type SupportedFramework = 'playwright' | 'cypress' | 'jest' | 'vitest' | 'wdio';
//# sourceMappingURL=types.d.ts.map