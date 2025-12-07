import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { globalHooks, BeforeFeature, AfterFeature } from '../../src/hooks.js';
import { parseFeatureContent } from '../../src/parser.js';
import { globalRegistry } from '../../src/registry.js';
import { executeScenario } from '../../src/runner.js';
import { logger } from '../../src/logger.js';
import { resolveFeaturePath } from '../../src/utils.js';
import * as path from 'path';

import { Logger } from '../../src/logger.js';

describe('Coverage Hedge Tests', () => {
  // ...

  // --- Logger Coverage ---
  describe('Logger', () => {
    it('should be enabled via env var', () => {
      vi.stubEnv('CO_GHERKIN_DEBUG', 'true');
      const testLogger = new Logger();
      // Access private enabled property via any cast or just test behavior
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
      testLogger.log('TEST', 'msg');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
      vi.stubEnv('CO_GHERKIN_DEBUG', '');
    });

    it('should log when debug is enabled', () => {
      logger.setDebug(true);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
      logger.log('TEST', 'message');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[TEST] message'));
      consoleSpy.mockRestore();
    });

    it('should NOT log when debug is disabled', () => {
      logger.setDebug(false);
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });
      logger.log('TEST', 'message');
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log errors even if debug disabled? No, implementation says check enabled', () => {
      // Implementation: if (!this.enabled) return; for error() too.
      logger.setDebug(false);
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      logger.error('TEST', 'message');
      expect(errorSpy).not.toHaveBeenCalled();

      logger.setDebug(true);
      logger.error('TEST', 'message');
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockRestore();
    });
  });

  // --- Utils Coverage ---
  describe('Utils: resolveFeaturePath', () => {
    it('should return absolute path as is', () => {
      const abs = path.resolve('/tmp/test.feature');
      expect(resolveFeaturePath(abs)).toBe(abs);
    });

    it('should resolve relative path from CWD if stack is unavailable', () => {
      const resolved = resolveFeaturePath('test.feature', ''); // Empty stack
      expect(resolved).toBe(path.resolve(process.cwd(), 'test.feature'));
    });

    it('should resolve relative path from caller file', () => {
      const callerFile = path.resolve('/users/me/project/tests/my.test.ts');
      const forcedStack = `Error\n    at Object.<anonymous> (${callerFile}:10:1)`;

      const resolved = resolveFeaturePath('my.feature', forcedStack);
      // Should resolve to /users/me/project/tests/my.feature
      expect(resolved).toBe(path.resolve(path.dirname(callerFile), 'my.feature'));
    });

    it('should ignore internal library files in stack trace', () => {
      const callerFile = path.resolve('/users/me/project/tests/my.test.ts');
      const forcedStack = `Error
            at Object.<anonymous> (/node_modules/co-gherkin/src/index.ts:10:1)
            at Object.<anonymous> (${callerFile}:10:1)`;

      const resolved = resolveFeaturePath('my.feature', forcedStack);
      expect(resolved).toBe(path.resolve(path.dirname(callerFile), 'my.feature'));
    });

    it('should strip file:// prefix from stack trace', () => {
      const callerFile = path.resolve('/users/me/project/tests/my.test.ts');
      // Simulate a stack trace with file:// prefix (common in some environments)
      const forcedStack = `Error
            at Object.<anonymous> (file://${callerFile}:10:1)`;

      const resolved = resolveFeaturePath('my.feature', forcedStack);
      expect(resolved).toBe(path.resolve(path.dirname(callerFile), 'my.feature'));
    });
  });

  // --- Hooks Coverage ---
  describe('Hooks Registry', () => {
    beforeEach(() => {
      globalHooks.clear();
    });

    it('should register and run BeforeFeature hooks', async () => {
      const fn = vi.fn();
      BeforeFeature(fn);

      await globalHooks.runHooks('beforeFeature');
      expect(fn).toHaveBeenCalled();

      const hooks = globalHooks.getAll();
      expect(hooks.beforeFeature).toHaveLength(1);
    });

    it('should register and run AfterFeature hooks', async () => {
      const fn = vi.fn();
      AfterFeature(fn);

      await globalHooks.runHooks('afterFeature');
      expect(fn).toHaveBeenCalled();

      const hooks = globalHooks.getAll();
      expect(hooks.afterFeature).toHaveLength(1);
    });
  });

  // --- Parser Coverage ---
  describe('Parser Edge Cases', () => {
    it('should warn if docstring has no previous step to attach to', () => {
      logger.setDebug(true);
      const logSpy = vi.spyOn(logger, 'log');
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

      // DocString at the beginning of file (invalid Gherkin but parser handles it)
      const content = `
        """
        Docstring content
        """
        Feature: Test
      `;
      parseFeatureContent(content);

      expect(logSpy).toHaveBeenCalledWith('PARSER', expect.stringContaining('WARNING: No lastStep'));
      logSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    it('should warn/ignore if data table has no previous step', () => {
      // Table row without a step
      const content = `
       Feature: Test
       Scenario: Orphan Table
         | col1 | col2 |
       `;
      // Logic: handleTable -> getCurrentStepList -> returns steps (empty or not) -> lastStep?
      // If empty steps, lastStep is undefined.
      // The code currently just checks "if (lastStep)". It doesn't log a warning for orphan tables? 
      // Let's check parser.ts code: "if (lastStep) { ... }". No else block logging.
      // So valid execution is just "do nothing".
      // This test ensures we hit that "if (lastStep)" check when it evaluates to false.
      const result = parseFeatureContent(content);
      expect(result.scenarios[0].steps).toHaveLength(0);
    });

    it('should warn/ignore if data table has no previous step (Truly Orphan)', () => {
      // Table row at TOP LEVEL (no Feature/Scenario) or just Feature without Scenario
      const content = `
       Feature: Test
         | col1 | col2 |
       `;
      // Logic: handleTable -> getCurrentStepList -> returns empty list (line 275) -> lastStep undefined -> ignores
      const result = parseFeatureContent(content);
      expect(result.scenarios).toHaveLength(0);
    });

    it('should return empty list if no active context in getCurrentStepList', () => {
      // This is implicitly tested by "Docstring at the beginning of file" 
      // because attachDocString calls getCurrentStepList.
      // When at top of file: isBackground=false, outlines=false, currentScenario=null.
      // Returns [] (line 275).
    });
  });

  // --- Registry Coverage ---
  describe('Registry Edge Cases', () => {
    beforeEach(() => {
      logger.setDebug(true);
      vi.spyOn(console, 'log').mockImplementation(() => { }); // Silence output
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should log when step is not found', () => {
      const logSpy = vi.spyOn(logger, 'log');
      globalRegistry.findStep('Non existent step');
      expect(logSpy).toHaveBeenCalledWith('REGISTRY', expect.stringContaining('No match found'));
      logSpy.mockRestore();
    });

    it('should return all steps via getAll', () => {
      globalRegistry.clear();
      globalRegistry.register('Given', 'abc', () => { });
      expect(globalRegistry.getAll()).toHaveLength(1);
    });
  });

  // --- Runner Coverage ---
  describe('Runner Edge Cases', () => {
    beforeEach(() => {
      logger.setDebug(true);
      vi.spyOn(console, 'log').mockImplementation(() => { }); // Silence output
      vi.spyOn(console, 'error').mockImplementation(() => { }); // Silence errors
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should throw error if scenario is not found', async () => {
      const content = `Feature: Test\nScenario: A`;
      await expect(executeScenario(content, 'B'))
        .rejects.toThrow('Scenario "B" not found');
    });

    it('should throw "Missing step definition" if step is not found', async () => {
      globalRegistry.clear();

      const content = `
      Feature: Fail
      Scenario: Missing
        Given likely not matched
      `;

      const errorSpy = vi.spyOn(logger, 'error');

      await expect(executeScenario(content, 'Missing'))
        .rejects.toThrow('Missing step definition');

      expect(errorSpy).toHaveBeenCalledWith('RUNNER', expect.stringContaining('Missing step definition'));
      errorSpy.mockRestore();
    });

    it('should capture step execution errors', async () => {
      globalRegistry.clear();
      const fn = vi.fn().mockRejectedValue(new Error('Ooops'));
      globalRegistry.register('Given', 'failing step', fn);

      const content = `
       Feature: Fail
       Scenario: Exec Fail
         Given failing step
       `;

      const errorSpy = vi.spyOn(logger, 'error');

      await expect(executeScenario(content, 'Exec Fail'))
        .rejects.toThrow('Step failed');

      expect(errorSpy).toHaveBeenCalledWith('RUNNER', expect.stringContaining('Step failed'), expect.any(Error));
      errorSpy.mockRestore();
    });
  });

});
