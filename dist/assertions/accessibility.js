"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAccessibility = checkAccessibility;
exports.assertAccessibility = assertAccessibility;
const RULES = [
    {
        id: 'img-alt',
        description: 'Images must have alt text',
        check: (html) => {
            const imgWithoutAlt = (html.match(/<img(?![^>]*\balt\s*=)[^>]*>/gi) || []);
            return { passed: imgWithoutAlt.length === 0, nodes: imgWithoutAlt.slice(0, 5) };
        },
    },
    {
        id: 'input-label',
        description: 'Form inputs must have associated labels',
        check: (html) => {
            const inputs = (html.match(/<input(?![^>]*type\s*=\s*["'](?:hidden|submit|button|reset|image)["'])[^>]*>/gi) || []);
            const missing = inputs.filter(inp => {
                const hasAriaLabel = /aria-label\s*=/i.test(inp);
                const hasAriaLabelledBy = /aria-labelledby\s*=/i.test(inp);
                const hasId = /\bid\s*=\s*["']([^"']+)["']/i.exec(inp);
                if (hasAriaLabel || hasAriaLabelledBy)
                    return false;
                if (hasId) {
                    const id = hasId[1];
                    return !new RegExp(`for\\s*=\\s*["']${id}["']`, 'i').test(html);
                }
                return true;
            });
            return { passed: missing.length === 0, nodes: missing.slice(0, 5) };
        },
    },
    {
        id: 'heading-order',
        description: 'Headings must not skip levels',
        check: (html) => {
            const headings = (html.match(/<h[1-6][^>]*>/gi) || []).map(h => parseInt(h[2]));
            const violations = [];
            for (let i = 1; i < headings.length; i++) {
                if (headings[i] - headings[i - 1] > 1) {
                    violations.push(`Heading jumped from h${headings[i - 1]} to h${headings[i]}`);
                }
            }
            return { passed: violations.length === 0, nodes: violations };
        },
    },
    {
        id: 'button-name',
        description: 'Buttons must have accessible names',
        check: (html) => {
            const emptyButtons = (html.match(/<button[^>]*>\s*<\/button>/gi) || []);
            const noAriaButtons = (html.match(/<button(?![^>]*(?:aria-label|aria-labelledby))[^>]*>\s*(?:<\/button>|<[^>]+>\s*<\/[^>]+>\s*<\/button>)/gi) || []);
            const violations = [...emptyButtons, ...noAriaButtons].slice(0, 5);
            return { passed: violations.length === 0, nodes: violations.map(b => b.slice(0, 80)) };
        },
    },
    {
        id: 'link-name',
        description: 'Links must have discernible text',
        check: (html) => {
            const emptyLinks = (html.match(/<a[^>]*href[^>]*>\s*<\/a>/gi) || []);
            return { passed: emptyLinks.length === 0, nodes: emptyLinks.slice(0, 5) };
        },
    },
    {
        id: 'html-lang',
        description: 'HTML element must have a lang attribute',
        check: (html) => {
            const hasHtml = /<html[^>]*>/i.test(html);
            if (!hasHtml)
                return { passed: true, nodes: [] };
            const hasLang = /<html[^>]*\blang\s*=/i.test(html);
            return { passed: hasLang, nodes: hasLang ? [] : ['<html> element missing lang attribute'] };
        },
    },
    {
        id: 'color-contrast',
        description: 'Text must have sufficient color contrast (rule: inline styles only)',
        check: (html) => {
            // Basic inline style check — flags very low-opacity text
            const lowContrast = (html.match(/color\s*:\s*rgba\s*\([^)]*,\s*0\.[0-2]\d*\s*\)/gi) || []);
            return { passed: lowContrast.length === 0, nodes: lowContrast.slice(0, 3) };
        },
    },
];
/**
 * Free rule-based accessibility check — no AI required.
 * Checks common WCAG 2.1 AA patterns against raw HTML.
 */
function checkAccessibility(html, options = {}) {
    const { ignoreRules = [] } = options;
    const violations = [];
    let passCount = 0;
    for (const rule of RULES) {
        if (ignoreRules.includes(rule.id))
            continue;
        const result = rule.check(html);
        if (result.passed) {
            passCount++;
        }
        else {
            violations.push({
                id: rule.id,
                description: rule.description,
                impact: 'moderate',
                nodes: result.nodes,
            });
        }
    }
    const passed = violations.length === 0;
    return {
        passed,
        message: passed
            ? `Accessibility check passed (${passCount} rules checked)`
            : `${violations.length} accessibility violation(s) found:\n${violations.map(v => `  [${v.id}] ${v.description}`).join('\n')}`,
        violations,
        passCount,
    };
}
/**
 * Assert that HTML has no accessibility violations.
 */
function assertAccessibility(html, options = {}) {
    const result = checkAccessibility(html, options);
    return {
        passed: result.passed,
        message: result.message,
    };
}
//# sourceMappingURL=accessibility.js.map