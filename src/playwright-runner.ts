/**
 * Playwright-specific runner
 * Generates Playwright tests synchronously from feature files
 */

import { getConfig } from './config.js';
import { parseFeatureFile, ParsedFeature, ParsedScenario } from './parser.js';
import { globalHooks } from './hooks.js';
import { logger } from './logger.js';
import { executeSteps } from './runner.js';

/**
 * Run a .feature file as Playwright tests
 * This version generates tests synchronously for Playwright compatibility
 * 
 * @param featurePath - Absolute path to .feature file
 * @example
 * ```typescript
 * import { runFeatureSync } from 'co-gherkin';
 * runFeatureSync('/absolute/path/to/login.feature');
 * ```
 */
export function runFeatureSync(featurePath: string) {
  const feature = parseFeatureFile(featurePath);
  const { describe, it, beforeAll, afterAll, beforeEach, afterEach } = getConfig();

  // Generate describe block synchronously
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

    // Generate test for each scenario synchronously
    for (const scenario of feature.scenarios) {
      generateScenarioTest(scenario, feature, it);
    }
  });
}

function generateScenarioTest(scenario: ParsedScenario, feature: ParsedFeature, it: any) {
  const testName = scenario.name || 'Unnamed Scenario';

  // Generate test synchronously
  it(testName, async () => {
    logger.log('RUNNER', `Executing scenario: ${testName}`);

    // Run background steps if any
    if (feature.background) {
      await executeSteps(feature.background, 'Background');
    }

    // Run scenario steps
    await executeSteps(scenario.steps, scenario.name);
  });
}
