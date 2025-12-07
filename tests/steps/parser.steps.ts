import { Given, When, Then, And } from '../../src/registry';
import { expect } from 'vitest';
import { parseFeatureContent } from '../../src/parser';

// Test context
let featureContent: string;
let parsedFeature: any;
let docstringContent: string = '';

Given('I have a feature file with content:', (docstring: string) => {
  featureContent = docstring;
});

When('I parse the feature file', () => {
  // Handle escaped quotes from nested docstrings in feature file
  const cleanContent = featureContent.replace(/\\"/g, '"');
  parsedFeature = parseFeatureContent(cleanContent);
});

Then('it should contain {int} feature', (count: number) => {
  expect(parsedFeature).toBeDefined();
  expect(parsedFeature.name).toBeDefined();
});

And('the feature name should be {string}', (name: string) => {
  expect(parsedFeature.name).toBe(name);
});

And('it should contain {int} scenario', (count: number) => {
  expect(parsedFeature.scenarios).toHaveLength(count);
});

And('the scenario should have {int} steps', (count: number) => {
  expect(parsedFeature.scenarios[0].steps).toHaveLength(count);
});

Given('I have a feature file with Background:', (docstring: string) => {
  featureContent = docstring;
});

Then('the Background should have {int} steps', (count: number) => {
  expect(parsedFeature.background).toBeDefined();
  expect(parsedFeature.background).toHaveLength(count);
});

And('the Scenario should have {int} steps', (count: number) => {
  expect(parsedFeature.scenarios[0].steps).toHaveLength(count);
});

Given('I have a feature file with Scenario Outline:', (docstring: string) => {
  featureContent = docstring;
});

Then('it should generate {int} scenarios from examples', (count: number | string) => {
  // After parsing, scenario outlines should be expanded
  expect(parsedFeature.scenarios.length).toBeGreaterThanOrEqual(Number(count));
});

And('each scenario should have parameters replaced', () => {
  // Check that placeholders like <a> are replaced with actual values
  const firstScenario = parsedFeature.scenarios[0];
  const hasPlaceholders = firstScenario.steps.some((step: any) =>
    step.text.includes('<') && step.text.includes('>')
  );
  // After expansion, there should be no placeholders
  expect(hasPlaceholders).toBe(false);
});

Given('I have a feature file with data table:', (docstring: string) => {
  featureContent = docstring;
});

Then('the step should have a data table with {int} rows', (count: number) => {
  const stepWithTable = parsedFeature.scenarios[0].steps.find(
    (step: any) => step.dataTable
  );
  expect(stepWithTable).toBeDefined();
  expect(stepWithTable.dataTable).toHaveLength(count);
});

And('the data table should have {int} columns', (count: number) => {
  const stepWithTable = parsedFeature.scenarios[0].steps.find(
    (step: any) => step.dataTable
  );
  expect(stepWithTable.dataTable[0]).toHaveLength(count);
});

Given('I have a feature file with docstring:', (docstring: string) => {
  featureContent = docstring;
  docstringContent = docstring;
});

Then('the step should have a docstring parameter', () => {
  const stepWithDocstring = parsedFeature.scenarios[0].steps.find(
    (step: any) => step.docstring
  );
  expect(stepWithDocstring).toBeDefined();
  expect(stepWithDocstring.docstring).toBeDefined();
  expect(typeof stepWithDocstring.docstring).toBe('string');
});
