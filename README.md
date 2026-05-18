<div align="center">

<img src="https://img.shields.io/badge/QA%20Pulse%20by%20SK-qapulsesk--assert-3b82f6?style=for-the-badge&logoColor=white" alt="qapulsesk-assert" height="40"/>

# qapulsesk-assert

**All-in-one assertion library for Playwright, Cypress, Jest, Vitest & WebdriverIO**
**Fuzzy matching · Schema validation · Accessibility · AI-powered assertions**

<br/>

[![npm version](https://img.shields.io/npm/v/qapulsesk-assert?color=3b82f6&logo=npm)](https://www.npmjs.com/package/qapulsesk-assert)
[![npm downloads](https://img.shields.io/npm/dm/qapulsesk-assert?color=22c55e)](https://www.npmjs.com/package/qapulsesk-assert)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-22c55e?logo=node.js&logoColor=white)](https://nodejs.org)

<br/>

🌐 **[www.skakarh.com](https://www.skakarh.com)** &nbsp;|&nbsp; 🏢 **[QAPulse-by-SK](https://github.com/QAPulse-by-SK)** &nbsp;|&nbsp; ⭐ **Star if it helped!**

</div>

---

## 📦 Installation

```bash
npm install qapulsesk-assert
```

---

## 🤔 Why qapulsesk-assert?

Every framework has its own assertion API. Playwright has one. Cypress has another. Jest has another. When you switch projects, you relearn assertions.

**qapulsesk-assert gives you one API that works everywhere.**

Plus it adds assertions that simply don't exist anywhere:

| Problem | Standard Library | qapulsesk-assert |
|---|---|---|
| Text changed slightly | ❌ Test breaks | ✅ Fuzzy match handles it |
| API schema validation | ❌ 6 separate `typeof` checks | ✅ One `assertSchema()` call |
| Page load SLA | ❌ Manual math + throw | ✅ `assertResponseTime()` |
| Accessibility check | ❌ Needs axe-core setup | ✅ Zero-config `toBeAccessible()` |
| AI semantic assertions | ❌ Doesn't exist | ✅ `toMean()`, `satisfiesRule()` |
| Cross-framework | ❌ Framework-locked | ✅ Works everywhere |

---

## 🚀 Quick Start

### Playwright
```typescript
import { qaPulseAssert, assertFuzzyMatch, assertSchema, assertResponseTime } from "qapulsesk-assert";

test("login page", async ({ page }) => {
  await page.goto("/login");
  const qa = qaPulseAssert(page);

  // Fuzzy text match — handles "Login Page" / "Log In Page" / "LOGIN PAGE"
  await qa.toFuzzyHaveText("h2", "Login Page", { threshold: 0.8 });

  // Zero-config accessibility check
  await qa.toBeAccessible();
});

test("API response", async ({ request }) => {
  const res  = await request.get("/api/posts/1");
  const body = await res.json();

  // Schema validation — all fields in one call
  assertSchema(
    { status: res.status(), headers: {}, body },
    { id: "number", title: "string", body: "string", userId: "number" }
  );
});
```

### Cypress
```javascript
const { assertFuzzyMatch, assertSchema, assertResponseTime } = require("qapulsesk-assert");

it("API schema validation", () => {
  cy.request("/api/posts/1").then((res) => {
    const result = assertSchema(
      { status: res.status, headers: {}, body: res.body },
      { id: "number", title: "string", userId: "number" }
    );
    expect(result.passed).to.be.true;
  });
});
```

### Jest / Vitest
```typescript
import { assertFuzzyMatch, assertObjectContains, assertApproximately } from "qapulsesk-assert";

test("fuzzy match", () => {
  const result = assertFuzzyMatch("Welcom to the internet", "Welcome to the internet", { threshold: 0.8 });
  expect(result.passed).toBe(true);
  console.log(result.message); // "Fuzzy match passed (similarity: 95.7%)"
});
```

---

## 📖 Full API Reference

### 🎭 Playwright Adapter

```typescript
const qa = qaPulseAssert(page);
// Optional: AI-enhanced mode
const qa = qaPulseAssert(page, { ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY } });
```

| Method | Description |
|--------|-------------|
| `qa.toBeVisible(selector)` | Assert element is visible |
| `qa.toContainText(selector, text)` | Assert element contains text |
| `qa.toFuzzyHaveText(selector, text, opts?)` | Fuzzy text match with similarity threshold |
| `qa.toBeAccessible(opts?)` | Zero-config WCAG 2.1 accessibility check |
| `qa.toMean(selector, meaning, opts?)` | AI: does this element MEAN what you think? *(AI key required)* |
| `qa.satisfiesRule(selector, rule, opts?)` | AI: does this element satisfy a business rule? *(AI key required)* |
| `qa.pageMatchesSpec(spec, opts?)` | AI: does the page match this specification? *(AI key required)* |

---

### 🔍 Fuzzy Assertions

```typescript
import { assertFuzzyMatch, assertContains, assertMatches } from "qapulsesk-assert";
```

#### `assertFuzzyMatch(actual, expected, options?)`
Levenshtein distance-based similarity check. Returns `{ passed, message }`.

```typescript
const result = assertFuzzyMatch("Welcom to the internet", "Welcome to the internet", { threshold: 0.8 });
// result.passed  → true
// result.message → "Fuzzy match passed (similarity: 95.7%)"
```

| Option | Default | Description |
|--------|---------|-------------|
| `threshold` | `0.8` | Minimum similarity 0–1 |
| `caseSensitive` | `false` | Case-sensitive matching |

#### `assertContains(text, substring)`
Case-insensitive substring check.

```typescript
const result = assertContains("Welcome to QA Pulse", "qa pulse");
// result.passed → true
```

#### `assertMatches(text, pattern)`
Regex pattern validation.

```typescript
const result = assertMatches("user@example.com", /^[\w.-]+@[\w.-]+\.\w+$/);
// result.passed → true
```

---

### 🔢 Numeric Assertions

#### `assertApproximately(actual, expected, tolerance)`
Value within ±tolerance range.

```typescript
const result = assertApproximately(99.87, 100, 0.5);
// result.passed  → true
// result.message → "Value 99.87 is within ±0.5 of 100"
```

---

### 📦 Collection Assertions

#### `assertArrayContains(array, item)`
Array membership with deep equality.

```typescript
const result = assertArrayContains([1, 2, 3], 2);
// result.passed → true
```

#### `assertObjectContains(object, subset)`
Partial object matching — ignores extra properties.

```typescript
const result = assertObjectContains(
  { id: 1, title: "QA Pulse", status: "active", createdAt: "2024-01-01" },
  { title: "QA Pulse", status: "active" }  // only check these 2 fields
);
// result.passed  → true
// result.message → "Object contains all expected properties"

// On failure:
// result.message → "Object mismatch:\n  title: expected 'Wrong', got 'QA Pulse'"
```

---

### 🌐 API Assertions

```typescript
import { assertStatus, assertSuccess, assertBodyContains, assertSchema, assertResponseTime } from "qapulsesk-assert";
```

All API assertions accept a response object: `{ status, headers, body, duration? }`

#### `assertStatus(response, statusCode)`
```typescript
assertStatus({ status: 200, headers: {}, body }, 200);
// "Response status is 200"
```

#### `assertSuccess(response)`
Passes for any 2xx status code.
```typescript
assertSuccess({ status: 201, headers: {}, body });
// "Response is successful (201)"
```

#### `assertBodyContains(response, subset)`
Partial body matching.
```typescript
assertBodyContains({ status: 200, headers: {}, body }, { id: 1, userId: 1 });
// "Response body contains all expected values"
// On failure: "Response body mismatch:\n  'id': expected 999, got 1"
```

#### `assertSchema(response, schema)`
Type-based schema validation. Validates all fields in one call.
```typescript
assertSchema(
  { status: 200, headers: {}, body },
  { id: "number", title: "string", userId: "number", body: "string" }
);
// "Response schema is valid"
// On failure: "Schema validation failed:\n  'title': expected number but got string"
```

#### `assertResponseTime(response, maxMs)`
Performance SLA assertion.
```typescript
assertResponseTime(
  { status: 200, headers: {}, body, duration: 1243 },
  5000
);
// "Response time 1243ms is within 5000ms limit"
// On failure: "Response time 6100ms exceeds 5000ms limit"
```

---

### 🤖 AI Assertions *(API key required)*

These use the Anthropic Claude API to understand what elements **mean**, not just what they contain.

```typescript
const qa = qaPulseAssert(page, {
  ai: {
    enabled: true,
    apiKey: process.env.ANTHROPIC_API_KEY
  }
});

// Does the error message mean "authentication failed"?
await qa.toMean(".flash-error", "authentication failed");

// Does the page content match this specification?
await qa.pageMatchesSpec("The page should show a list of customer contacts with email addresses");

// Does this element satisfy a business rule?
await qa.satisfiesRule(".price-display", "must show a positive monetary value with currency symbol");
```

---

## 🆚 Comparison With Standard Libraries

See **[docs/QAPULSESK-ASSERT-COMPARISON.md](https://github.com/QAPulse-by-SK/playwright-boilerplate/blob/with-packages/docs/QAPULSESK-ASSERT-COMPARISON.md)** in the Playwright boilerplate for a full honest comparison.

**Summary:**

```typescript
// ❌ Standard Playwright — breaks if title separator changes
await expect(page).toHaveTitle("Accounts » SuiteCRM Demo");

// ✅ qapulsesk-assert — survives upgrades and format changes
await qa.toFuzzyHaveText("title", "Accounts SuiteCRM", { threshold: 0.6 });

// ❌ Standard — 4 separate type checks
expect(typeof body.id).toBe("number");
expect(typeof body.title).toBe("string");
expect(typeof body.userId).toBe("number");
expect(typeof body.body).toBe("string");

// ✅ qapulsesk-assert — one schema call with detailed error
assertSchema(response, { id: "number", title: "string", userId: "number", body: "string" });
```

---

## 🧪 See It In Action

These test files in the QAPulse boilerplates use `qapulsesk-assert` against real-world sites:

| File | Tests | Target |
|---|---|---|
| [assert.spec.ts](https://github.com/QAPulse-by-SK/playwright-boilerplate/blob/with-packages/tests/packages/assert.spec.ts) | 23 | jsonplaceholder + the-internet |
| [assert.demo.spec.ts](https://github.com/QAPulse-by-SK/playwright-boilerplate/blob/with-packages/tests/packages/assert.demo.spec.ts) | 19 | Before/after storytelling |
| [suitecrm.spec.ts](https://github.com/QAPulse-by-SK/playwright-boilerplate/blob/with-packages/tests/packages/suitecrm.spec.ts) | 26 | SuiteCRM enterprise CRM |
| [assert.demo.cy.js](https://github.com/QAPulse-by-SK/cypress-boilerplate/blob/with-packages/cypress/e2e/packages/assert.demo.cy.js) | 15 | Cypress version |
| [suitecrm.cy.js](https://github.com/QAPulse-by-SK/cypress-boilerplate/blob/with-packages/cypress/e2e/packages/suitecrm.cy.js) | 23 | Cypress + SuiteCRM |

---

## 🔗 Related Packages

| Package | Description |
|---------|-------------|
| [qapulsesk-report](https://www.npmjs.com/package/qapulsesk-report) | Dark-theme HTML reports, AI failure analysis, Slack webhooks |
| [qapulsesk-gen](https://www.npmjs.com/package/qapulsesk-gen) | HAR → tests, recordings → tests, plain English → tests |

---

## 📄 License

MIT © [QA Pulse by SK](https://www.skakarh.com)

---

<div align="center">

**Built with ❤️ by [QA Pulse by SK](https://www.skakarh.com)**

🌐 [skakarh.com](https://www.skakarh.com) &nbsp;·&nbsp; 🏢 [QAPulse-by-SK](https://github.com/QAPulse-by-SK) &nbsp;·&nbsp; ⭐ Star if it helped!

</div>
