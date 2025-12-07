import { expect } from 'vitest';
import { runFeature } from '../src/runner.js';
import { Given, When, Then } from '../src/registry.js';

// Define steps for the coverage feature
Given('I am setting up coverage', () => {
  // background step
});

When(/^I use (.*)$/, (val: string) => {
  // outline step
});

Then('I am done', () => {
  // trailing scenario step
});

Given('I have a table:', (table: string[][]) => {
  expect(table).toBeDefined();
  expect(table.length).toBeGreaterThan(0);
  expect(table[0]).toEqual(['col1', 'col2']);
});

// Run the feature
runFeature('./features/core/coverage.feature');
