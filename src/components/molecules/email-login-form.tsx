import React, { useState, useCallback } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button, FormField, Icon, Input } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useFormState } from '@/hooks/useFormState';
import { trackFormEvent } from '@/lib/analytics';

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

    // Track form submission start
    trackFormEvent('email_login', 'start');

    const formErrors = validateLoginForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setAllErrors(formErrors as Partial<Record<keyof (LoginFormData & Record<string, unknown>), string>>);
      // Track form validation error
      trackFormEvent('email_login', 'error');
      return;
    }

    try {
      await signInWithEmail(formData.email, formData.password);
      toast.success('Welcome back! You have been signed in successfully.');
      
      // Track successful form submission
      trackFormEvent('email_login', 'submit');
      
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
      <FormField
        label="Email Address"
        id="email"
        error={errors.email}
        helpText="Enter your email address to sign in"
        required
        errorTestId="login-email-error"
        theme="dark"
      >
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
          data-testid="login-email-input"
          theme="dark"
          icon={
            <Icon size="md" theme="dark">
              <Mail className="h-5 w-5" />
            </Icon>
          }
          iconPosition="left"
        />
      </FormField>

      {/* Password Field */}
      <FormField
        label="Password"
        id="password"
        error={errors.password}
        helpText="Enter your password to sign in"
        required
        errorTestId="login-password-error"
        theme="dark"
      >
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
            data-testid="login-password-input"
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
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={togglePasswordVisibility}
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            data-testid="login-password-toggle"
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

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        loadingText="Signing In..."
        fullWidth
        data-testid="login-submit-button"
      >
        Sign In
      </Button>

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
