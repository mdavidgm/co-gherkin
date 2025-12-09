# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-09

### Added

- **Framework-Agnostic Configuration**: New `configureGherkin()` API to make co-gherkin compatible with any test framework (Playwright, Jest, etc.)
- **Playwright Support**: New `runFeatureSync()` function for Playwright E2E tests
- **Configuration Module**: New `config.ts` module with `GherkinConfig` interface
- **Synchronous Runner**: New `playwright-runner.ts` for frameworks that require synchronous test definition

### Changed

- **Auto-Detection**: Improved Vitest auto-detection using global functions instead of require()
- **Vitest Config**: Enabled `globals: true` in vitest.config.ts for backward compatibility

### Fixed

- **Symbol Conflict**: Resolved `Cannot redefine property: Symbol($$jest-matchers-object)` error when using with Playwright
- **ESM Compatibility**: Removed `require()` usage in favor of global detection
- **Playwright Test Generation**: Created `runFeatureSync()` to generate tests synchronously for Playwright compatibility

### Migration Guide

**For Vitest users (backward compatible)**:
No changes needed! Auto-detection still works with `runFeature()`.

**For Playwright users (new)**:

```typescript
import { configureGherkin, runFeatureSync } from "co-gherkin";
import { test } from "@playwright/test";

// Configure co-gherkin for Playwright
configureGherkin({
  describe: test.describe,
  it: test,
  beforeAll: test.beforeAll,
  afterAll: test.afterAll,
  beforeEach: test.beforeEach,
  afterEach: test.afterEach,
});

// Use runFeatureSync instead of runFeature
runFeatureSync("/absolute/path/to/feature.feature");
```

**Key Difference**:

- `runFeature()`: For Vitest (dynamic test generation)
- `runFeatureSync()`: For Playwright (synchronous test generation)

## [1.0.2] - 2025-12-07

### Added

- **100% Code Coverage**: Achieved full test coverage for the library core logic (>99%).
- **Examples**: Added a `examples/` directory with a fully working Calculator project to demonstrate usage.
- **Improved Logging**: Logs are now silent by default and controlled via `CO_GHERKIN_DEBUG` environment variable.

### Fixed

- Fixed path resolution for `file://` URIs in stack traces (improves compatibility with some Vitest environments).
- Fixed step matching logic for negative numbers in regex examples.
- Removed noisy debug logs from default execution.

## [1.0.0] - 2025-12-06

### Added

- Initial release of co-gherkin
- Support for Gherkin syntax (Given, When, Then, And)
- Step definition registration with regex patterns
- Feature file parser
- Scenario runner integrated with Vitest
- BeforeScenario and AfterScenario hooks
- TypeScript support with full type definitions
- Comprehensive README with examples
- MIT License

### Features

- **Step Definitions**: Register test steps using `Given()`, `When()`, `Then()`, `And()`
- **Pattern Matching**: Support for regex patterns in step definitions with capture groups
- **Hooks**: Lifecycle hooks for scenario setup and teardown
- **Feature Runner**: `runFeature()` function to execute .feature files
- **TypeScript First**: Written in TypeScript with full type safety
- **Vitest Integration**: Seamless integration with Vitest testing framework

[1.0.0]: https://github.com/mdavidgm/co-gherkin/releases/tag/v1.0.0
