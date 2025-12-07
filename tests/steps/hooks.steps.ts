import { Given, When, Then, And } from '../../src/registry';
import { BeforeScenario, AfterScenario, globalHooks } from '../../src/hooks';
import { expect } from 'vitest';

// Test context
let testHookRegistry: typeof globalHooks;
let hookExecutionLog: string[] = [];
let hookCount: number = 0;
let asyncCompleted: boolean = false;
let hookError: Error | null = null;

// Helper to reset hook state
function resetHooks() {
  (globalHooks as any).hooks.beforeScenario = [];
  (globalHooks as any).hooks.afterScenario = [];
  hookExecutionLog = [];
  hookCount = 0;
  asyncCompleted = false;
  hookError = null;
}

Given('I have a hook registry', () => {
  resetHooks();
  testHookRegistry = globalHooks;
});

When('I register a BeforeScenario hook', () => {
  BeforeScenario(() => {
    hookExecutionLog.push('before-scenario');
  });
  hookCount = testHookRegistry.getAll().beforeScenario.length;
});

Then('the hook should be registered', () => {
  expect(hookCount).toBeGreaterThan(0);
});

And('it should execute before each scenario', async () => {
  // Simulate scenario execution
  await testHookRegistry.runHooks('beforeScenario');
  expect(hookExecutionLog).toContain('before-scenario');
});

When('I register an AfterScenario hook', () => {
  AfterScenario(() => {
    hookExecutionLog.push('after-scenario');
  });
  hookCount = testHookRegistry.getAll().afterScenario.length;
});

And('it should execute after each scenario', async () => {
  // Simulate scenario execution
  await testHookRegistry.runHooks('afterScenario');
  expect(hookExecutionLog).toContain('after-scenario');
});

Given('I have registered {int} BeforeScenario hooks', (count: number | string) => {
  resetHooks();
  const numCount = Number(count);
  for (let i = 0; i < numCount; i++) {
    BeforeScenario(() => {
      hookExecutionLog.push(`hook-${i}`);
    });
  }
});

When('a scenario runs', async () => {
  // Simulate running all before hooks
  try {
    await testHookRegistry.runHooks('beforeScenario');
  } catch (err) {
    hookError = err as Error;
  }
});

Then('all {int} hooks should execute', (count: number | string) => {
  expect(hookExecutionLog.length).toBe(Number(count));
});

And('they should execute in registration order', () => {
  expect(hookExecutionLog).toEqual(['hook-0', 'hook-1', 'hook-2']);
});

Given('I have an async BeforeScenario hook', () => {
  resetHooks();
  asyncCompleted = false;

  BeforeScenario(async () => {
    await new Promise(resolve => setTimeout(resolve, 10));
    asyncCompleted = true;
    hookExecutionLog.push('async-hook');
  });
});

Then('the hook should complete before scenario steps', () => {
  expect(asyncCompleted).toBe(true);
});

And('async operations should finish', () => {
  expect(hookExecutionLog).toContain('async-hook');
});

Given('I have a BeforeScenario hook that throws an error', () => {
  resetHooks();

  BeforeScenario(() => {
    throw new Error('Hook error');
  });
});

Then('the hook error should be caught', async () => {
  try {
    await testHookRegistry.runHooks('beforeScenario');
  } catch (error) {
    hookError = error as Error;
  }
  expect(hookError).toBeDefined();
});

And('the scenario should fail', () => {
  expect(hookError).not.toBeNull();
});

And('the error should be reported', () => {
  expect(hookError?.message).toBe('Hook error');
});
