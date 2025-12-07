import { expect } from 'vitest';
import { Given, When, Then } from '../../src/index.js'; // In your project, import from 'co-gherkin'

let value = 0;

Given(/^I start with (-?\d+)$/, (initial: string) => {
  value = parseInt(initial, 10);
});

When(/^I add (-?\d+)$/, (amount: string) => {
  value += parseInt(amount, 10);
});

Then(/^the result should be (-?\d+)$/, (expected: string) => {
  expect(value).toBe(parseInt(expected, 10));
});
