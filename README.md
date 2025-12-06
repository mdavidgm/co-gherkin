# 🥒 Co-Gherkin

**BDD Testing, Together**

> BDD (Behavior-Driven Development) testing with Gherkin syntax for Vitest

[![npm version](https://img.shields.io/npm/v/co-gherkin)](https://www.npmjs.com/package/co-gherkin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.0-green)](https://vitest.dev/)

---

## 🚀 What is Co-Gherkin?

Co-Gherkin brings the power of Gherkin (Given-When-Then) syntax to **Vitest**, the blazing-fast test runner for modern JavaScript and TypeScript.

### Why "Co"?

Inspired by **co-working** philosophy, Co-Gherkin promotes **collaborative testing** where:
- ✅ Product managers write scenarios in plain English
- ✅ Developers implement step definitions
- ✅ QA validates behavior automatically
- ✅ Everyone speaks the same language

### The Problem

- ❌ **Cucumber.js** doesn't work well with Vitest
- ❌ **Playwright BDD** is E2E only, not for unit/integration tests
- ❌ **No native Gherkin support** in Vitest ecosystem

### The Solution: Co-Gherkin

```gherkin
Feature: User Login
  Scenario: Successful login
    Given I am on the login page
    When I enter valid credentials
    Then I should see the dashboard
```

---

## 📦 Installation

```bash
npm install co-gherkin --save-dev
```

---

## 🎯 Quick Start

### 1. Create a `.feature` file

**`features/login.feature`**:
```gherkin
Feature: User Login

  Scenario: Successful login
    Given I am on the login page
    When I enter "user@example.com" and "password123"
    Then I should see the dashboard
```

### 2. Define steps

**`tests/login.steps.ts`**:
```typescript
import { Given, When, Then } from 'co-gherkin';
import { render, screen } from '@testing-library/react';
import { LoginPage } from '../pages/LoginPage';

Given('I am on the login page', () => {
  render(<LoginPage />);
});

When('I enter {string} and {string}', (email: string, password: string) => {
  // Your test logic
});

Then('I should see the dashboard', () => {
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

### 3. Run the feature

**`tests/login.test.ts`**:
```typescript
import { runFeature } from 'co-gherkin';
import { resolve } from 'path';
import './login.steps';

runFeature(resolve(__dirname, '../features/login.feature'));
```

### 4. Execute with Vitest

```bash
npm run test
```

---

## ✨ Features

- ✅ **Vitest Native** - Built specifically for Vitest
- ✅ **TypeScript First** - Full type safety and IntelliSense
- ✅ **Lightweight** - Zero heavy dependencies
- ✅ **Fast** - Powered by Vitest's speed
- ✅ **Full Gherkin Support**:
  - ✅ Given, When, Then, And, But, * keywords
  - ✅ **Background** - Shared setup steps
  - ✅ **Scenario Outline** - Data-driven tests with Examples
  - ✅ **Data Tables** - Structured test data
- ✅ **Regex Patterns** - Capture groups for dynamic values
- ✅ **Hooks** - BeforeScenario and AfterScenario lifecycle
- ✅ **Unit + Integration** - Not just E2E testing
- ✅ **Easy Migration** - From Cucumber or Playwright BDD

---

## 📚 API Reference

### Step Definitions

Define test steps using Gherkin keywords:

```typescript
import { Given, When, Then, And } from 'co-gherkin';

Given('I am on the {string} page', (pageName: string) => {
  // Setup code
});

When('I click the {string} button', (buttonName: string) => {
  // Action code
});

Then('I should see {string}', (text: string) => {
  // Assertion code
});

And('the page title is {string}', (title: string) => {
  // Additional assertion
});
```

### Regex Patterns

Use regex for more complex matching:

```typescript
Given(/^I have (\d+) items in my cart$/, (count: string) => {
  const itemCount = parseInt(count);
  // Your logic
});
```

### Background

Share common setup steps across scenarios:

```gherkin
Feature: Shopping Cart

  Background:
    Given I am logged in
    And I have an empty cart

  Scenario: Add item to cart
    When I add "Product A" to cart
    Then cart should have 1 item

  Scenario: Remove item from cart
    When I add "Product A" to cart
    And I remove "Product A" from cart
    Then cart should be empty
```

### Scenario Outline

Data-driven testing with examples:

```gherkin
Feature: Calculator

  Scenario Outline: Add two numbers
    Given I have entered <a> into the calculator
    And I have entered <b> into the calculator
    When I press add
    Then the result should be <result>

    Examples:
      | a  | b  | result |
      | 1  | 2  | 3      |
      | 5  | 7  | 12     |
      | 10 | 15 | 25     |
```

### Data Tables

Pass structured data to steps:

```gherkin
Given the following users exist:
  | name  | email           | role  |
  | Alice | alice@test.com  | admin |
  | Bob   | bob@test.com    | user  |
```

```typescript
Given('the following users exist:', (dataTable: string[][]) => {
  dataTable.forEach(([name, email, role]) => {
    createUser({ name, email, role });
  });
});
```

### Hooks

Execute code before/after each scenario:

```typescript
import { BeforeScenario, AfterScenario } from 'co-gherkin';

BeforeScenario(() => {
  // Setup: clear database, reset state, etc.
});

AfterScenario(() => {
  // Cleanup: close connections, clear mocks, etc.
});
```

### Feature Runner

Run a feature file:

```typescript
import { runFeature } from 'co-gherkin';
import { resolve } from 'path';

runFeature(resolve(__dirname, './features/my-feature.feature'));
```

---

## 🎨 Example Project Structure

```
my-project/
├── features/
│   ├── login.feature
│   ├── signup.feature
│   └── checkout.feature
├── tests/
│   ├── steps/
│   │   ├── login.steps.ts
│   │   ├── signup.steps.ts
│   │   └── common.steps.ts
│   ├── login.test.ts
│   ├── signup.test.ts
│   └── checkout.test.ts
└── vitest.config.ts
```

---

## 🔧 Configuration

**`vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

---

## 🆚 Comparison

| Feature | Co-Gherkin | Cucumber.js | Playwright BDD |
|---------|-----------|-------------|----------------|
| Vitest Support | ✅ Native | ❌ No | ❌ No |
| TypeScript | ✅ First-class | ⚠️ Partial | ✅ Yes |
| Unit Tests | ✅ Yes | ✅ Yes | ❌ E2E only |
| Speed | ⚡ Fast | 🐢 Slow | ⚡ Fast |
| Bundle Size | 🪶 Light | 📦 Heavy | 📦 Heavy |
| Background | ✅ Yes | ✅ Yes | ✅ Yes |
| Scenario Outline | ✅ Yes | ✅ Yes | ✅ Yes |
| Data Tables | ✅ Yes | ✅ Yes | ✅ Yes |

---

## 🛣️ Roadmap

**v1.0.0 (Current)**
- [x] Core engine (Parser + Runner)
- [x] TypeScript definitions
- [x] Step definition system
- [x] Hooks (BeforeScenario, AfterScenario)
- [x] Background support
- [x] Scenario Outline with Examples
- [x] Data Tables

**Future Versions**
- [ ] Tags support (@smoke, @integration)
- [ ] Tag filtering
- [ ] HTML Reporter
- [ ] Parallel execution optimization
- [ ] VS Code Extension with syntax highlighting
- [ ] Step definition auto-generation
- [ ] Custom formatters

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [David García](https://github.com/mdavidgm)

---

## 👤 Author

**David García**
- 🐙 [GitHub](https://github.com/mdavidgm)
- 💼 [LinkedIn](https://www.linkedin.com/in/manuel-david-garcia-mateos-ba5b11109/)

---

## 🙏 Acknowledgments

Built with ❤️ for the Vitest community

*"Testing, Together" - The Co-Gherkin Philosophy*
