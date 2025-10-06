import React from 'react';
import * as Sentry from '@sentry/react';
import { RefreshCw, Home, Bug, AlertTriangle, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

import { logError } from '@/utils/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
  retryCount: number;
  isRetrying: boolean;
  copiedToClipboard: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  showErrorDetails?: boolean;
  enableRetry?: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isRetrying: false,
      copiedToClipboard: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError, maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    // Enhanced error logging with more context
    logError('Error caught by boundary', error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      additionalData: {
        errorInfo,
        retryCount,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    });

    // Report to Sentry with enhanced context
    if (import.meta.env.MODE === 'production') {
      Sentry.withScope((scope) => {
        scope.setTag('errorBoundary', true);
        scope.setTag('retryCount', retryCount.toString());
        scope.setContext('errorInfo', {
          componentStack: errorInfo.componentStack,
        });
        scope.setContext('browser', {
          userAgent: navigator.userAgent,
          url: window.location.href,
        });
        scope.setContext('retry', {
          count: retryCount,
          maxRetries,
        });
        Sentry.captureException(error);
      });
    }

    // Store error info for display
    this.setState({ errorInfo });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Auto-retry for certain types of errors (network, chunk loading, etc.)
    if (this.shouldAutoRetry(error) && retryCount < maxRetries) {
      this.scheduleRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private shouldAutoRetry(error: Error): boolean {
    const autoRetryErrors = [
      'ChunkLoadError',
      'Loading chunk',
      'Network request failed',
      'Failed to fetch',
      'Connection failed'
    ];

    return autoRetryErrors.some(errorType =>
      error.message.includes(errorType) || error.name.includes(errorType)
    );
  }

  private scheduleRetry = () => {
    const { retryCount } = this.state;
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff, max 10s

    this.setState({ isRetrying: true });

    this.retryTimeoutId = setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
        isRetrying: false
      }));
    }, delay);
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
      isRetrying: false,
      copiedToClipboard: false
    });
  };

  private copyErrorToClipboard = async () => {
    const { error, errorInfo, errorId } = this.state;
    if (!error) return;

    const errorReport = `
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

Error: ${error.name}
Message: ${error.message}
Stack: ${error.stack}

Component Stack: ${errorInfo?.componentStack || 'N/A'}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorReport);
      this.setState({ copiedToClipboard: true });
      toast.success('Error details copied to clipboard');

      // Reset the copied state after 3 seconds
      setTimeout(() => {
        this.setState({ copiedToClipboard: false });
      }, 3000);
    } catch {
      toast.error('Failed to copy error details');
    }
  };

  private goHome = () => {
    window.location.href = '/';
  };

  private reloadPage = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo, errorId, retryCount, isRetrying, copiedToClipboard } = this.state;
    const { fallback, showErrorDetails = import.meta.env.MODE === 'development', enableRetry = true } = this.props;

    if (hasError) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent error={error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-pairup-darkBlue p-4">
          <div className="text-center max-w-2xl mx-auto">
            {/* Error Icon and Title */}
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-500/20 rounded-full">
                  <AlertTriangle className="h-12 w-12 text-red-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-pairup-cream/80 text-lg">
                We're sorry for the inconvenience. Our team has been notified and is working to fix this issue.
              </p>
            </div>

            {/* Error ID for Support */}
            {errorId && (
              <div className="bg-pairup-darkBlue/60 border border-pairup-cyan/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-pairup-cream/70 mb-1">Error Reference ID:</p>
                <p className="text-pairup-cyan font-mono text-sm break-all">{errorId}</p>
                <p className="text-xs text-pairup-cream/50 mt-2">
                  Please include this ID when contacting support
                </p>
              </div>
            )}

            {/* Retry Status */}
            {isRetrying && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
                  <p className="text-blue-400">
                    Attempting to recover... (Attempt {retryCount + 1})
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={this.reloadPage}
                disabled={isRetrying}
                className="flex items-center justify-center px-6 py-3 bg-pairup-cyan text-pairup-darkBlue rounded-lg font-medium hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Reload Page
              </button>

              <button
                onClick={this.goHome}
                disabled={isRetrying}
                className="flex items-center justify-center px-6 py-3 border border-pairup-cyan text-pairup-cyan rounded-lg font-medium hover:bg-pairup-cyan/10 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </button>
            </div>

            {/* Try Again Button (if retries enabled) */}
            {enableRetry && !isRetrying && (
              <button
                onClick={this.resetError}
                className="w-full sm:w-auto px-6 py-3 border border-gray-500 text-gray-300 rounded-lg font-medium hover:bg-gray-500/10 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors mb-6"
              >
                Try Again
              </button>
            )}

            {/* Copy Error Details Button */}
            <div className="mb-6">
              <button
                onClick={this.copyErrorToClipboard}
                disabled={isRetrying}
                className="flex items-center justify-center mx-auto px-4 py-2 text-sm border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600/10 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {copiedToClipboard ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Error Details
                  </>
                )}
              </button>
            </div>

            {/* Development Error Details */}
            {showErrorDetails && error && (
              <details className="text-left bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <summary className="flex items-center cursor-pointer text-pairup-yellow hover:text-yellow-300 mb-3">
                  <Bug className="h-4 w-4 mr-2" />
                  Error Details (Development Only)
                </summary>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Error Information:</h4>
                    <div className="text-xs text-gray-300 space-y-1">
                      <p><strong>Name:</strong> {error.name}</p>
                      <p><strong>Message:</strong> {error.message}</p>
                      <p><strong>Retry Count:</strong> {retryCount}</p>
                    </div>
                  </div>

                  {error.stack && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-2">Stack Trace:</h4>
                      <pre className="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-auto max-h-40">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {errorInfo?.componentStack && (
                    <div>
                      <h4 className="text-sm font-semibold text-red-400 mb-2">Component Stack:</h4>
                      <pre className="text-xs text-gray-400 bg-gray-800 p-3 rounded overflow-auto max-h-40">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-pairup-cream/60">
                If this problem persists, please contact our support team with the error ID above.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
