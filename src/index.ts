/**
 * vitest-gherkin-global
 * True Cucumber-style testing for Vitest with global step definitions
 *
 * @example
 * // tests/steps/auth.steps.ts - Define steps ONCE
 * import { Given, When, Then, BeforeScenario } from '@lib/vitest-gherkin-global';
 * import { cleanup } from '@testing-library/react';
 * import { vi } from 'vitest';
 *
 * // Reset state before each scenario
 * BeforeScenario(() => {
 *   vi.clearAllMocks();
 *   cleanup();
 * });
 *
 * Given('I am on the login page', () => {
 *   render(<Login />);
 * });
 *
 * When(/I enter email "(.*)"/, (email) => {
 *   fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
 * });
 *
 * Then('I should be redirected to profile', () => {
 *   expect(window.location.pathname).toContain('profile');
 * });
 *
 * @example
 * // tests/features/pages/Login/login.test.ts - Run feature
 * import { runFeature } from '@lib/vitest-gherkin-global';
 * import '../../../steps/auth.steps'; // Import to register steps
 *
 * runFeature('./login.feature');
 */

// Configuration (for framework-agnostic usage)
export { configureGherkin, getConfig, resetConfig } from './config.js';
export type { GherkinConfig } from './config.js';

// Step definitions
export { Given, When, Then, And, But, globalRegistry } from './registry.js';

// Lifecycle hooks
export {
  BeforeFeature,
  AfterFeature,
  BeforeScenario,
  AfterScenario,
  globalHooks,
} from './hooks.js';

// Runner
export { runFeature, parseFeatureFile, executeSteps, executeScenario } from './runner.js';

// Playwright-specific runner (synchronous)
export { runFeatureSync } from './playwright-runner.js';

// Logger
export { logger } from './logger.js';

// Types
export type { ParsedFeature, ParsedScenario, ParsedStep } from './parser.js';
export type { StepFunction, StepType } from './registry.js';
export type { HookFunction } from './hooks.js';
