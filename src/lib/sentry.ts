import * as Sentry from '@sentry/react';

// Initialize Sentry immediately and synchronously
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE || 'development',
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
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

// Export only what's actually used
export { Sentry };
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setUser = Sentry.setUser;