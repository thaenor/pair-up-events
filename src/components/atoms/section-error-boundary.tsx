import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import ErrorBoundary from '../ErrorBoundary';

export type SectionErrorBoundaryProps = {
  children: React.ReactNode;
  sectionName?: string;
  fallbackMessage?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

/**
 * Specialized error boundary for app sections
 * Provides a more compact error UI suitable for sections within pages
 */
const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  children,
  sectionName = 'section',
  fallbackMessage,
  onError
}) => {
  const defaultFallback = ({ resetError }: { error?: Error; resetError: () => void }) => (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-red-400 mb-2">
        {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Error
      </h3>
      <p className="text-gray-300 mb-4">
        {fallbackMessage || `Something went wrong in the ${sectionName}. Please try again.`}
      </p>
      <button
        onClick={resetError}
        className="inline-flex items-center px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </button>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={defaultFallback}
      onError={onError}
      maxRetries={2}
      showErrorDetails={false}
      enableRetry={true}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SectionErrorBoundary;
