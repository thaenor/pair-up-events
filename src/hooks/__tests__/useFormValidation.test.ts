import { renderHook } from '@testing-library/react';
import { useFormValidation } from '../useFormValidation';
import { GENDER } from '@/types';

describe('useFormValidation', () => {
  let hook: ReturnType<typeof useFormValidation>;

  beforeEach(() => {
    const { result } = renderHook(() => useFormValidation());
    hook = result.current;
  });

  describe('validateEmail', () => {
    it('should return null for valid email addresses', () => {
      const validEmails = [
        'user@gmail.com',
        'test.email@domain.org',
        'user+tag@gmail.com',
        'user123@company.co.uk'
      ];

      validEmails.forEach(email => {
        expect(hook.validateEmail(email)).toBeNull();
      });
    });


    it('should reject fake email domains', () => {
      const fakeEmails = [
        'test@example.com',
        'user@test.com',
        'email@fake.com',
        'sample@demo.com'
      ];

      fakeEmails.forEach(email => {
        expect(hook.validateEmail(email)).toBe('Please use a real email address, not a test email');
      });
    });

    it('should reject disposable email domains', () => {
      const disposableEmails = [
        'user@10minutemail.com',
        'test@tempmail.org',
        'email@guerrillamail.com'
      ];

      disposableEmails.forEach(email => {
        expect(hook.validateEmail(email)).toBe('Please use a permanent email address, not a temporary one');
      });
    });

    it('should reject emails with very short local parts', () => {
      const shortEmails = [
        'a@domain.com',
        '1@domain.com'
      ];

      shortEmails.forEach(email => {
        expect(hook.validateEmail(email)).toBe('Email address seems too short to be valid');
      });
    });

    it('should allow email aliases with plus signs', () => {
      const aliasEmails = [
        'user+tag@gmail.com',
        'test+newsletter@domain.com'
      ];

      aliasEmails.forEach(email => {
        expect(hook.validateEmail(email)).toBeNull();
      });
    });
  });

  describe('validatePassword', () => {
    it('should return null for valid passwords', () => {
      const validPasswords = [
        'Password123',
        'MySecure1',
        'TestPass9',
        'ValidPwd1'
      ];

      validPasswords.forEach(password => {
        expect(hook.validatePassword(password)).toBeNull();
      });
    });

    it('should reject passwords that are too short', () => {
      const shortPasswords = [
        'Pass1',
        'Ab1',
        '12345'
      ];

      shortPasswords.forEach(password => {
        expect(hook.validatePassword(password)).toBe('Password must be at least 6 characters long');
      });
    });

    it('should reject passwords without lowercase letters', () => {
      const noLowercasePasswords = [
        'PASSWORD123',
        'TEST123',
        'UPPERCASE1'
      ];

      noLowercasePasswords.forEach(password => {
        expect(hook.validatePassword(password)).toBe('Password must contain at least one lowercase letter');
      });
    });

    it('should reject passwords without uppercase letters', () => {
      const noUppercasePasswords = [
        'password123',
        'test123',
        'lowercase1'
      ];

      noUppercasePasswords.forEach(password => {
        expect(hook.validatePassword(password)).toBe('Password must contain at least one uppercase letter');
      });
    });

    it('should reject passwords without numbers', () => {
      const noNumberPasswords = [
        'Password',
        'TestPass',
        'MyPassword'
      ];

      noNumberPasswords.forEach(password => {
        expect(hook.validatePassword(password)).toBe('Password must contain at least one number');
      });
    });
  });

  describe('validateForm', () => {
    it('should return empty errors for valid form data', () => {
      const validFormData = {
        email: 'user@gmail.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        firstName: 'John',
        displayName: 'John Doe',
        birthDate: '1990-01-01',
        gender: GENDER.MALE
      };

      const errors = hook.validateForm(validFormData);
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should return email required error for empty email', () => {
      const formData = {
        email: '',
        password: 'Password123',
        confirmPassword: 'Password123'
      };

      const errors = hook.validateForm(formData);
      expect(errors.email).toBe('Email is required');
    });

    it('should return password mismatch error', () => {
      const formData = {
        email: 'user@gmail.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123'
      };

      const errors = hook.validateForm(formData);
      expect(errors.confirmPassword).toBe('Passwords do not match');
    });

    it('should return confirm password required error', () => {
      const formData = {
        email: 'user@gmail.com',
        password: 'Password123',
        confirmPassword: ''
      };

      const errors = hook.validateForm(formData);
      expect(errors.confirmPassword).toBe('Please confirm your password');
    });

    it('should return multiple errors for invalid form', () => {
      const formData = {
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'different'
      };

      const errors = hook.validateForm(formData);
      expect(errors.email).toBe('Please enter a valid email address');
      expect(errors.password).toBe('Password must be at least 6 characters long');
      expect(errors.confirmPassword).toBe('Passwords do not match');
    });
  });
});
