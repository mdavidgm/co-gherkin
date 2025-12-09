/**
 * Configuration for co-gherkin
 * Allows using co-gherkin with different test frameworks (Vitest, Playwright, Jest, etc.)
 */

export interface GherkinConfig {
  /**
   * Test framework functions
   */
  describe?: (name: string, fn: () => void) => void;
  it?: (name: string, fn: () => void | Promise<void>) => void;
  beforeAll?: (fn: () => void | Promise<void>) => void;
  afterAll?: (fn: () => void | Promise<void>) => void;
  beforeEach?: (fn: () => void | Promise<void>) => void;
  afterEach?: (fn: () => void | Promise<void>) => void;
}

let config: GherkinConfig = {};
let isConfigured = false;

/**
 * Configure co-gherkin to work with your test framework
 * 
 * @example Playwright
 * ```typescript
 * import { test } from '@playwright/test';
 * import { configureGherkin } from 'co-gherkin';
 * 
 * configureGherkin({
 *   describe: test.describe,
 *   it: test,
 *   beforeAll: test.beforeAll,
 *   afterAll: test.afterAll,
 *   beforeEach: test.beforeEach,
 *   afterEach: test.afterEach,
 * });
 * ```
 * 
 * @example Vitest (auto-configured, but can be explicit)
 * ```typescript
 * import { describe, it, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
 * import { configureGherkin } from 'co-gherkin';
 * 
 * configureGherkin({
 *   describe,
 *   it,
 *   beforeAll,
 *   afterAll,
 *   beforeEach,
 *   afterEach,
 * });
 * ```
 */
export function configureGherkin(userConfig: GherkinConfig) {
  config = { ...config, ...userConfig };
  isConfigured = true;
}

/**
 * Get current configuration
 * Auto-loads Vitest if not configured (for backward compatibility)
 */
export function getConfig(): Required<GherkinConfig> {
  // Auto-configure for Vitest if not configured (backward compatibility)
  if (!isConfigured) {
    try {
      // Try to load Vitest synchronously (works in Vitest environment)
      // This uses a trick: Vitest globals are available in test context
      if (typeof globalThis !== 'undefined') {
        const g = globalThis as any;

        // Check if Vitest globals are available
        if (g.describe && g.it && g.beforeAll && g.afterAll && g.beforeEach && g.afterEach) {
          config = {
            describe: g.describe,
            it: g.it,
            beforeAll: g.beforeAll,
            afterAll: g.afterAll,
            beforeEach: g.beforeEach,
            afterEach: g.afterEach,
          };
          isConfigured = true;
          return config as Required<GherkinConfig>;
        }
      }

      throw new Error('Vitest globals not found');
    } catch (error) {
      throw new Error(
        'co-gherkin is not configured. ' +
        'Call configureGherkin() with your test framework functions, or use Vitest with globals enabled.'
      );
    }
  }

  return config as Required<GherkinConfig>;
}

/**
 * Reset configuration (useful for testing)
 */
export function resetConfig() {
  config = {};
  isConfigured = false;
}
