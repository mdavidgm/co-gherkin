/**
 * Feature Runner
 * Executes Gherkin scenarios as Vitest tests with coverage support
 */

import { describe, it, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';

import {
  parseFeatureFile,
  parseFeatureContent,
  ParsedFeature,
  ParsedScenario,
  ParsedStep,
} from './parser';
import { globalRegistry } from './registry';
import { globalHooks } from './hooks';

/**
 * Run a .feature file as Vitest tests
 * Coverage works because we generate real Vitest describe/it blocks
 *
 * @param featurePath - Relative path to .feature file from the calling test file
 * @example
 * // tests/features/login.test.ts
 * import { runFeature } from '@lib/vitest-gherkin-global';
 * runFeature('./login.feature');
 */
export function runFeature(featurePath: string) {
  const feature = parseFeatureFile(featurePath);

  describe(`Feature: ${feature.name}`, () => {
    // Run BeforeFeature hooks
    beforeAll(async () => {
      await globalHooks.runHooks('beforeFeature');
    });

    // Run AfterFeature hooks
    afterAll(async () => {
      await globalHooks.runHooks('afterFeature');
    });

    // Run BeforeScenario hooks before each test
    beforeEach(async () => {
      await globalHooks.runHooks('beforeScenario');
    });

    // Run AfterScenario hooks after each test
    afterEach(async () => {
      await globalHooks.runHooks('afterScenario');
    });

    for (const scenario of feature.scenarios) {
      describeScenario(scenario, feature);
    }
  });
}

function describeScenario(scenario: ParsedScenario, feature: ParsedFeature) {
  const testName = scenario.name || 'Unnamed Scenario';

  it(testName, async () => {
    // Run background steps if any
    if (feature.background) {
      await executeSteps(feature.background, 'Background');
    }

    // Run scenario steps
    await executeSteps(scenario.steps, scenario.name);
  });
}

export async function executeScenario(featureContent: string, scenarioName: string) {
  const feature = parseFeatureContent(featureContent);
  const scenario = feature.scenarios.find(s => s.name === scenarioName);

  if (!scenario) {
    throw new Error(`Scenario "${scenarioName}" not found in feature content`);
  }

  if (feature.background) {
    await executeSteps(feature.background, 'Background');
  }

  await executeSteps(scenario.steps, scenario.name);
}

export async function executeSteps(steps: ParsedStep[], scenarioName: string) {
  for (const step of steps) {
    const registered = globalRegistry.findStep(step.text);

    if (!registered) {
      throw new Error(
        `Missing step definition for "${step.keyword} ${step.text}" in scenario "${scenarioName}"\n` +
        `\nAdd this step definition:\n` +
        `Given('${step.text}', () => {\n` +
        `  // Your implementation here\n` +
        `});\n`
      );
    }

    const { fn, matches } = registered;
    const args: any[] = matches.slice(1); // Remove full match, keep capture groups

    if (step.dataTable) {
      args.push(step.dataTable);
    }

    try {
      await fn(...args);
    } catch (error: any) {
      throw new Error(
        `Step failed: "${step.keyword} ${step.text}" in scenario "${scenarioName}"\n` +
        `Error: ${error.message}\n` +
        error.stack
      );
    }
  }
}

export { parseFeatureFile };
