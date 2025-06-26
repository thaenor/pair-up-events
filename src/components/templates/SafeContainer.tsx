
import React from 'react';
import ErrorBoundary from '../atoms/ErrorBoundary';
import LoadingState from '../molecules/LoadingState';
import { tokens } from '@/lib/tokens';

interface SafeContainerProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  errorLevel?: 'page' | 'section' | 'component';
  loadingType?: 'page' | 'section' | 'component' | 'inline';
  className?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  isLoading = false,
  loadingMessage,
  errorLevel = 'component',
  loadingType = 'component',
  className,
  onError
}) => {
  return (
    <ErrorBoundary level={errorLevel} onError={onError}>
      <div className={`${className || ''}`}>
        {isLoading ? (
          <LoadingState 
            message={loadingMessage} 
            type={loadingType}
          />
        ) : (
          children
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SafeContainer;
