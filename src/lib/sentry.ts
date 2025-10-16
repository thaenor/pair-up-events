import * as Sentry from '@sentry/react'

/**
 * Initialize Sentry error tracking service
 *
 * Configures Sentry for error monitoring, session replay, and performance
 * tracking. Only initializes in production environment to avoid polluting
 * development logs with expected errors.
 *
 * Features:
 * - Browser tracing integration for performance monitoring
 * - Session replay with error replay support
 * - Smart error filtering to ignore known non-critical errors
 * - Configured sampling rates to control data volume
 *
 * @see {@link https://sentry.io/} Sentry documentation
 * @see {@link https://docs.sentry.io/platforms/javascript/} Sentry JavaScript SDK
 *
 * @example
 * ```ts
 * import { Sentry } from '@/lib/sentry';
 *
 * try {
 *   // risky operation
 * } catch (error) {
 *   Sentry.captureException(error);
 * }
 * ```
 */
// Initialize Sentry only in production
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Network request failed',
      'Loading chunk',
      'ChunkLoadError',
      'WebSocket connection',
      'WebSocket error',
      'Failed to fetch',
    ],
  })
}

/**
 * Sentry instance for manual error reporting
 *
 * Export Sentry for direct usage where needed throughout the application
 * for custom error capture and context setting.
 *
 * @example
 * ```ts
 * import { Sentry } from '@/lib/sentry';
 *
 * // Add user context
 * Sentry.setUser({ id: '123', email: 'user@example.com' });
 *
 * // Capture exception
 * Sentry.captureException(new Error('Something went wrong'));
 * ```
 */
export { Sentry }
