/**
 * Simple logger utility for debugging co-gherkin.
 * Logs are hidden by default unless debug mode is enabled.
 */

export class Logger {
  private enabled = false;

  constructor() {
    // Enable if environment variable is set
    if (typeof process !== 'undefined' && process.env.CO_GHERKIN_DEBUG) {
      this.enabled = true;
    }
  }

  /**
   * Enable or disable debug logging
   */
  setDebug(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Log a debug message
   */
  log(tag: string, message: string, ...args: any[]) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
    console.log(`[${timestamp}] [${tag}] ${message}`, ...args);
  }

  /**
   * Log an error message (always shown or just with debug? Usually errors should be visible, 
   * but for 'debug' specific errors we can use this)
   */
  error(tag: string, message: string, error?: any) {
    if (!this.enabled) return;
    console.error(`[${tag}] ERROR: ${message}`, error || '');
  }
}

export const logger = new Logger();
