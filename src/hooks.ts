/**
 * Hooks Registry
 * Lifecycle hooks for features and scenarios (like Cucumber's Before/After)
 */

type HookFunction = () => void | Promise<void>;

interface Hooks {
  beforeFeature: HookFunction[];
  afterFeature: HookFunction[];
  beforeScenario: HookFunction[];
  afterScenario: HookFunction[];
}

class HooksRegistry {
  private hooks: Hooks = {
    beforeFeature: [],
    afterFeature: [],
    beforeScenario: [],
    afterScenario: [],
  };

  /**
   * Register a hook to run before each feature
   */
  registerBeforeFeature(fn: HookFunction) {
    this.hooks.beforeFeature.push(fn);
  }

  /**
   * Register a hook to run after each feature
   */
  registerAfterFeature(fn: HookFunction) {
    this.hooks.afterFeature.push(fn);
  }

  /**
   * Register a hook to run before each scenario
   */
  registerBeforeScenario(fn: HookFunction) {
    this.hooks.beforeScenario.push(fn);
  }

  /**
   * Register a hook to run after each scenario
   */
  registerAfterScenario(fn: HookFunction) {
    this.hooks.afterScenario.push(fn);
  }

  /**
   * Run all hooks of a specific type
   */
  async runHooks(type: keyof Hooks) {
    for (const hook of this.hooks[type]) {
      await hook();
    }
  }

  /**
   * Clear all hooks (useful for testing the library itself)
   */
  clear() {
    this.hooks = {
      beforeFeature: [],
      afterFeature: [],
      beforeScenario: [],
      afterScenario: [],
    };
  }

  /**
   * Get all registered hooks (for debugging)
   */
  getAll() {
    return this.hooks;
  }
}

// Singleton global hooks registry
const globalHooks = new HooksRegistry();

/**
 * Register a hook to run before each feature
 * @example
 * BeforeFeature(() => {
 *   console.log('Starting feature...');
 * });
 */
export function BeforeFeature(fn: HookFunction) {
  globalHooks.registerBeforeFeature(fn);
}

/**
 * Register a hook to run after each feature
 * @example
 * AfterFeature(() => {
 *   console.log('Feature complete');
 * });
 */
export function AfterFeature(fn: HookFunction) {
  globalHooks.registerAfterFeature(fn);
}

/**
 * Register a hook to run before each scenario
 * Useful for resetting state, clearing mocks, or setting up test fixtures
 * @example
 * BeforeScenario(() => {
 *   vi.clearAllMocks();
 *   cleanup();
 * });
 */
export function BeforeScenario(fn: HookFunction) {
  globalHooks.registerBeforeScenario(fn);
}

/**
 * Register a hook to run after each scenario
 * Useful for cleanup, restoring mocks, or logging
 * @example
 * AfterScenario(() => {
 *   cleanup();
 * });
 */
export function AfterScenario(fn: HookFunction) {
  globalHooks.registerAfterScenario(fn);
}

export { globalHooks, HooksRegistry };
export type { HookFunction };
