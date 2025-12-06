# 🗺️ Co-Gherkin Roadmap

This document outlines the planned features and improvements for co-gherkin.

---

## ✅ v1.0.x - Current (Stable)

**Released: December 2025**

- ✅ Core Gherkin parser
- ✅ Step definitions (Given, When, Then, And, But, *)
- ✅ Background support
- ✅ Scenario Outline with Examples
- ✅ Data Tables
- ✅ Regex pattern matching
- ✅ Hooks (BeforeScenario, AfterScenario)
- ✅ TypeScript definitions
- ✅ Vitest integration

---

## 🎯 v1.1.0 - Enhanced Features (Q1 2026)

**Focus: Developer Experience**

- [ ] **Tags Support** - Filter scenarios with `@smoke`, `@integration`
  - Parse tags from feature files
  - Runtime filtering
  - CLI options for tag selection

- [ ] **Better Error Messages**
  - Show feature file location in errors
  - Suggest similar step definitions when missing
  - Colored output for better readability

- [ ] **Step Definition Discovery**
  - Auto-detect step files
  - Warn about unused step definitions
  - Report duplicate steps

---

## 🚀 v1.2.0 - Reporting (Q2 2026)

**Focus: Test Results**

- [ ] **HTML Reporter**
  - Beautiful test reports
  - Screenshots on failure (optional)
  - Execution time metrics
  - Pass/fail statistics

- [ ] **JSON Reporter**
  - Machine-readable output
  - CI/CD integration
  - Custom formatters API

- [ ] **Console Reporter Improvements**
  - Progress bar
  - Real-time updates
  - Summary statistics

---

## 🎨 v2.0.0 - Advanced Gherkin (Q3 2026)

**Focus: Full Gherkin Compatibility**

- [ ] **Rule Support**
  - Gherkin 6+ `Rule` keyword
  - Nested scenarios under rules

- [ ] **Doc Strings**
  - Multi-line text blocks
  - Preserve formatting
  - Pass to step definitions

- [ ] **Hooks Expansion**
  - BeforeFeature / AfterFeature
  - BeforeStep / AfterStep
  - Conditional hooks based on tags

- [ ] **Parallel Execution**
  - Run scenarios in parallel
  - Configurable concurrency
  - Isolated test contexts

---

## 🛠️ v2.1.0 - Tooling (Q4 2026)

**Focus: IDE Integration**

- [ ] **VS Code Extension**
  - Syntax highlighting for .feature files
  - Go to step definition
  - Auto-complete for steps
  - Run scenarios from editor

- [ ] **CLI Tool**
  - `co-gherkin init` - Project setup
  - `co-gherkin run` - Execute features
  - `co-gherkin validate` - Check feature files

- [ ] **Step Generator**
  - Generate step definitions from feature files
  - TypeScript templates
  - Customizable templates

---

## 🌟 Future Ideas (Backlog)

**Community Requested Features**

- [ ] Cucumber.js compatibility layer
- [ ] Playwright integration
- [ ] Jest adapter
- [ ] Custom step parameter types
- [ ] Internationalization (i18n) for keywords
- [ ] Performance optimizations
- [ ] Browser-based test runner
- [ ] AI-powered step suggestions

---

## 🤝 Contributing

Want to help shape the future of co-gherkin?

- 💡 **Suggest features**: [Open an issue](https://github.com/mdavidgm/co-gherkin/issues)
- 🐛 **Report bugs**: [Bug reports](https://github.com/mdavidgm/co-gherkin/issues)
- 🔧 **Submit PRs**: [Contributing guide](CONTRIBUTING.md)
- ⭐ **Star the repo**: Show your support!

---

## 📊 Version History

| Version | Release Date | Highlights |
|---------|-------------|------------|
| 1.0.1   | Dec 2025    | ESM compatibility fix |
| 1.0.0   | Dec 2025    | Initial release |

---

**Last Updated**: December 2025

*This roadmap is subject to change based on community feedback and priorities.*
