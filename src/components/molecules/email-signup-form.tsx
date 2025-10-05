import React, { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useFormState } from '@/hooks/useFormState';
import { useFormValidation, FormData } from '@/hooks/useFormValidation';
import { logError } from '@/utils/logger';

const EmailSignupForm: React.FC = React.memo(() => {
  const { signUpWithEmail, loading, error, clearError } = useAuth();
  const { validateForm } = useFormValidation();

  const { formData, errors, updateField, setAllErrors, clearFieldError } = useFormState<FormData & Record<string, unknown>>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Handle input changes with useCallback
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    updateField(field, value);

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

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setAllErrors(formErrors as Partial<Record<keyof (FormData & Record<string, unknown>), string>>);
      return;
    }

    try {
      await signUpWithEmail(formData.email, formData.password);
      setRegistrationSuccess(true);
      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (error) {
      logError('Sign up failed', error, {
        component: 'EmailSignupForm',
        action: 'signUpWithEmail',
        additionalData: { email: formData.email }
      });
      // Error is already handled by AuthProvider and displayed in the UI
    }
  }, [formData, validateForm, setAllErrors, signUpWithEmail]);

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
    >
      {/* Success Message */}
      {registrationSuccess && (
        <div
          className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mb-4"
          role="alert"
          aria-live="polite"
          aria-atomic="true"
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
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-500'
                }`}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : 'email-help'}
                aria-required="true"
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="email"
              />
            </div>
            <div id="email-help" className="sr-only">
              Enter a valid email address for your account
            </div>
            {errors.email && (
              <p id="email-error" className="text-red-400 text-sm" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`block w-full pl-10 pr-12 py-3 border rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-500'
                }`}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : 'password-help'}
                aria-required="true"
                placeholder="Create a password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-transparent rounded-md"
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" aria-hidden="true" />
                )}
              </button>
            </div>
            <div id="password-help" className="sr-only">
              Password must be at least 8 characters with uppercase, lowercase, and numbers
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-400 text-sm" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`block w-full pl-10 pr-12 py-3 border rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-500'
                }`}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : 'confirm-password-help'}
                aria-required="true"
                placeholder="Confirm your password"
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-transparent rounded-md"
                onClick={toggleConfirmPasswordVisibility}
                disabled={loading}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" aria-hidden="true" />
                )}
              </button>
            </div>
            <div id="confirm-password-help" className="sr-only">
              Re-enter your password to confirm it matches
            </div>
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-red-400 text-sm" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-pairup-darkBlue bg-pairup-cyan hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-describedby="submit-help"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
                <span aria-live="polite">Creating Account...</span>
              </>
            ) : (
              'Create Account & Continue'
            )}
          </button>
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

          {/* Terms and Privacy */}
          <p className="text-xs text-gray-400 text-center">
            By creating an account, you agree to our{' '}
            <Link to="/terms-of-service" className="text-pairup-cyan hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="text-pairup-cyan hover:underline">
              Privacy Policy
            </Link>
          </p>
        </>
      )}
    </form>
  );
});

EmailSignupForm.displayName = 'EmailSignupForm';

export default EmailSignupForm;
