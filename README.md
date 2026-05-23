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

<br/>

![qapulsesk-assert demo](https://raw.githubusercontent.com/QAPulse-by-SK/QAPulseSK-assert/main/assets/qapulsesk-assert-demo.gif)

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

## 🤖 AI-Powered Assertions *(Optional — Anthropic API key required)*

This is where qapulsesk-assert does something **no other assertion library can do**.

Standard assertions check **what an element contains**.
AI assertions check **what an element means**.

### The Problem Standard Assertions Cannot Solve

```typescript
// Standard assertion — passes for BOTH of these messages:
await expect(page.locator("#flash")).toContainText("Your account");

// "Your account has been created successfully!" ✅ correct
// "Your account has been suspended."            ❌ wrong — but test PASSES
```

Standard assertions are string-based. They have no concept of meaning, intent, or context. A message that contains "Your account" passes regardless of whether it is good news or bad news.

### How AI Assertions Solve This

```typescript
const qa = qaPulseAssert(page, {
  ai: { enabled: true, apiKey: process.env.ANTHROPIC_API_KEY }
});

// AI checks semantic meaning — not exact text
await qa.toMean("#flash", "account was created successfully");
// ✅ PASSES for "Your account has been created!"
// ❌ FAILS  for "Your account has been suspended."
// ❌ FAILS  for "Your account was deleted."
```

The AI reads the element, understands its content in context, and verifies that it conveys the intended meaning — regardless of exact wording, phrasing, or sentence structure.

---

### `qa.toMean(selector, meaning, options?)`

Tests whether an element **semantically means** what you describe.

```typescript
// Login success
await qa.toMean("#flash", "login was successful");

// Authentication failure
await qa.toMean("#flash", "authentication failed due to invalid credentials");

// CRM dashboard — user is logged in
await qa.toMean("title", "user is logged in to the CRM");

// Page heading purpose
await qa.toMean("h2", "this is a login or authentication page");
```

**Real-world value:**
- Survives copy changes — "Login successful" → "Welcome back!" still passes
- Catches semantic bugs — wrong message type is caught even if text looks similar
- Language independent — works across English, Arabic, French without changes

---

### `qa.satisfiesRule(selector, rule, options?)`

Tests whether an element **satisfies a business rule** expressed in plain English.

```typescript
// Business rule: nav links must be descriptive
await qa.satisfiesRule(
  "ul li a",
  "all links have descriptive text that clearly indicates their destination"
);

// Business rule: login form must have required security elements
await qa.satisfiesRule(
  "form",
  "contains a username field, a password field, and a submit button"
);

// Business rule: CRM Contact form must capture required fields
await qa.satisfiesRule(
  "form",
  "has fields for first name, last name, email address, and phone number"
);

// Business rule: error messages must not expose system internals
await qa.satisfiesRule(
  "#flash",
  "is a user-friendly error message that does not expose technical details or system internals"
);
```

**Real-world value:**
- Write requirements as tests — turn acceptance criteria directly into assertions
- Catches UX violations — "click here" links, missing fields, exposed stack traces
- No selector archaeology — describe what you need, not how the DOM is structured

---

### `qa.pageMatchesSpec(specification, options?)`

Tests whether the **entire page** matches a specification written in plain English.
The most powerful of the three — describe what the page should do and Claude verifies it.

```typescript
// Login page specification
await qa.pageMatchesSpec(
  `This page should:
   - Be a login or sign-in page
   - Have a form with username and password fields
   - Have a submit button to authenticate
   - Not show any sensitive system information`
);

// SuiteCRM dashboard specification
await qa.pageMatchesSpec(
  `This page should:
   - Be a CRM dashboard or home page
   - Show a logged-in user interface (not a login form)
   - Have navigation to CRM modules like Contacts, Accounts, or Opportunities
   - Display business data or dashboards`
);

// Contacts list specification
await qa.pageMatchesSpec(
  `This page should:
   - Show a list or grid of contacts
   - Have column headers for contact information (name, email, phone)
   - Allow users to search or filter contacts
   - Be part of a CRM or contact management system`
);
```

**Real-world value:**
- Replaces entire test suites for page-level validation
- Maps directly to acceptance criteria in Jira/Confluence
- Catches layout/content regressions that element-level tests miss

---

### AI Assertion Setup

```typescript
// Install
npm install qapulsesk-assert

// Set your Anthropic API key
// Option 1: .env file
ANTHROPIC_API_KEY=sk-ant-...

// Option 2: environment variable
export ANTHROPIC_API_KEY=sk-ant-...

// Option 3: inline (not recommended for production)
const qa = qaPulseAssert(page, {
  ai: {
    enabled: true,
    apiKey: "sk-ant-...",
    model: "claude-3-haiku-20240307"  // optional — haiku is fast and cheap
  }
});
```

---

### AI Assertions — Running the Demo Tests

The `with-packages` branch of the Playwright boilerplate has 14 AI assertion tests — **skipped by default**, runnable with an API key:

```bash
# Clone the boilerplate
git clone -b with-packages https://github.com/QAPulse-by-SK/playwright-boilerplate.git
cd playwright-boilerplate && npm install && npx playwright install

# Run AI tests (requires Anthropic API key)
ANTHROPIC_API_KEY=your-key npx playwright test tests/packages/assert.ai.spec.ts

# Run all package tests (AI tests auto-skipped without key)
npx playwright test tests/packages/ --project=chromium
```

**What the 14 tests cover:**

| Suite | Tests | Target | What it tests |
|---|---|---|---|
| `qa.toMean()` | 5 | the-internet + SuiteCRM | Semantic meaning of messages and page titles |
| `qa.satisfiesRule()` | 4 | the-internet + SuiteCRM | Business rules — form fields, link quality, error messages |
| `qa.pageMatchesSpec()` | 4 | the-internet + SuiteCRM | Full page against plain-English specifications |
| AI vs Standard | 1 | the-internet | Side-by-side comparison showing where AI adds value |

**Two real-world targets:**
- `the-internet.herokuapp.com` — clean HTML, easy to understand the concept
- `demo.suiteondemand.com` — real enterprise CRM, shows AI on production-grade UI

---

### AI Assertion Comparison

| | Standard Playwright | qapulsesk-assert AI |
|---|---|---|
| Checks exact text | ✅ | ✅ |
| Handles copy changes | ❌ | ✅ |
| Understands meaning | ❌ | ✅ |
| Business rules | ❌ | ✅ |
| Full page spec | ❌ | ✅ |
| Language independent | ❌ | ✅ |
| API key required | ❌ | ✅ |
| Cost per assertion | Free | ~$0.001 (haiku) |

---

## 🧪 See It In Action

These test files in the QAPulse boilerplates use `qapulsesk-assert` against real-world sites:

| File | Tests | Target | Notes |
|---|---|---|---|
| [assert.spec.ts](https://github.com/QAPulse-by-SK/playwright-boilerplate/blob/with-packages/tests/packages/assert.spec.ts) | 23 | jsonplaceholder + the-internet | Full assertion suite |
| [assert.demo.spec.ts](https://github.com/QAPulse-by-SK/playwright-boilerplate/blob/with-packages/tests/packages/assert.demo.spec.ts) | 19 | the-internet + SuiteCRM | Before/after storytelling |
| [assert.ai.spec.ts](https://github.com/QAPulse-by-SK/playwright-boilerplate/blob/with-packages/tests/packages/assert.ai.spec.ts) | 14 | the-internet + SuiteCRM | AI features — skipped without API key |
| [suitecrm.spec.ts](https://github.com/QAPulse-by-SK/playwright-boilerplate/blob/with-packages/tests/packages/suitecrm.spec.ts) | 26 | SuiteCRM enterprise CRM | Real-world CRM testing |
| [assert.demo.cy.js](https://github.com/QAPulse-by-SK/cypress-boilerplate/blob/with-packages/cypress/e2e/packages/assert.demo.cy.js) | 15 | the-internet + SuiteCRM | Cypress version |
| [suitecrm.cy.js](https://github.com/QAPulse-by-SK/cypress-boilerplate/blob/with-packages/cypress/e2e/packages/suitecrm.cy.js) | 23 | Cypress + SuiteCRM | Cypress CRM testing |

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

---

## 🌐 More from QA Pulse by SK

| | |
|---|---|
| 🌐 **Website** | [www.skakarh.com](https://www.skakarh.com) |
| 📦 **All Open Source Products** | [skakarh.com/products](https://www.skakarh.com/products/) |
| ✍️ **QA Automation Blog** | [skakarh.com/blog](https://www.skakarh.com/blog/) |
| 🛠️ **QA Consulting Services** | [skakarh.com/services](https://www.skakarh.com/services/) |
| 🏢 **GitHub Organisation** | [github.com/QAPulse-by-SK](https://github.com/QAPulse-by-SK) |
| 🎎 **Playwright Boilerplate** | [github.com/QAPulse-by-SK/playwright-boilerplate](https://github.com/QAPulse-by-SK/playwright-boilerplate) |
| 🌲 **Cypress Boilerplate** | [github.com/QAPulse-by-SK/cypress-boilerplate](https://github.com/QAPulse-by-SK/cypress-boilerplate) |
| 🐍 **Selenium Boilerplate** | [github.com/QAPulse-by-SK/selenium-boilerplate](https://github.com/QAPulse-by-SK/selenium-boilerplate) |
| 📊 **qapulsesk-report** | [npmjs.com/package/qapulsesk-report](https://www.npmjs.com/package/qapulsesk-report) |
| 🤖 **qapulsesk-gen** | [npmjs.com/package/qapulsesk-gen](https://www.npmjs.com/package/qapulsesk-gen) |
