"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerQAPulseCommands = registerQAPulseCommands;
const fuzzy_1 = require("../assertions/fuzzy");
const semantic_1 = require("../assertions/semantic");
const accessibility_1 = require("../assertions/accessibility");
function registerQAPulseCommands(config = {}) {
    const ai = config.ai;
    Cypress.Commands.add('qpFuzzyText', { prevSubject: 'element' }, (subject, expected, options = {}) => {
        const actual = subject.text().trim();
        const result = (0, fuzzy_1.assertFuzzyMatch)(actual, expected, options);
        expect(result.passed, result.message).to.be.true;
        return cy.wrap(subject);
    });
    Cypress.Commands.add('qpContainsText', { prevSubject: 'element' }, (subject, expected) => {
        const actual = subject.text().trim();
        const result = (0, fuzzy_1.assertContains)(actual, expected);
        expect(result.passed, result.message).to.be.true;
        return cy.wrap(subject);
    });
    Cypress.Commands.add('qpBeAccessible', (options = {}) => {
        cy.document().then((doc) => {
            const result = (0, accessibility_1.assertAccessibility)(doc.documentElement.outerHTML, options);
            expect(result.passed, result.message).to.be.true;
        });
    });
    Cypress.Commands.add('qpMean', { prevSubject: 'element' }, (subject, expectation) => {
        if (!ai?.enabled || !ai?.apiKey)
            throw new Error('[QAPulseSK-assert] AI commands require ai config');
        const actual = subject.text().trim();
        return cy.wrap((0, semantic_1.assertContainsMeaning)(actual, expectation, ai).then((result) => {
            expect(result.passed, result.message).to.be.true;
        }));
    });
    Cypress.Commands.add('qpMatchesSpec', (spec) => {
        if (!ai?.enabled || !ai?.apiKey)
            throw new Error('[QAPulseSK-assert] AI commands require ai config');
        cy.document().then((doc) => {
            return (0, semantic_1.assertMatchesSpec)(doc.body.innerText, spec, ai).then((result) => {
                expect(result.passed, result.message).to.be.true;
            });
        });
    });
    Cypress.Commands.add('qpSatisfiesRule', { prevSubject: 'element' }, (subject, rule) => {
        if (!ai?.enabled || !ai?.apiKey)
            throw new Error('[QAPulseSK-assert] AI commands require ai config');
        const actual = subject.text().trim();
        return cy.wrap((0, semantic_1.assertSatisfiesRule)(actual, rule, ai).then((result) => {
            expect(result.passed, result.message).to.be.true;
        }));
    });
}
exports.default = registerQAPulseCommands;
//# sourceMappingURL=cypress.js.map