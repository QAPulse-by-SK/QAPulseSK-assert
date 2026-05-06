import { AIAssertConfig, QAPulseAssertConfig } from '../core/types';
import { assertFuzzyMatch, assertContains } from '../assertions/fuzzy';
import { assertContainsMeaning, assertMatchesSpec, assertSatisfiesRule } from '../assertions/semantic';
import { assertAccessibility } from '../assertions/accessibility';

/**
 * Register QAPulseSK-assert custom Cypress commands.
 *
 * Usage in cypress/support/commands.ts:
 *   import { registerQAPulseCommands } from 'qapulsesk-assert/cypress';
 *   registerQAPulseCommands({ ai: { enabled: true, provider: 'anthropic', apiKey: '...' } });
 */
export function registerQAPulseCommands(config: QAPulseAssertConfig = {}): void {
  const ai: AIAssertConfig | undefined = config.ai;

  // ─── Free: Fuzzy text match ─────────────────────────────────────────
  Cypress.Commands.add(
    'qpFuzzyText' as never,
    { prevSubject: 'element' },
    (subject: JQuery<HTMLElement>, expected: string, options: { threshold?: number } = {}) => {
      const actual = (subject as JQuery<HTMLElement>).text().trim();
      const result = assertFuzzyMatch(actual, expected, options);
      expect(result.passed, result.message).to.be.true;
      return cy.wrap(subject);
    }
  );

  // ─── Free: Contains text ────────────────────────────────────────────
  Cypress.Commands.add(
    'qpContainsText' as never,
    { prevSubject: 'element' },
    (subject: JQuery<HTMLElement>, expected: string) => {
      const actual = (subject as JQuery<HTMLElement>).text().trim();
      const result = assertContains(actual, expected);
      expect(result.passed, result.message).to.be.true;
      return cy.wrap(subject);
    }
  );

  // ─── Free: Accessibility check ──────────────────────────────────────
  Cypress.Commands.add(
    'qpBeAccessible' as never,
    (options: { ignoreRules?: string[] } = {}) => {
      cy.document().then(doc => {
        const result = assertAccessibility(doc.documentElement.outerHTML, options);
        expect(result.passed, result.message).to.be.true;
      });
    }
  );

  // ─── AI: Semantic meaning assertion ────────────────────────────────
  Cypress.Commands.add(
    'qpMean' as never,
    { prevSubject: 'element' },
    (subject: JQuery<HTMLElement>, expectation: string) => {
      if (!ai?.enabled || !ai?.apiKey) {
        throw new Error('[QAPulseSK-assert] AI commands require ai config in registerQAPulseCommands()');
      }
      const actual = (subject as JQuery<HTMLElement>).text().trim();
      return cy.wrap(
        assertContainsMeaning(actual, expectation, ai).then(result => {
          expect(result.passed, result.message).to.be.true;
        })
      );
    }
  );

  // ─── AI: Page spec assertion ────────────────────────────────────────
  Cypress.Commands.add(
    'qpMatchesSpec' as never,
    (spec: string) => {
      if (!ai?.enabled || !ai?.apiKey) {
        throw new Error('[QAPulseSK-assert] AI commands require ai config in registerQAPulseCommands()');
      }
      cy.document().then(doc => {
        const content = doc.body.innerText;
        return assertMatchesSpec(content, spec, ai).then(result => {
          expect(result.passed, result.message).to.be.true;
        });
      });
    }
  );

  // ─── AI: Business rule assertion ────────────────────────────────────
  Cypress.Commands.add(
    'qpSatisfiesRule' as never,
    { prevSubject: 'element' },
    (subject: JQuery<HTMLElement>, rule: string) => {
      if (!ai?.enabled || !ai?.apiKey) {
        throw new Error('[QAPulseSK-assert] AI commands require ai config in registerQAPulseCommands()');
      }
      const actual = (subject as JQuery<HTMLElement>).text().trim();
      return cy.wrap(
        assertSatisfiesRule(actual, rule, ai).then(result => {
          expect(result.passed, result.message).to.be.true;
        })
      );
    }
  );
}

// TypeScript declarations for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /** Free: Fuzzy text match assertion */
      qpFuzzyText(expected: string, options?: { threshold?: number }): Chainable<JQuery<HTMLElement>>;
      /** Free: Contains text assertion */
      qpContainsText(expected: string): Chainable<JQuery<HTMLElement>>;
      /** Free: Accessibility check */
      qpBeAccessible(options?: { ignoreRules?: string[] }): void;
      /** 🤖 AI: Semantic meaning assertion */
      qpMean(expectation: string): Chainable<JQuery<HTMLElement>>;
      /** 🤖 AI: Page spec assertion */
      qpMatchesSpec(spec: string): void;
      /** 🤖 AI: Business rule assertion */
      qpSatisfiesRule(rule: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export default registerQAPulseCommands;
