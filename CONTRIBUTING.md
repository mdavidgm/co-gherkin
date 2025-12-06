# Contributing to Co-Gherkin

Thank you for your interest in contributing to co-gherkin! 🎉

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/co-gherkin.git
   cd co-gherkin
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests** (when available)
   ```bash
   npm test
   ```

---

## 📝 How to Contribute

### Reporting Bugs

Found a bug? Please [open an issue](https://github.com/mdavidgm/co-gherkin/issues) with:

- **Clear title** - Describe the bug briefly
- **Steps to reproduce** - How to trigger the bug
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Environment** - Node version, OS, etc.
- **Code sample** - Minimal reproducible example

### Suggesting Features

Have an idea? [Open an issue](https://github.com/mdavidgm/co-gherkin/issues) with:

- **Use case** - Why is this needed?
- **Proposed solution** - How should it work?
- **Alternatives** - Other ways to solve it
- **Examples** - Code samples if applicable

### Submitting Pull Requests

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add TypeScript types
   - Update documentation if needed

3. **Build and test**
   ```bash
   npm run build
   npm test  # When tests are available
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation only
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes

---

## 📐 Code Style

- **TypeScript** - Use TypeScript for all code
- **ESM** - Use ES modules (import/export)
- **Formatting** - Code will be formatted automatically
- **Naming** - Use descriptive names
  - Functions: `camelCase`
  - Classes: `PascalCase`
  - Constants: `UPPER_CASE`

---

## 🧪 Testing

Currently, co-gherkin is tested through integration in real projects.

**Future**: We plan to add:
- Unit tests for parser
- Integration tests for runner
- Example projects

---

## 📚 Documentation

When adding features:

1. **Update README.md** - Add usage examples
2. **Update ROADMAP.md** - Mark completed features
3. **Add JSDoc comments** - Document public APIs
4. **Update CHANGELOG.md** - Note your changes

---

## 🎯 Priority Areas

Looking to contribute? These areas need help:

1. **Testing** - Add comprehensive test suite
2. **Documentation** - More examples and guides
3. **Error Messages** - Make them more helpful
4. **Performance** - Optimize parser and runner
5. **Features** - See [ROADMAP.md](ROADMAP.md)

---

## 💬 Questions?

- **GitHub Issues** - For bugs and features
- **GitHub Discussions** - For questions and ideas
- **Email** - mdavid29021984@gmail.com

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making co-gherkin better> /Users/kuman/projects/co-gherkin/ROADMAP.md << 'EOF'
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
EOF* ❤️
