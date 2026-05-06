# QAPulseSK-assert

[![npm version](https://img.shields.io/npm/v/qapulsesk-assert?style=for-the-badge&color=3b82f6)](https://www.npmjs.com/package/qapulsesk-assert)
[![npm downloads](https://img.shields.io/npm/dm/qapulsesk-assert?style=for-the-badge&color=22c55e)](https://www.npmjs.com/package/qapulsesk-assert)
[![License: MIT](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-22c55e?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![QAPulse by SK](https://img.shields.io/badge/QAPulse%20by%20SK-Test%20Automation%20Hub-3b82f6?style=for-the-badge)](https://skakarh.com)

> **The only assertion library that works everywhere.**
> Playwright · Cypress · Jest · Vitest · WebdriverIO — fuzzy, semantic, visual & accessibility assertions in one package.

---

## ✨ Why QAPulseSK-assert?

| Assertion Type | Standard Libraries | QAPulseSK-assert |
|---|---|---|
| Exact match | ✅ | ✅ |
| Fuzzy / typo-tolerant | ❌ | ✅ Free |
| Semantic ("means X") | ❌ | ✅ AI opt-in |
| Accessibility (rule-based) | Separate package | ✅ Free built-in |
| Accessibility (AI) | ❌ | ✅ AI opt-in |
| Business rules ("prices must be positive") | ❌ | ✅ AI opt-in |
| API response assertions | Separate package | ✅ Free built-in |
| All frameworks | Separate package each | ✅ One package |

---

## 🚀 Install

```bash
npm install qapulsesk-assert --save-dev
```

---

## 📖 Usage

### Playwright

```typescript
import { qaPulseAssert } from 'qapulsesk-assert/playwright';

test('login flow', async ({ page }) => {
  const qa = qaPulseAssert(page, {
    // 🤖 AI optional — remove this block for free mode
    ai: { enabled: true, provider: 'anthropic', apiKey: process.env.AI_KEY },
  });

  await page.goto('/login');

  // ✅ Free: fuzzy match (handles typos)
  await qa.toFuzzyHaveText('h1', 'Login to your accont', { threshold: 0.8 });

  // ✅ Free: contains text
  await qa.toContainText('#footer', 'Privacy Policy');

  // ✅ Free: accessibility check (no AI key needed)
  await qa.toBeAccessible();

  // 🤖 AI: semantic meaning
  await qa.toMean('#welcome', 'user is logged in successfully');

  // 🤖 AI: page spec
  await qa.pageMatchesSpec('dashboard with navigation menu and user profile');

  // 🤖 AI: business rule
  await qa.satisfiesRule('#price', 'must be a positive number with currency symbol');
});
```

### Cypress

```typescript
// cypress/support/commands.ts
import { registerQAPulseCommands } from 'qapulsesk-assert/cypress';

registerQAPulseCommands({
  ai: { enabled: true, provider: 'anthropic', apiKey: Cypress.env('AI_KEY') },
});

// In your test:
it('should show the dashboard', () => {
  cy.visit('/dashboard');

  // ✅ Free
  cy.get('h1').qpFuzzyText('Dashbord Overview', { threshold: 0.8 });
  cy.get('body').qpBeAccessible();

  // 🤖 AI
  cy.get('#welcome').qpMean('user is logged in');
  cy.qpMatchesSpec('dashboard with charts and navigation');
});
```

### Jest

```typescript
// jest.setup.ts
import { setupQAPulseMatchers } from 'qapulsesk-assert/jest';
setupQAPulseMatchers({
  ai: { enabled: true, provider: 'anthropic', apiKey: process.env.AI_KEY },
});

// In your test:
it('should validate response', async () => {
  const response = { status: 200, headers: {}, body: { user: 'John', active: true } };

  // ✅ Free: API assertions
  expect(response).toBeSuccessful();
  expect(response).toHaveBody({ user: 'John' });
  expect(response).toMatchSchema({ user: 'string', active: 'boolean' });

  // ✅ Free: fuzzy text
  expect('Welcme to the app').toFuzzyMatch('Welcome to the app');

  // ✅ Free: accessibility
  expect(htmlString).toBeAccessible();

  // 🤖 AI: semantic
  await expect('You have been logged out').toMean('user session ended');

  // 🤖 AI: rule
  await expect('$29.99').toSatisfyRule('must be a price with dollar sign');
});
```

### Vitest

```typescript
// vitest.setup.ts
import { setupQAPulseMatchers } from 'qapulsesk-assert/vitest';
setupQAPulseMatchers({ ai: { enabled: true, apiKey: import.meta.env.AI_KEY } });

// Same matchers as Jest ↑
```

### WebdriverIO

```typescript
import { qaPulseWdioAssert } from 'qapulsesk-assert/wdio';

const qa = qaPulseWdioAssert(browser, {
  ai: { enabled: true, provider: 'anthropic', apiKey: process.env.AI_KEY },
});

await qa.toFuzzyHaveText('#heading', 'Dashbord');
await qa.toBeAccessible();
await qa.toMean('#status', 'order is confirmed');
```

---

## 🤖 AI Assertions (Optional)

**Free by default.** Enable AI by providing your own API key — we never call any service without it.

```typescript
ai: {
  enabled: true,
  provider: 'anthropic', // 'anthropic' | 'openai' | 'gemini'
  apiKey: process.env.AI_KEY,
  model: 'claude-3-5-haiku-20241022', // optional — auto-selected
}
```

| Assertion | Description |
|---|---|
| `toMean(text)` | Does this content semantically mean X? |
| `pageMatchesSpec(spec)` | Does this page match the spec description? |
| `toSatisfyRule(rule)` | Does this value satisfy the business rule? |
| `toBeAccessibleAI(level)` | Deep AI accessibility analysis (WCAG A/AA/AAA) |

---

## ✅ Free Assertions (No AI Key)

| Assertion | Description |
|---|---|
| `toFuzzyMatch(expected)` | Fuzzy text match with typo tolerance |
| `toContainText(expected)` | Contains substring |
| `toBeAccessible()` | Rule-based WCAG 2.1 AA check |
| `toHaveStatus(code)` | HTTP status code |
| `toBeSuccessful()` | 2xx status |
| `toHaveBody(obj)` | Response body contains values |
| `toMatchSchema(schema)` | Response body type schema |
| `toRespondWithin(ms)` | Response under time limit |
| `toContainObject(obj)` | Object contains all keys/values |
| `toContainItem(item)` | Array contains item |

---

## 📬 Links

| | |
|---|---|
| 🌐 Website | [skakarh.com](https://skakarh.com) |
| 📦 npm | [npmjs.com/package/qapulsesk-assert](https://www.npmjs.com/package/qapulsesk-assert) |
| 🐛 Issues | [GitHub Issues](https://github.com/QAPulse-by-SK/QAPulseSK-assert/issues) |
| 💼 LinkedIn | [company/qapulsebysk](https://linkedin.com/company/qapulsebysk) |
| 🐦 Twitter/X | [@qapulsebysk](https://twitter.com/qapulsebysk) |

---

**Built with ❤️ by [QAPulse by SK](https://skakarh.com)**

*If this saved you time, please ⭐ the repo — it helps others find it!*
