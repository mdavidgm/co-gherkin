# co-gherkin Examples

This folder contains practical examples of how to use the `co-gherkin` library.

## Simple Calculator

This example demonstrates the basics:

1.  **Feature**: `simple-calculator/calculator.feature` defines the scenarios in Gherkin.
2.  **Steps**: `simple-calculator/calculator.steps.ts` implements the logic using `Given`, `When`, `Then`.
3.  **Test**: `simple-calculator/calculator.test.ts` connects everything and runs the test with Vitest.

## How to run the examples

From the root of the `co-gherkin` project:

```bash
npx vitest run examples
```

This will automatically execute the `calculator.test.ts` file.
