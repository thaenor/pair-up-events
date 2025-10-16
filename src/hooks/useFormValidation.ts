import { useCallback } from 'react';
import { EMAIL_VALIDATION, PASSWORD_VALIDATION, DISPLAY_NAME_VALIDATION, BIRTHDATE_VALIDATION } from '@/constants/validation';
import { VALIDATION_MESSAGES } from '@/constants/messages';

export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  birthDate: string;
}

export interface FormErrors extends Record<string, string | undefined> {
  email?: string;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
  birthDate?: string;
}

export const useFormValidation = () => {
  // Email validation
  const validateEmail = useCallback((email: string): string | null => {
    // Basic format validation
    if (!EMAIL_VALIDATION.REGEX.test(email)) {
      return VALIDATION_MESSAGES.EMAIL.INVALID;
    }

    // Check for common fake/test email domains
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && EMAIL_VALIDATION.FAKE_DOMAINS.includes(domain as typeof EMAIL_VALIDATION.FAKE_DOMAINS[number])) {
      return VALIDATION_MESSAGES.EMAIL.FAKE_DOMAIN;
    }

    // Check for common disposable email domains
    if (domain && EMAIL_VALIDATION.DISPOSABLE_DOMAINS.includes(domain as typeof EMAIL_VALIDATION.DISPOSABLE_DOMAINS[number])) {
      return VALIDATION_MESSAGES.EMAIL.DISPOSABLE;
    }

    // Check for suspicious patterns
    if (email.includes('+') && email.split('+')[1]?.includes('@')) {
      // Allow email aliases like user+tag@gmail.com
      return null;
    }

    // Check for very short local parts (likely fake)
    const localPart = email.split('@')[0];
    if (localPart && localPart.length < EMAIL_VALIDATION.MIN_LOCAL_PART_LENGTH) {
      return VALIDATION_MESSAGES.EMAIL.TOO_SHORT;
    }

    return null; // Valid email
  }, []);

  // Password validation
  const validatePassword = useCallback((password: string): string | null => {
    if (password.length < PASSWORD_VALIDATION.MIN_LENGTH) {
      return VALIDATION_MESSAGES.PASSWORD.TOO_SHORT;
    }
    if (!PASSWORD_VALIDATION.REQUIREMENTS.lowercase.test(password)) {
      return VALIDATION_MESSAGES.PASSWORD.NO_LOWERCASE;
    }
    if (!PASSWORD_VALIDATION.REQUIREMENTS.uppercase.test(password)) {
      return VALIDATION_MESSAGES.PASSWORD.NO_UPPERCASE;
    }
    if (!PASSWORD_VALIDATION.REQUIREMENTS.number.test(password)) {
      return VALIDATION_MESSAGES.PASSWORD.NO_NUMBER;
    }
    return null;
  }, []);

  // Display name validation
  const validateDisplayName = useCallback((displayName: string): string | null => {
    if (displayName.length < DISPLAY_NAME_VALIDATION.MIN_LENGTH) {
      return VALIDATION_MESSAGES.DISPLAY_NAME.TOO_SHORT;
    }
    if (displayName.length > DISPLAY_NAME_VALIDATION.MAX_LENGTH) {
      return VALIDATION_MESSAGES.DISPLAY_NAME.TOO_LONG;
    }
    if (!DISPLAY_NAME_VALIDATION.REGEX.test(displayName)) {
      return VALIDATION_MESSAGES.DISPLAY_NAME.INVALID;
    }
    return null;
  }, []);

  // Birthdate validation
  const validateBirthDate = useCallback((birthDate: string): string | null => {
    if (!birthDate) {
      return VALIDATION_MESSAGES.BIRTHDATE.REQUIRED;
    }

    const date = new Date(birthDate);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return VALIDATION_MESSAGES.BIRTHDATE.INVALID;
    }

    // Check if date is in the future
    if (date > today) {
      return VALIDATION_MESSAGES.BIRTHDATE.INVALID;
    }

    // Calculate age
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) 
      ? age - 1 
      : age;

    if (actualAge < BIRTHDATE_VALIDATION.MIN_AGE) {
      return VALIDATION_MESSAGES.BIRTHDATE.TOO_YOUNG;
    }
    
    if (actualAge > BIRTHDATE_VALIDATION.MAX_AGE) {
      return VALIDATION_MESSAGES.BIRTHDATE.TOO_OLD;
    }

    return null;
  }, []);

  // Form validation
  const validateForm = useCallback((formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL.REQUIRED;
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    // Display name validation
    if (!formData.displayName) {
      newErrors.displayName = VALIDATION_MESSAGES.DISPLAY_NAME.REQUIRED;
    } else {
      const displayNameError = validateDisplayName(formData.displayName);
      if (displayNameError) {
        newErrors.displayName = displayNameError;
      }
    }

    // Birthdate validation
    const birthDateError = validateBirthDate(formData.birthDate);
    if (birthDateError) {
      newErrors.birthDate = birthDateError;
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD.REQUIRED;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD.NO_MATCH;
    }

    return newErrors;
  }, [validateEmail, validateDisplayName, validateBirthDate, validatePassword]);

  return { validateEmail, validatePassword, validateDisplayName, validateBirthDate, validateForm };
};
