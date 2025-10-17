import { useCallback } from 'react';
import { PASSWORD_VALIDATION } from '@/constants/validation';
import { VALIDATION_MESSAGES } from '@/constants/messages';
import { 
  validateFirstName, 
  validateDisplayName, 
  validateEmail, 
  validateBirthDate, 
  validateGender,
  Gender
} from '@/types';

export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  displayName: string;
  birthDate: string;
  gender: Gender | null;
}

export interface FormErrors extends Record<string, string | undefined> {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  displayName?: string;
  birthDate?: string;
  gender?: string;
}

export const useFormValidation = () => {
  // Email validation using new validation function
  const validateEmailField = useCallback((email: string): string | null => {
    const result = validateEmail(email);
    return result.isValid ? null : result.errors[0] || 'Invalid email';
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

  // First name validation using new validation function
  const validateFirstNameField = useCallback((firstName: string): string | null => {
    const result = validateFirstName(firstName);
    return result.isValid ? null : result.errors[0] || 'Invalid first name';
  }, []);

  // Display name validation using new validation function
  const validateDisplayNameField = useCallback((displayName: string): string | null => {
    const result = validateDisplayName(displayName);
    return result.isValid ? null : result.errors[0] || 'Invalid display name';
  }, []);

  // Birthdate validation using new validation function
  const validateBirthDateField = useCallback((birthDate: string): string | null => {
    const result = validateBirthDate(birthDate);
    return result.isValid ? null : result.errors[0] || 'Invalid birth date';
  }, []);

  // Gender validation using new validation function
  const validateGenderField = useCallback((gender: Gender | null): string | null => {
    if (!gender) {
      return 'Gender is required';
    }
    const result = validateGender(gender);
    return result.isValid ? null : result.errors[0] || 'Invalid gender';
  }, []);

  // Form validation
  const validateForm = useCallback((formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else {
      const firstNameError = validateFirstNameField(formData.firstName);
      if (firstNameError) {
        newErrors.firstName = firstNameError;
      }
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL.REQUIRED;
    } else {
      const emailError = validateEmailField(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }

    // Display name validation
    if (!formData.displayName) {
      newErrors.displayName = VALIDATION_MESSAGES.DISPLAY_NAME.REQUIRED;
    } else {
      const displayNameError = validateDisplayNameField(formData.displayName);
      if (displayNameError) {
        newErrors.displayName = displayNameError;
      }
    }

    // Birthdate validation
    const birthDateError = validateBirthDateField(formData.birthDate);
    if (birthDateError) {
      newErrors.birthDate = birthDateError;
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    } else {
      const genderError = validateGenderField(formData.gender);
      if (genderError) {
        newErrors.gender = genderError;
      }
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
  }, [validateFirstNameField, validateEmailField, validateDisplayNameField, validateBirthDateField, validateGenderField, validatePassword]);

  return { 
    validateEmail: validateEmailField, 
    validatePassword, 
    validateDisplayName: validateDisplayNameField, 
    validateBirthDate: validateBirthDateField,
    validateFirstName: validateFirstNameField,
    validateGender: validateGenderField,
    validateForm 
  };
};
