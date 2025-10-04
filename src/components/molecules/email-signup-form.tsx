import React, { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { useFormState } from '@/hooks/useFormState';
import { useFormValidation, FormData } from '@/hooks/useFormValidation';

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
    } catch (error) {
      console.error('Sign up failed:', error);
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
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
      {/* Success Message */}
      {registrationSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
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
                  >
                    Share Your Feedback
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-md p-3 mb-4">
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
                <Mail className="h-5 w-5 text-gray-400" />
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
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder="Enter your email"
                disabled={loading}
              />
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
                <Lock className="h-5 w-5 text-gray-400" />
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
                aria-describedby={errors.password ? 'password-error' : undefined}
                placeholder="Create a password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                )}
              </button>
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
                <Lock className="h-5 w-5 text-gray-400" />
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
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
                disabled={loading}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                )}
              </button>
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
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Creating Account...
              </>
            ) : (
              'Create Account & Continue'
            )}
          </button>

          {/* Terms and Privacy */}
          <p className="text-xs text-gray-400 text-center">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-pairup-cyan hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-pairup-cyan hover:underline">
              Privacy Policy
            </a>
          </p>
        </>
      )}
    </form>
  );
});

EmailSignupForm.displayName = 'EmailSignupForm';

export default EmailSignupForm;
