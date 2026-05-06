/**
 * QAPulseSK-assert Cypress adapter
 * Register in cypress/support/commands.ts:
 *   import { registerQAPulseCommands } from 'qapulsesk-assert/cypress';
 *   registerQAPulseCommands({ ai: { enabled: true, apiKey: '...' } });
 *
 * This file is not compiled by the main TypeScript build as it requires
 * Cypress globals (Cypress, cy, expect) which are only available in a Cypress context.
 */

// Import types only - not compiled in main build
import type { QAPulseAssertConfig, AIAssertConfig } from '../core/types';

// This module is loaded directly by Cypress, not bundled
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { assertFuzzyMatch, assertContains } = require('../assertions/fuzzy');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { assertContainsMeaning, assertMatchesSpec, assertSatisfiesRule } = require('../assertions/semantic');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { assertAccessibility } = require('../assertions/accessibility');

export function registerQAPulseCommands(config: QAPulseAssertConfig = {}): void {
  const ai: AIAssertConfig | undefined = config.ai;

  /* global Cypress, cy, expect */
  // @ts-ignore - Cypress globals available at runtime
  Cypress.Commands.add('qpFuzzyText', { prevSubject: 'element' }, (subject: JQuery, expected: string, options = {}) => {
    const result = assertFuzzyMatch(subject.text().trim(), expected, options);
    // @ts-ignore
    expect(result.passed, result.message).to.be.true;
    return cy.wrap(subject);
  });

  // @ts-ignore
  Cypress.Commands.add('qpContainsText', { prevSubject: 'element' }, (subject: JQuery, expected: string) => {
    const result = assertContains(subject.text().trim(), expected);
    // @ts-ignore
    expect(result.passed, result.message).to.be.true;
    return cy.wrap(subject);
  });

  // @ts-ignore
  Cypress.Commands.add('qpBeAccessible', (options = {}) => {
    cy.document().then((doc: Document) => {
      const result = assertAccessibility(doc.documentElement.outerHTML, options);
      // @ts-ignore
      expect(result.passed, result.message).to.be.true;
    });
  });

  // @ts-ignore
  Cypress.Commands.add('qpMean', { prevSubject: 'element' }, (subject: JQuery, expectation: string) => {
    if (!ai?.enabled || !ai?.apiKey) throw new Error('[QAPulseSK-assert] AI commands require ai config');
    // @ts-ignore
    return cy.wrap(assertContainsMeaning(subject.text().trim(), expectation, ai).then((result: any) => {
      // @ts-ignore
      expect(result.passed, result.message).to.be.true;
    }));
  });

  // @ts-ignore
  Cypress.Commands.add('qpMatchesSpec', (spec: string) => {
    if (!ai?.enabled || !ai?.apiKey) throw new Error('[QAPulseSK-assert] AI commands require ai config');
    cy.document().then((doc: Document) => {
      // @ts-ignore
      return assertMatchesSpec((doc.body as HTMLElement).innerText, spec, ai).then((result: any) => {
        // @ts-ignore
        expect(result.passed, result.message).to.be.true;
      });
    });
  });

  // @ts-ignore
  Cypress.Commands.add('qpSatisfiesRule', { prevSubject: 'element' }, (subject: JQuery, rule: string) => {
    if (!ai?.enabled || !ai?.apiKey) throw new Error('[QAPulseSK-assert] AI commands require ai config');
    // @ts-ignore
    return cy.wrap(assertSatisfiesRule(subject.text().trim(), rule, ai).then((result: any) => {
      // @ts-ignore
      expect(result.passed, result.message).to.be.true;
    }));
  });
}

export default registerQAPulseCommands;
