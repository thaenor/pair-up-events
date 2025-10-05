/**
 * Centralized logging utility for the application
 * Provides consistent error handling and logging across all components
 * Integrates with Sentry for production error tracking
 */

import { captureSentryException, captureSentryMessage } from '@/lib/sentry';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const logData = this.formatLogData(LogLevel.ERROR, message, error, context);

    if (this.isDevelopment) {
      console.error('🚨 [ERROR]', logData);
    }

    // Send to Sentry only in production
    if (!this.isDevelopment) {
      if (error instanceof Error) {
        captureSentryException(error, context);
      } else {
        captureSentryMessage(message, 'error', context);
      }
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    const logData = this.formatLogData(LogLevel.WARN, message, undefined, context);

    if (this.isDevelopment) {
      console.warn('⚠️ [WARN]', logData);
    }

    // Send warnings to Sentry only in production
    if (!this.isDevelopment) {
      captureSentryMessage(message, 'warning', context);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext): void {
    const logData = this.formatLogData(LogLevel.INFO, message, undefined, context);

    if (this.isDevelopment) {
      console.info('ℹ️ [INFO]', logData);
    }
    // Info logs are typically not sent to external services in production
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const logData = this.formatLogData(LogLevel.DEBUG, message, undefined, context);
      console.debug('🐛 [DEBUG]', logData);
    }
  }

  /**
   * Format log data for consistent structure
   */
  private formatLogData(
    level: LogLevel,
    message: string,
    error?: Error | unknown,
    context?: LogContext
  ) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      context: {
        ...context,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
    };
  }

}

// Create and export a singleton instance
export const logger = new Logger();

// Convenience functions for common use cases
export const logError = (message: string, error?: Error | unknown, context?: LogContext) =>
  logger.error(message, error, context);

export const logWarning = (message: string, context?: LogContext) =>
  logger.warn(message, context);

export const logInfo = (message: string, context?: LogContext) =>
  logger.info(message, context);

export const logDebug = (message: string, context?: LogContext) =>
  logger.debug(message, context);
