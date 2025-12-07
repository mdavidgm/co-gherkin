import * as path from 'path';

/**
 * Resolves the absolute path of a feature file.
 * If the path is relative, it attempts to resolve it relative to the caller's file.
 * @param featurePath - The path to the feature file
 * @param forcedStack - Optional stack trace for testing
 */
export function resolveFeaturePath(featurePath: string, forcedStack?: string): string {
  if (path.isAbsolute(featurePath)) {
    return featurePath;
  }

  // Get caller's directory from stack trace
  const stack = forcedStack ?? new Error().stack;
  const stackLines = stack?.split('\n') || [];

  let callerFile = '';
  for (const line of stackLines) {
    // Basic stack trace parsing for Node.js
    // at Object.<anonymous> (/path/to/file.ts:1:1)
    const match = line.match(/at\s+(?:.*?\(|)(.*?):\d+:\d+(?:\)|)/);
    if (match && match[1]) {
      let file = match[1];

      // Clean file:// prefix if present
      if (file.startsWith('file://')) {
        file = file.replace('file://', '');
      }

      // Ignore internal library files to find the consumer's test file
      if (!file.includes('vitest-gherkin-global/src') &&
        !file.includes('co-gherkin/src') &&
        !file.includes('co-gherkin/dist')) {
        callerFile = file;
        break;
      }
    }
  }

  if (callerFile) {
    const callerDir = path.dirname(callerFile);
    return path.resolve(callerDir, featurePath);
  } else {
    // Fallback to CWD
    return path.resolve(process.cwd(), featurePath);
  }
}
