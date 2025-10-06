import React from 'react';
import { useNavigate } from 'react-router-dom';

import { logError } from '@/utils/logger';
import { captureSentryException } from '@/lib/sentry';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  navigate?: (path: string, options?: { replace?: boolean }) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return {
      hasError: true
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, navigate } = this.props;

    // Log error for debugging
    logError('Error caught by boundary', error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      additionalData: {
        errorInfo,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    });

    captureSentryException(error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      additionalData: {
        errorInfo,
        browser: {
          userAgent: navigator.userAgent,
          url: window.location.href,
        },
      },
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Navigate to 404 page
    if (navigate) {
      navigate('/404', { replace: true });
    }
  }


  render() {
    const { hasError } = this.state;

    if (hasError) {
      // Return null - the navigation to 404 will handle the UI
      return null;
    }

    return this.props.children;
  }
}

// Wrapper component that provides navigation functionality
interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = (props) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      {...props}
      navigate={navigate}
    />
  );
};

export default ErrorBoundaryWrapper;
