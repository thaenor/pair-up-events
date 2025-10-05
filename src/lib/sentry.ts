import * as Sentry from '@sentry/react';

/**
 * Sentry configuration and initialization
 * Provides error tracking, performance monitoring, and user feedback
 * Only enabled in production environment
 */

// Only initialize Sentry in production
if (import.meta.env.MODE === 'production') {
  Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,

  // Set environment
  environment: import.meta.env.MODE || 'development',

  // Performance monitoring
  tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,

  // Session replay (only in production for privacy)
  replaysSessionSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 0,
  replaysOnErrorSampleRate: import.meta.env.MODE === 'production' ? 1.0 : 0,

  // Release tracking
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Before sending event (filter sensitive data)
  beforeSend(event) {
    // Filter out non-error events in development
    if (import.meta.env.MODE === 'development' && event.level !== 'error') {
      return null;
    }

    // Remove sensitive data
    if (event.user) {
      // Keep user ID but remove email for privacy
      event.user = {
        id: event.user.id,
        // Don't include email in production
        ...(import.meta.env.MODE === 'development' && { email: event.user.email })
      };
    }

    return event;
  },

  // Integration configuration
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Mask sensitive elements
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Error filtering
  ignoreErrors: [
    // Ignore common browser errors that aren't actionable
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Network request failed',
    'Loading chunk',
    'ChunkLoadError',
  ],
  });
}

/**
 * Set user context for error tracking
 * Only works when Sentry is initialized (production)
 */
export const setSentryUser = (user: { uid: string; email?: string }) => {
  if (import.meta.env.MODE === 'production') {
    Sentry.setUser({
      id: user.uid,
      email: user.email,
    });
  }
};

/**
 * Clear user context (on logout)
 */
export const clearSentryUser = () => {
  if (import.meta.env.MODE === 'production') {
    Sentry.setUser(null);
  }
};

/**
 * Add breadcrumb for user actions
 */
export const addSentryBreadcrumb = (message: string, category: string, data?: Record<string, unknown>) => {
  if (import.meta.env.MODE === 'production') {
    Sentry.addBreadcrumb({
      message,
      category,
      level: 'info',
      data,
      timestamp: Date.now() / 1000,
    });
  }
};

/**
 * Capture exception with context
 */
export const captureSentryException = (
  error: Error,
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    additionalData?: Record<string, unknown>;
  }
) => {
  if (import.meta.env.MODE === 'production') {
    Sentry.withScope((scope) => {
      if (context?.component) {
        scope.setTag('component', context.component);
      }
      if (context?.action) {
        scope.setTag('action', context.action);
      }
      if (context?.userId) {
        scope.setUser({ id: context.userId });
      }
      if (context?.additionalData) {
        scope.setContext('additionalData', context.additionalData);
      }

      Sentry.captureException(error);
    });
  }
};

/**
 * Capture message with context
 */
export const captureSentryMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: {
    component?: string;
    action?: string;
    userId?: string;
    additionalData?: Record<string, unknown>;
  }
) => {
  if (import.meta.env.MODE === 'production') {
    Sentry.withScope((scope) => {
      if (context?.component) {
        scope.setTag('component', context.component);
      }
      if (context?.action) {
        scope.setTag('action', context.action);
      }
      if (context?.userId) {
        scope.setUser({ id: context.userId });
      }
      if (context?.additionalData) {
        scope.setContext('additionalData', context.additionalData);
      }

      Sentry.captureMessage(message, level);
    });
  }
};

export default Sentry;
