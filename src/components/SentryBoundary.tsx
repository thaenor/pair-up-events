import { useEffect, useState, type ReactNode } from 'react';
import type * as SentryTypes from '@sentry/react';

import { getSentry } from '@/lib/sentry';

interface SentryBoundaryProps {
  children: ReactNode;
}

const renderFallback = ({ resetError }: { resetError: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-pairup-darkBlue">
    <div className="text-center max-w-md p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
      <p className="text-pairup-cream mb-6">
        We're sorry, but something unexpected happened.
      </p>
      <button
        onClick={resetError}
        className="px-6 py-3 bg-pairup-cyan text-pairup-darkBlue font-medium rounded-lg hover:bg-pairup-cyan/90 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

const SentryBoundary = ({ children }: SentryBoundaryProps) => {
  const [sentryModule, setSentryModule] = useState<typeof SentryTypes | null>(null);

  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }

    let isMounted = true;

    void getSentry().then((module) => {
      if (isMounted) {
        setSentryModule(module);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!import.meta.env.PROD || !sentryModule) {
    return <>{children}</>;
  }

  const ErrorBoundary = sentryModule.ErrorBoundary;

  return (
    <ErrorBoundary fallback={renderFallback}>
      {children}
    </ErrorBoundary>
  );
};

export default SentryBoundary;
