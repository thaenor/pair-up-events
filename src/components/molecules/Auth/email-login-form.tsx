import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import AuthErrorDisplay from './AuthErrorDisplay'
import useAuth from '@/hooks/useAuth'

type LoginFormData = {
  email: string
  password: string
}

const EmailLoginForm: React.FC = React.memo(() => {
  const { login, authError, clearError } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  // Removed loginError state - using authError from useAuth instead

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    // Clear any existing auth error
    clearError()

    const result = await login(formData.email, formData.password)

    if (result.success) {
      toast.success('Logged in successfully!')
      // Wait a moment for auth state to update before navigating
      setTimeout(() => {
        navigate('/profile')
      }, 100)
    } else {
      // Error is now handled by authError state in useAuth hook
      // Error is displayed via AuthErrorDisplay component - no toast needed
    }

    setLoading(false)
  }

  const handleRetry = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    // Clear any existing auth error
    clearError()

    const result = await login(formData.email, formData.password)

    if (result.success) {
      toast.success('Logged in successfully!')
      setTimeout(() => {
        navigate('/profile')
      }, 100)
    } else {
      // Error is now handled by authError state in useAuth hook
    }

    setLoading(false)
  }

  const handleClearError = () => {
    clearError()
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const handlePasswordReset = (e: React.MouseEvent) => {
    e.preventDefault()
    // Password reset removed
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6" data-testid="login-form">
      {/* Info Note */}
      <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-md p-3 mb-4">
        <p className="text-sm text-pairup-cream">
          Welcome back! Sign in to access your account and continue connecting with other pairs!
        </p>
      </div>

      {/* Auth Error Display - now handles all authentication errors */}
      {authError && (
        <AuthErrorDisplay
          error={authError}
          onRetry={handleRetry}
          onClear={handleClearError}
          showRetry={authError.retryable}
        />
      )}

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
            onChange={e => handleInputChange('email', e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors border-gray-500"
            placeholder="Enter your email"
            disabled={loading}
            data-testid="login-email-input"
          />
        </div>
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
            onChange={e => handleInputChange('password', e.target.value)}
            className="block w-full pl-10 pr-12 py-3 border rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors border-gray-500"
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
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            )}
          </button>
        </div>
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
          <Link to="/signup" className="text-pairup-cyan hover:underline font-medium" data-testid="login-signup-link">
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
  )
})

EmailLoginForm.displayName = 'EmailLoginForm'

export default EmailLoginForm
