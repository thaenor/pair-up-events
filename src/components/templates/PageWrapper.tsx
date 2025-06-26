
import React from 'react';
import ErrorBoundary from '../atoms/ErrorBoundary';
import LoadingState from '../molecules/LoadingState';

interface PageWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  className?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  isLoading = false,
  loadingMessage = 'Loading page...',
  className,
  onError
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to your error reporting service here
    console.error('Page Error:', error, errorInfo);
    onError?.(error, errorInfo);
  };

  return (
    <ErrorBoundary level="page" onError={handleError}>
      <div className={className}>
        {isLoading ? (
          <LoadingState 
            message={loadingMessage} 
            type="page" 
            size="lg"
          />
        ) : (
          children
        )}
      </div>
    </ErrorBoundary>
  );
};

export default PageWrapper;
