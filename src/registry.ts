/**
 * Global Step Registry
 * Similar to Cucumber tradicional: defines steps ONCE, use everywhere
 */

type StepType = 'Given' | 'When' | 'Then' | 'And' | 'But';
type StepFunction = (...args: any[]) => void | Promise<void>;

interface RegisteredStep {
  type: StepType;
  pattern: RegExp;
  fn: StepFunction;
}

class StepRegistry {
  private steps: RegisteredStep[] = [];

  register(type: StepType, pattern: string | RegExp, fn: StepFunction) {
    const regex = typeof pattern === 'string' ? new RegExp(`^${pattern}$`) : pattern;

    this.steps.push({ type, pattern: regex, fn });
  }

  findStep(text: string): { fn: StepFunction; matches: RegExpMatchArray } | null {
    for (const step of this.steps) {
      const matches = text.match(step.pattern);
      if (matches) {
        return { fn: step.fn, matches };
      }
    }
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
const globalRegistry = new StepRegistry();

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

export { globalRegistry, StepRegistry };
export type { StepFunction, RegisteredStep, StepType };
