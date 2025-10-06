import type * as SentryTypes from '@sentry/react';

interface SentryContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

let sentryPromise: Promise<typeof import('@sentry/react') | null> | null = null;
let sentryInitialized = false;

const loadSentry = async (): Promise<typeof import('@sentry/react') | null> => {
  if (!import.meta.env.PROD) {
    return null;
  }

  if (sentryPromise) {
    return sentryPromise;
  }

  sentryPromise = import('@sentry/react')
    .then((Sentry) => {
      if (!sentryInitialized) {
        initializeWithConfig(Sentry);
        sentryInitialized = true;
      }
      return Sentry;
    })
    .catch((error) => {
      if (import.meta.env.DEV) {
        console.error('Failed to load Sentry', error);
      }
      sentryPromise = null;
      return null;
    });

  return sentryPromise;
};

const initializeWithConfig = (Sentry: typeof SentryTypes) => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
    replaysOnErrorSampleRate: import.meta.env.PROD ? 1.0 : 0,
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
    beforeSend(event) {
      if (import.meta.env.DEV && event.level !== 'error') {
        return null;
      }

      if (event.user) {
        event.user = {
          id: event.user.id,
          ...(import.meta.env.DEV && { email: event.user.email }),
        };
      }

      return event;
    },
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
    ],
  });
};

const withSentry = (
  callback: (Sentry: typeof SentryTypes) => void,
) => {
  if (!import.meta.env.PROD) {
    return;
  }

  void loadSentry().then((Sentry) => {
    if (!Sentry) {
      return;
    }
    callback(Sentry);
  });
};

export const initializeSentry = () => {
  if (!import.meta.env.PROD) {
    return;
  }

  void loadSentry();
};

export const getSentry = () => loadSentry();

export const setSentryUser = (user: { uid: string; email?: string }) => {
  withSentry((Sentry) => {
    Sentry.setUser({
      id: user.uid,
      email: user.email,
    });
  });
};

export const clearSentryUser = () => {
  withSentry((Sentry) => {
    Sentry.setUser(null);
  });
};

export const addSentryBreadcrumb = (
  message: string,
  category: string,
  data?: Record<string, unknown>,
) => {
  withSentry((Sentry) => {
    Sentry.addBreadcrumb({
      message,
      category,
      level: 'info',
      data,
      timestamp: Date.now() / 1000,
    });
  });
};

export const captureSentryException = (
  error: Error,
  context?: SentryContext,
) => {
  withSentry((Sentry) => {
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
  });
};

export const captureSentryMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: SentryContext,
) => {
  withSentry((Sentry) => {
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
  });
};

