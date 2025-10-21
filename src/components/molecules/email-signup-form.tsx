import React, { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button, FormField, Icon, Input, Select } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useFormState } from '@/hooks/useFormState';
import { useFormValidation, FormData } from '@/hooks/useFormValidation';
import { GENDER } from '@/types';
import { trackFormEvent } from '@/lib/analytics';

const EmailSignupForm: React.FC = React.memo(() => {
  const { signUpWithEmail, loading, error, clearError } = useAuth();
  const { validateForm } = useFormValidation();
  const navigate = useNavigate();

  const { formData, errors, updateField, setAllErrors, clearFieldError } = useFormState<FormData & Record<string, unknown>>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    displayName: '',
    birthDate: '',
    gender: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Handle input changes with useCallback
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    // Handle gender field specially to convert empty string to null
    if (field === 'gender') {
      updateField(field, value === '' ? null : value);
    } else {
      updateField(field, value);
    }

    // Real-time validation for immediate feedback
    const updatedFormData = { ...formData, [field]: value };
    const fieldErrors = validateForm(updatedFormData);

    if (fieldErrors[field]) {
      setAllErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
    } else {
      clearFieldError(field);
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  }, [updateField, formData, validateForm, setAllErrors, clearFieldError, error, clearError]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Track form submission start
    trackFormEvent('email_signup', 'start');

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setAllErrors(formErrors as Partial<Record<keyof (FormData & Record<string, unknown>), string>>);
      // Track form validation error
      trackFormEvent('email_signup', 'error');
      return;
    }

    try {
      await signUpWithEmail(formData.email, formData.password, formData.firstName, formData.displayName, formData.birthDate, formData.gender);
      setRegistrationSuccess(true);
      toast.success('Account created successfully! Please check your email to verify your account.');
      
      // Track successful form submission
      trackFormEvent('email_signup', 'submit');
      
      // Redirect to profile page after successful registration
      navigate('/profile');
    } catch {
      // Error is already handled by AuthProvider and displayed in the UI
    }
  }, [formData, validateForm, setAllErrors, signUpWithEmail, navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-6"
      aria-label="Create your PairUp Events account"
      noValidate
      data-testid="signup-form"
    >
      {/* Success Message */}
      {registrationSuccess && (
        <div
          className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mb-4"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          data-testid="signup-success"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-400">
                Account Created Successfully!
              </h3>
              <div className="mt-2 text-sm text-green-300">
                <p>
                  We've sent a verification email to <strong>{formData.email}</strong>.
                  Please check your inbox and click the verification link to activate your account.
                </p>
                <div className="mt-3 p-3 bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-md">
                  <p className="text-pairup-cream font-medium mb-2">
                    🚧 Help Us Build Something Amazing!
                  </p>
                  <p className="text-pairup-cream/90 text-xs mb-3">
                    While this app is under development, we would <strong>REALLY appreciate your feedback</strong> to help us create the best experience for connecting pairs!
                  </p>
                  <a
                    href="https://forms.gle/F6xptEXPLA8wEpTp7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-pairup-cyan text-pairup-darkBlue text-sm font-medium rounded-md hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan transition-colors"
                    aria-label="Share your feedback (opens in new tab)"
                  >
                    Share Your Feedback
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      {!registrationSuccess && (
        <div
          className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-md p-3 mb-4"
          role="region"
          aria-label="Account creation information"
        >
          <p className="text-sm text-pairup-cream">
            After creating your account, you'll be redirected to our early testing form where you can create your duo listing and start connecting with other pairs! 🎉
          </p>
        </div>
      )}

      {/* Form Fields - Only show when not successful */}
      {!registrationSuccess && (
        <>
          {/* Email Field */}
          <FormField
            label="Email Address"
            id="email"
            error={errors.email}
            helpText="Enter a valid email address for your account"
            required
            errorTestId="signup-email-error"
            theme="dark"
          >
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="email"
              data-testid="signup-email-input"
              theme="dark"
              icon={
                <Icon size="md" theme="dark">
                  <Mail className="h-5 w-5" />
                </Icon>
              }
              iconPosition="left"
            />
          </FormField>

          {/* First Name Field */}
          <FormField
            label="First Name"
            id="firstName"
            error={errors.firstName}
            helpText="Enter your first name (2-50 characters)"
            required
            errorTestId="signup-first-name-error"
            theme="dark"
          >
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              disabled={loading}
              autoComplete="given-name"
              data-testid="signup-first-name-input"
              theme="dark"
              icon={
                <Icon size="md" theme="dark">
                  <User className="h-5 w-5" />
                </Icon>
              }
              iconPosition="left"
            />
          </FormField>

          {/* Display Name Field */}
          <FormField
            label="Display Name"
            id="displayName"
            error={errors.displayName}
            helpText="Enter your preferred display name (2-50 characters)"
            required
            errorTestId="signup-display-name-error"
            theme="dark"
          >
            <Input
              id="displayName"
              type="text"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              placeholder="Enter your display name"
              disabled={loading}
              autoComplete="name"
              data-testid="signup-display-name-input"
              theme="dark"
              icon={
                <Icon size="md" theme="dark">
                  <User className="h-5 w-5" />
                </Icon>
              }
              iconPosition="left"
            />
          </FormField>

          {/* Birthdate Field */}
          <FormField
            label="Birthdate"
            id="birthDate"
            error={errors.birthDate}
            helpText="Enter your birthdate (must be at least 13 years old)"
            required
            errorTestId="signup-birthdate-error"
            theme="dark"
          >
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              disabled={loading}
              data-testid="signup-birthdate-input"
              theme="dark"
              icon={
                <Icon size="md" theme="dark">
                  <Calendar className="h-5 w-5" />
                </Icon>
              }
              iconPosition="left"
            />
          </FormField>

          {/* Gender Field */}
          <FormField
            label="Gender"
            id="gender"
            error={errors.gender}
            helpText="Select your gender identity"
            required
            errorTestId="signup-gender-error"
            theme="dark"
          >
            <Select
              id="gender"
              value={formData.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              disabled={loading}
              data-testid="signup-gender-input"
              theme="dark"
            >
              <option value="" className="bg-gray-800 text-white">Select your gender</option>
              <option value={GENDER.MALE} className="bg-gray-800 text-white">Male</option>
              <option value={GENDER.FEMALE} className="bg-gray-800 text-white">Female</option>
              <option value={GENDER.NON_BINARY} className="bg-gray-800 text-white">Non-binary</option>
              <option value={GENDER.PREFER_NOT_TO_SAY} className="bg-gray-800 text-white">Prefer not to say</option>
            </Select>
          </FormField>

          {/* Password Field */}
          <FormField
            label="Password"
            id="password"
            error={errors.password}
            helpText="Password must be at least 8 characters with uppercase, lowercase, and numbers"
            required
            errorTestId="signup-password-error"
            theme="dark"
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Create a password"
                disabled={loading}
                autoComplete="new-password"
                data-testid="signup-password-input"
                theme="dark"
                icon={
                  <Icon size="md" theme="dark">
                    <Lock className="h-5 w-5" />
                  </Icon>
                }
                iconPosition="left"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-transparent rounded-md"
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                data-testid="signup-password-toggle"
              >
                <Icon size="md" theme="dark">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 hover:text-white transition-colors" />
                  )}
                </Icon>
              </button>
            </div>
          </FormField>

          {/* Confirm Password Field */}
          <FormField
            label="Confirm Password"
            id="confirmPassword"
            error={errors.confirmPassword}
            helpText="Re-enter your password to confirm it matches"
            required
            errorTestId="signup-confirm-password-error"
            theme="dark"
          >
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                disabled={loading}
                autoComplete="new-password"
                data-testid="signup-confirm-password-input"
                theme="dark"
                icon={
                  <Icon size="md" theme="dark">
                    <Lock className="h-5 w-5" />
                  </Icon>
                }
                iconPosition="left"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-transparent rounded-md"
                onClick={toggleConfirmPasswordVisibility}
                disabled={loading}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                aria-pressed={showConfirmPassword}
                data-testid="signup-confirm-password-toggle"
              >
                <Icon size="md" theme="dark">
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 hover:text-white transition-colors" />
                  )}
                </Icon>
              </button>
            </div>
          </FormField>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            loadingText="Creating Account..."
            fullWidth
            data-testid="signup-submit-button"
            aria-describedby="submit-help"
          >
            Create Account & Continue
          </Button>
          <div id="submit-help" className="sr-only">
            Click to create your account and start connecting with other pairs
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-pairup-cyan hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

        </>
      )}
    </form>
  );
});

EmailSignupForm.displayName = 'EmailSignupForm';

export default EmailSignupForm;
