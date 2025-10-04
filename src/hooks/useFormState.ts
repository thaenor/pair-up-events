import { useState, useCallback } from 'react';

export const useFormState = <T extends Record<string, unknown>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const updateField = useCallback((field: keyof T, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        return { ...prev, [field]: undefined };
      }
      return prev;
    });
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setAllErrors = useCallback((newErrors: Partial<Record<keyof T, string>> | ((prev: Partial<Record<keyof T, string>>) => Partial<Record<keyof T, string>>)) => {
    setErrors(newErrors);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  return {
    formData,
    errors,
    updateField,
    setFieldError,
    setAllErrors,
    clearErrors,
    clearFieldError
  };
};
