import React, { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useFormState } from '@/hooks/useFormState';

type LoginFormData = {
  email: string;
  password: string;
};

const EmailLoginForm: React.FC = React.memo(() => {
  const { signInWithEmail, sendPasswordReset, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Simple validation for login form
  const validateLoginForm = (data: LoginFormData) => {
    const errors: Partial<LoginFormData> = {};

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const { formData, errors, updateField, setAllErrors, clearFieldError } = useFormState<LoginFormData & Record<string, unknown>>({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes with useCallback
  const handleInputChange = useCallback((field: keyof LoginFormData, value: string) => {
    updateField(field, value);

    // Real-time validation for immediate feedback
    const updatedFormData = { ...formData, [field]: value };
    const fieldErrors = validateLoginForm(updatedFormData);

    if (fieldErrors[field]) {
      setAllErrors(prev => ({ ...prev, [field]: fieldErrors[field] }));
    } else {
      clearFieldError(field);
    }

    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  }, [updateField, formData, setAllErrors, clearFieldError, error, clearError]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateLoginForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setAllErrors(formErrors as Partial<Record<keyof (LoginFormData & Record<string, unknown>), string>>);
      return;
    }

    try {
      await signInWithEmail(formData.email, formData.password);
      toast.success('Welcome back! You have been signed in successfully.');
      // Redirect to profile page after successful login
      navigate('/profile');
    } catch {
      // Error is already handled by AuthProvider and displayed in the UI
    }
  }, [formData, setAllErrors, signInWithEmail, navigate]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Handle password reset
  const handlePasswordReset = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await sendPasswordReset(formData.email);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch {
      // Error is already handled by AuthProvider and displayed in the UI
    }
  }, [formData.email, sendPasswordReset]);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-6"
      data-testid="login-form"
    >
      {/* Info Note */}
      <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-md p-3 mb-4">
        <p className="text-sm text-pairup-cream">
          Welcome back! Sign in to access your account and continue connecting with other pairs! 🎉
        </p>
      </div>

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
            aria-describedby={errors.email ? 'email-error email-help' : 'email-help'}
            placeholder="Enter your email"
            disabled={loading}
            data-testid="login-email-input"
          />
        </div>
        <div id="email-help" className="sr-only">
          Enter your email address to sign in
        </div>
        {errors.email && (
          <p
            id="email-error"
            className="text-red-400 text-sm"
            role="alert"
            data-testid="login-email-error"
          >
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
            aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
            placeholder="Enter your password"
            disabled={loading}
            data-testid="login-password-input"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={togglePasswordVisibility}
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            data-testid="login-password-toggle"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            )}
          </button>
        </div>
        <div id="password-help" className="sr-only">
          Enter your password to sign in
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="text-red-400 text-sm"
            role="alert"
            data-testid="login-password-error"
          >
            {errors.password}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-pairup-darkBlue bg-pairup-cyan hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        data-testid="login-submit-button"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Signing In...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-pairup-cyan hover:underline font-medium"
            data-testid="login-signup-link"
          >
            Create one here
          </Link>
        </p>
      </div>

      {/* Password Reset Link */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          Forgot your password?{' '}
          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-pairup-cyan hover:underline font-medium bg-transparent border-none p-0 cursor-pointer"
            disabled={loading}
            data-testid="password-reset-button"
          >
            Reset it here
          </button>
        </p>
      </div>
    </form>
  );
});

EmailLoginForm.displayName = 'EmailLoginForm';

export default EmailLoginForm;
