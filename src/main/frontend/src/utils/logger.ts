/**
 * Logger utility for development
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  prefix?: string;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  enabled: process.env.NODE_ENV !== 'production',
  level: LogLevel.INFO,
};

/**
 * Logger class
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Set logger configuration
   */
  public setConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Enable or disable logging
   */
  public setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Set log level
   */
  public setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Check if logging is enabled for a specific level
   */
  private isEnabled(level: LogLevel): boolean {
    if (!this.config.enabled) {
      return false;
    }

    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.level);
    const logLevelIndex = levels.indexOf(level);

    return logLevelIndex >= configLevelIndex;
  }

  /**
   * Format log message
   */
  private formatMessage(level: LogLevel, message: string): string {
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    return `${prefix}[${level}] ${message}`;
  }

  /**
   * Log a debug message
   */
  public debug(message: string, ...args: unknown[]): void {
    if (this.isEnabled(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message), ...args);
    }
  }

  /**
   * Log an info message
   */
  public info(message: string, ...args: unknown[]): void {
    if (this.isEnabled(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message), ...args);
    }
  }

  /**
   * Log a warning message
   */
  public warn(message: string, ...args: unknown[]): void {
    if (this.isEnabled(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
    }
  }

  /**
   * Log an error message
   */
  public error(message: string, ...args: unknown[]): void {
    if (this.isEnabled(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message), ...args);
    }
  }

  /**
   * Create a child logger with a prefix
   */
  public createChild(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: this.config.prefix ? `${this.config.prefix}:${prefix}` : prefix,
    });
  }
}

/**
 * Create API logger instance
 */
export const apiLogger = new Logger({ prefix: 'API' });

/**
 * Export default logger instance
 */
export default new Logger();
