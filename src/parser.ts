/**
 * Simple Gherkin Feature Parser
 * Parses .feature files using regex (no external dependencies)
 */

import * as fs from 'fs';
import { logger } from './logger.js';
import { resolveFeaturePath } from './utils.js';

export interface ParsedStep {
  keyword: string;
  text: string;
  type: 'Given' | 'When' | 'Then' | 'And' | 'But' | '*';
  dataTable?: string[][];
  docstring?: string;
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
  const absolutePath = resolveFeaturePath(featurePath);

  const content = fs.readFileSync(absolutePath, 'utf-8');
  logger.log('PARSER', `Parsing feature file: ${absolutePath}`);
  return parseFeatureContent(content);
}

export function parseFeatureContent(content: string): ParsedFeature {
  const parser = new FeatureParser();
  return parser.parse(content);
}

class FeatureParser {
  private featureName = '';
  private featureDescription = '';
  private scenarios: ParsedScenario[] = [];
  private backgroundSteps: ParsedStep[] = [];

  private currentScenario: ParsedScenario | null = null;
  private isBackground = false;
  private isScenarioOutline = false;
  private currentExamples: { headers: string[]; rows: string[][] } | null = null;
  private outlineScenarioTemplate: ParsedScenario | null = null;

  // DocString handling
  private inDocString = false;
  private docStringLines: string[] = [];

  parse(content: string): ParsedFeature {
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      if (this.handleDocString(line, trimmedLine, i)) {
        continue;
      }

      // Skip comments and empty lines ONLY if not in DocString
      if (trimmedLine.startsWith('#') || trimmedLine === '') {
        continue;
      }

      if (this.handleFeature(trimmedLine)) continue;
      if (this.handleBackground(trimmedLine)) continue;
      if (this.handleScenario(trimmedLine)) continue;
      if (this.handleExamples(trimmedLine)) continue;
      if (this.handleTable(trimmedLine)) continue;

      // Close Examples block if we hit a non-table line
      this.closeExamplesIfOpen();

      this.handleStep(trimmedLine);
    }

    this.finalize();

    return {
      name: this.featureName,
      description: this.featureDescription,
      scenarios: this.scenarios,
      background: this.backgroundSteps.length > 0 ? this.backgroundSteps : undefined,
    };
  }

  private handleDocString(line: string, trimmedLine: string, lineIndex: number): boolean {
    if (trimmedLine.startsWith('"""')) {
      if (this.inDocString) {
        // End of DocString
        this.inDocString = false;
        this.attachDocString(lineIndex);
        this.docStringLines = [];
      } else {
        // Start of DocString
        this.inDocString = true;
      }
      return true;
    }

    if (this.inDocString) {
      this.docStringLines.push(line);
      return true;
    }
    return false;
  }

  private attachDocString(lineIndex: number) {
    const targetSteps = this.getCurrentStepList();
    const lastStep = targetSteps[targetSteps.length - 1];

    if (lastStep) {
      logger.log('PARSER', `Attaching docstring to step: ${lastStep.text}`);
      lastStep.docstring = this.docStringLines.join('\n');
    } else {
      logger.log('PARSER', `WARNING: No lastStep to attach docstring! Line: ${lineIndex}`);
    }
  }

  private handleFeature(trimmedLine: string): boolean {
    if (trimmedLine.startsWith('Feature:')) {
      this.featureName = trimmedLine.replace('Feature:', '').trim();
      return true;
    }
    return false;
  }

  private handleBackground(trimmedLine: string): boolean {
    if (trimmedLine.startsWith('Background:')) {
      this.isBackground = true;
      this.currentScenario = null;
      return true;
    }
    return false;
  }

  private handleScenario(trimmedLine: string): boolean {
    if (trimmedLine.startsWith('Scenario:') || trimmedLine.startsWith('Scenario Outline:')) {
      this.isBackground = false;
      this.isScenarioOutline = trimmedLine.startsWith('Scenario Outline:');

      if (this.currentScenario && !this.isScenarioOutline) {
        this.scenarios.push(this.currentScenario);
      }

      const scenarioName = trimmedLine.replace(/Scenario( Outline)?:/, '').trim();
      const newScenario: ParsedScenario = {
        name: scenarioName,
        steps: [],
        tags: [],
      };

      if (this.isScenarioOutline) {
        this.outlineScenarioTemplate = newScenario;
        this.currentScenario = null;
      } else {
        this.currentScenario = newScenario;
      }
      return true;
    }
    return false;
  }

  private handleExamples(trimmedLine: string): boolean {
    if (trimmedLine.startsWith('Examples:')) {
      this.currentExamples = { headers: [], rows: [] };
      return true;
    }
    return false;
  }

  private handleTable(trimmedLine: string): boolean {
    if (trimmedLine.startsWith('|')) {
      const rowData = trimmedLine.split('|').slice(1, -1).map(c => c.trim());

      if (this.currentExamples) {
        if (this.currentExamples.headers.length === 0) {
          this.currentExamples.headers = rowData;
        } else {
          this.currentExamples.rows.push(rowData);
        }
      } else {
        // Data table for step
        const targetSteps = this.getCurrentStepList();
        const lastStep = targetSteps[targetSteps.length - 1];
        if (lastStep) {
          if (!lastStep.dataTable) {
            lastStep.dataTable = [];
          }
          lastStep.dataTable.push(rowData);
        }
      }
      return true;
    }
    return false;
  }

  private closeExamplesIfOpen() {
    if (this.currentExamples && this.outlineScenarioTemplate) {
      this.expandScenarioOutline(this.outlineScenarioTemplate, this.currentExamples);
      this.currentExamples = null;
      this.outlineScenarioTemplate = null;
    }
  }

  private handleStep(trimmedLine: string): boolean {
    const stepMatch = trimmedLine.match(/^(\*|Given|When|Then|And|But)\s+(.+)$/);
    if (stepMatch) {
      const [, keyword, text] = stepMatch;
      const stepType = keyword as ParsedStep['type'];

      const step: ParsedStep = { keyword, text, type: stepType };

      if (this.isBackground) {
        this.backgroundSteps.push(step);
      } else if (this.isScenarioOutline) {
        // We can assert ! because isScenarioOutline always sets outlineScenarioTemplate
        this.outlineScenarioTemplate!.steps.push(step);
      } else if (this.currentScenario) {
        this.currentScenario.steps.push(step);
      }
      return true;
    }
    return false;
  }

  private finalize() {
    if (this.currentScenario) {
      this.scenarios.push(this.currentScenario);
    } else if (this.outlineScenarioTemplate && this.currentExamples) {
      this.expandScenarioOutline(this.outlineScenarioTemplate, this.currentExamples);
    }
  }

  private expandScenarioOutline(
    template: ParsedScenario,
    examples: { headers: string[]; rows: string[][] }
  ) {
    examples.rows.forEach((row, index) => {
      const scenarioName = `${template.name} (Example ${index + 1})`;
      const steps = template.steps.map(step => {
        let newText = step.text;
        examples.headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          newText = newText.replace(new RegExp(`<${header}>`, 'g'), value);
        });
        return { ...step, text: newText };
      });

      this.scenarios.push({
        name: scenarioName,
        steps: steps,
        tags: template.tags,
      });
    });
  }

  private getCurrentStepList() {
    if (this.isBackground) return this.backgroundSteps;
    if (this.isScenarioOutline && this.outlineScenarioTemplate) return this.outlineScenarioTemplate.steps;
    return this.currentScenario ? this.currentScenario.steps : [];
  }
}
