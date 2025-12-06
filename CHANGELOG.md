# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
