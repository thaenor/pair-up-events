import * as Sentry from '@sentry/react';

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
  });
}

// Export Sentry for direct usage where needed
export { Sentry };