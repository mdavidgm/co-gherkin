/**
 * Global Step Registry
 * Similar to Cucumber tradicional: defines steps ONCE, use everywhere
 */

type StepType = 'Given' | 'When' | 'Then' | 'And' | 'But';
import { logger } from './logger.js';
type StepFunction = (...args: any[]) => void | Promise<void>;

interface RegisteredStep {
  type: StepType;
  pattern: RegExp;
  fn: StepFunction;
}

class StepRegistry {
  private steps: RegisteredStep[] = [];

  private transformCucumberExpression(pattern: string): RegExp {
    const regexPattern = pattern
      .replace(/\{string\}/g, '"((?:[^"\\\\]|\\\\.)*)"') // Supports escaped quotes
      .replace(/\{int\}/g, '(-?\\d+)')
      .replace(/\{float\}/g, '(-?\\d+\\.\\d+)')
      .replace(/\{word\}/g, '(\\w+)');
    return new RegExp(`^${regexPattern}$`);
  }

  register(type: StepType, pattern: string | RegExp, fn: StepFunction) {
    logger.log('REGISTRY', `Registering ${type}: ${pattern}`);

    const regex = typeof pattern === 'string'
      ? this.transformCucumberExpression(pattern)
      : pattern;

    this.steps.push({
      pattern: regex,
      fn,
      type,
    });
  }

  findStep(text: string): { fn: StepFunction; matches: RegExpMatchArray } | null {
    logger.log('REGISTRY', `Finding step: "[${text}]". Total steps: ${this.steps.length}`);
    for (const step of this.steps) {
      const matches = text.match(step.pattern);
      if (matches) {
        logger.log('REGISTRY', `Found match! Pattern: ${step.pattern}`);
        return { fn: step.fn, matches };
      }
    }
    logger.log('REGISTRY', `No match found for: "[${text}]"`);
    return null;
  }

  clear() {
    this.steps = [];
  }

  getAll() {
    return this.steps;
  }
}

// Singleton global registry
// Use globalThis to ensure singleton across module compilations in tests
const GLOBAL_REGISTRY_KEY = Symbol.for('co-gherkin.registry');

if (!(globalThis as any)[GLOBAL_REGISTRY_KEY]) {
  (globalThis as any)[GLOBAL_REGISTRY_KEY] = new StepRegistry();
}

export const globalRegistry = (globalThis as any)[GLOBAL_REGISTRY_KEY] as StepRegistry;

/**
 * Define a Given step
 * @example
 * Given('I am on the login page', () => {
 *   render(<Login />);
 * });
 */
export function Given(pattern: string | RegExp, fn: StepFunction) {
  globalRegistry.register('Given', pattern, fn);
}

/**
 * Define a When step
 * @example
 * When(/I enter email "(.*)"/, (email) => {
 *   fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
 * });
 */
export function When(pattern: string | RegExp, fn: StepFunction) {
  globalRegistry.register('When', pattern, fn);
}

/**
 * Define a Then step
 * @example
 * Then('I should see an error', () => {
 *   expect(screen.getByText(/error/i)).toBeInTheDocument();
 * });
 */
export function Then(pattern: string | RegExp, fn: StepFunction) {
  globalRegistry.register('Then', pattern, fn);
}

/**
 * Define an And step
 * @example
 * And('the form should be disabled', () => {
 *   expect(screen.getByRole('form')).toBeDisabled();
 * });
 */
export function And(pattern: string | RegExp, fn: StepFunction) {
  globalRegistry.register('And', pattern, fn);
}

/**
 * Define a But step
 * @example
 * But('the error message should not be visible', () => {
 *   expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
 * });
 */
export function But(pattern: string | RegExp, fn: StepFunction) {
  globalRegistry.register('But', pattern, fn);
}

export { StepRegistry };
export type { StepFunction, RegisteredStep, StepType };
