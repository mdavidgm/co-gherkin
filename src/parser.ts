/**
 * Simple Gherkin Feature Parser
 * Parses .feature files using regex (no external dependencies)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface ParsedStep {
  keyword: string;
  text: string;
  type: 'Given' | 'When' | 'Then' | 'And' | 'But' | '*';
  dataTable?: string[][];
}

export interface ParsedScenario {
  name: string;
  steps: ParsedStep[];
  tags: string[];
}

export interface ParsedFeature {
  name: string;
  description: string;
  scenarios: ParsedScenario[];
  background?: ParsedStep[];
}

/**
 * Parse a .feature file into structured data
 */
export function parseFeatureFile(featurePath: string): ParsedFeature {
  let absolutePath: string;

  if (path.isAbsolute(featurePath)) {
    absolutePath = featurePath;
  } else {
    // Get caller's directory from stack trace
    const stack = new Error().stack;
    const stackLines = stack?.split('\n') || [];

    let callerFile = '';
    for (const line of stackLines) {
      const match = line.match(/at\s+(?:.*?\(|)(.*?):\d+:\d+(?:\)|)/);
      if (match && match[1]) {
        const file = match[1];
        if (!file.includes('vitest-gherkin-global/src/parser') &&
          !file.includes('vitest-gherkin-global/src/runner') &&
          !file.includes('vitest-gherkin-global/src/index')) {
          callerFile = file;
          break;
        }
      }
    }

    if (callerFile) {
      const callerDir = path.dirname(callerFile);
      absolutePath = path.resolve(callerDir, featurePath);
    } else {
      absolutePath = path.resolve(process.cwd(), featurePath);
    }
  }

  const content = fs.readFileSync(absolutePath, 'utf-8');
  return parseFeatureContent(content);
}

export function parseFeatureContent(content: string): ParsedFeature {
  const lines = content.split('\n');

  let featureName = '';
  const featureDescription = '';
  const scenarios: ParsedScenario[] = [];
  let backgroundSteps: ParsedStep[] = [];

  let currentScenario: ParsedScenario | null = null;
  let isBackground = false;
  let isScenarioOutline = false;
  let currentExamples: { headers: string[]; rows: string[][] } | null = null;
  let outlineScenarioTemplate: ParsedScenario | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip comments and empty lines
    if (trimmedLine.startsWith('#') || trimmedLine === '') {
      continue;
    }

    // Feature
    if (trimmedLine.startsWith('Feature:')) {
      featureName = trimmedLine.replace('Feature:', '').trim();
      continue;
    }

    // Background
    if (trimmedLine.startsWith('Background:')) {
      isBackground = true;
      currentScenario = null;
      continue;
    }

    // Scenario / Scenario Outline
    if (trimmedLine.startsWith('Scenario:') || trimmedLine.startsWith('Scenario Outline:')) {
      isBackground = false;
      isScenarioOutline = trimmedLine.startsWith('Scenario Outline:');

      if (currentScenario && !isScenarioOutline) {
        scenarios.push(currentScenario);
      }

      const scenarioName = trimmedLine.replace(/Scenario( Outline)?:/, '').trim();

      const newScenario = {
        name: scenarioName,
        steps: [],
        tags: [],
      };

      if (isScenarioOutline) {
        outlineScenarioTemplate = newScenario;
        currentScenario = null;
      } else {
        currentScenario = newScenario;
      }
      continue;
    }

    // Examples Block
    if (trimmedLine.startsWith('Examples:')) {
      currentExamples = { headers: [], rows: [] };
      continue;
    }

    // Table Row (Examples or Data Table)
    if (trimmedLine.startsWith('|')) {
      const rowData = trimmedLine
        .split('|')
        .slice(1, -1)
        .map(cell => cell.trim());

      if (currentExamples) {
        // We are in an Examples block
        if (currentExamples.headers.length === 0) {
          currentExamples.headers = rowData;
        } else {
          currentExamples.rows.push(rowData);
        }
      } else if (currentScenario || (isBackground && backgroundSteps)) {
        // We are in a Data Table for a step
        const targetSteps = isBackground ? backgroundSteps : (isScenarioOutline ? outlineScenarioTemplate!.steps : currentScenario!.steps);
        const lastStep = targetSteps[targetSteps.length - 1];
        if (lastStep) {
          if (!lastStep.dataTable) {
            lastStep.dataTable = [];
          }
          lastStep.dataTable.push(rowData);
        }
      }
      continue;
    } else {
      // If we encounter a non-table line, close the examples block if open
      if (currentExamples && outlineScenarioTemplate) {
        // Expand Scenario Outline
        expandScenarioOutline(outlineScenarioTemplate, currentExamples, scenarios);
        currentExamples = null;
        outlineScenarioTemplate = null;
      }
    }

    // Steps
    const stepMatch = trimmedLine.match(/^(\*|Given|When|Then|And|But)\s+(.+)$/);
    if (stepMatch) {
      const [, keyword, text] = stepMatch;
      const stepType: 'Given' | 'When' | 'Then' | 'And' | 'But' | '*' = keyword as any;

      const step: ParsedStep = {
        keyword: keyword,
        text: text,
        type: stepType,
      };

      if (isBackground) {
        backgroundSteps.push(step);
      } else if (isScenarioOutline && outlineScenarioTemplate) {
        outlineScenarioTemplate.steps.push(step);
      } else if (currentScenario) {
        currentScenario.steps.push(step);
      }
    }
  }

  // Handle last scenario or outline
  if (currentScenario) {
    scenarios.push(currentScenario);
  } else if (outlineScenarioTemplate && currentExamples) {
    expandScenarioOutline(outlineScenarioTemplate, currentExamples, scenarios);
  }

  return {
    name: featureName,
    description: featureDescription,
    scenarios,
    background: backgroundSteps.length > 0 ? backgroundSteps : undefined,
  };
}

function expandScenarioOutline(
  template: ParsedScenario,
  examples: { headers: string[]; rows: string[][] },
  scenarios: ParsedScenario[]
) {
  examples.rows.forEach((row, index) => {
    const scenarioName = `${template.name} (Example ${index + 1})`;
    const steps = template.steps.map(step => {
      let newText = step.text;
      // Replace <header> with value
      examples.headers.forEach((header, colIndex) => {
        const value = row[colIndex];
        newText = newText.replace(new RegExp(`<${header}>`, 'g'), value);
      });
      return { ...step, text: newText };
    });

    scenarios.push({
      name: scenarioName,
      steps: steps,
      tags: template.tags,
    });
  });
}
