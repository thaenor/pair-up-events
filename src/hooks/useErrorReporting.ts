import { useCallback } from 'react';
import { toast } from 'sonner';

import { logError } from '@/utils/logger';

export interface ErrorReportingOptions {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
  showToast?: boolean;
  toastMessage?: string;
}

/**
 * Hook for consistent error reporting across the application
 * Provides standardized error handling with logging, user feedback, and optional recovery
 */
export const useErrorReporting = () => {
  const reportError = useCallback((
    error: Error | unknown,
    options: ErrorReportingOptions = {}
  ) => {
    const {
      component = 'Unknown',
      action = 'Unknown',
      userId,
      additionalData,
      showToast = true,
      toastMessage
    } = options;

    // Log the error with context
    logError('Application error', error, {
      component,
      action,
      userId,
      additionalData: {
        ...additionalData,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    });

    // Show user-friendly toast notification
    if (showToast) {
      const message = toastMessage || 'Something went wrong. Please try again.';
      toast.error(message);
    }
  }, []);

  const reportAsyncError = useCallback(async (
    asyncOperation: () => Promise<void>,
    options: ErrorReportingOptions = {}
  ) => {
    try {
      await asyncOperation();
    } catch (error) {
      reportError(error, options);
      throw error; // Re-throw to allow caller to handle if needed
    }
  }, [reportError]);

  const reportNetworkError = useCallback((
    error: Error | unknown,
    endpoint?: string,
    options: Omit<ErrorReportingOptions, 'additionalData'> = {}
  ) => {
    reportError(error, {
      ...options,
      action: options.action || 'Network Request',
      additionalData: {
        endpoint,
        networkError: true
      },
      toastMessage: 'Network error. Please check your connection and try again.'
    });
  }, [reportError]);

  const reportValidationError = useCallback((
    error: Error | unknown,
    field?: string,
    options: Omit<ErrorReportingOptions, 'additionalData'> = {}
  ) => {
    reportError(error, {
      ...options,
      action: options.action || 'Validation',
      additionalData: {
        field,
        validationError: true
      },
      toastMessage: field ? `Invalid ${field}. Please check your input.` : 'Validation error. Please check your input.'
    });
  }, [reportError]);

  return {
    reportError,
    reportAsyncError,
    reportNetworkError,
    reportValidationError
  };
};
