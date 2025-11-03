import React, { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, User, Calendar } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import AuthErrorDisplay from './AuthErrorDisplay'
import AuthRetryButton from './AuthRetryButton'
import useAuth from '@/hooks/useAuth'
import { createPrivateUserData, createPublicUserData } from '@/entities/user/user-service'
import { calculateAgeFromBirthDate } from '@/entities/user/user-data-helpers'
import { useUserProfile } from '@/contexts/UserContext'

// Extracted form field component
const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  icon: Icon,
  placeholder,
  required = false,
  disabled = false,
  testId,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  icon?: React.ComponentType<{ className?: string }>
  placeholder?: string
  required?: boolean
  disabled?: boolean
  testId?: string
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-white">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors ${
          error ? 'border-red-500' : 'border-gray-500'
        }`}
        placeholder={placeholder}
        disabled={disabled}
        data-testid={testId}
      />
    </div>
    {error && (
      <p className="text-red-400 text-sm" role="alert">
        {error}
      </p>
    )}
  </div>
)

const EmailSignupForm: React.FC = React.memo(() => {
  const { signup, authError, clearError, user } = useAuth()
  const { refreshProfile } = useUserProfile()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [pendingProfileCreation, setPendingProfileCreation] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Validate required fields
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.birthDate ||
      !formData.gender
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setSignupError(null)

    const result = await signup(formData.email, formData.password)

    if (result.success) {
      // Set flag to create profile once user is available
      setPendingProfileCreation(true)
      toast.success('Account created successfully!')
      setRetryCount(0)
      // Don't navigate yet - wait for profile creation
    } else {
      setSignupError(result.error || 'Signup failed')
      if (result.retryable) {
        setRetryCount(prev => prev + 1)
      }
      // Error is displayed via AuthErrorDisplay component - no toast needed
      setLoading(false)
    }
  }

  const handleRetry = async () => {
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // Validate required fields
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.birthDate ||
      !formData.gender
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setSignupError(null)

    const result = await signup(formData.email, formData.password)

    if (result.success) {
      // Set flag to create profile once user is available
      setPendingProfileCreation(true)
      toast.success('Account created successfully!')
      setRetryCount(0)
      // Don't navigate yet - wait for profile creation
    } else {
      setSignupError(result.error || 'Signup failed')
      if (result.retryable) {
        setRetryCount(prev => prev + 1)
      }
      setLoading(false)
    }
  }

  const handleClearError = () => {
    setSignupError(null)
    setRetryCount(0)
    clearError()
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev)
  }

  // Create profile after successful signup when user becomes available
  useEffect(() => {
    if (!pendingProfileCreation || !user?.uid) {
      return
    }

    const createProfile = async () => {
      try {
        const birthDate = new Date(formData.birthDate)

        // Validate birthDate
        if (isNaN(birthDate.getTime())) {
          throw new Error('Invalid birth date')
        }

        const age = calculateAgeFromBirthDate(birthDate)
        const now = new Date()

        // Prepare private data
        const privateData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName || undefined,
          birthDate,
          gender: formData.gender as 'male' | 'female' | 'non-binary' | 'prefer-not-to-say',
          createdAt: now,
        }

        // Prepare public data
        const publicData = {
          firstName: formData.firstName,
          lastName: formData.lastName || undefined,
          gender: formData.gender as 'male' | 'female' | 'non-binary' | 'prefer-not-to-say',
          age,
        }

        // Create both collections in parallel
        const [privateResult, publicResult] = await Promise.all([
          createPrivateUserData(user.uid, privateData, user.uid),
          createPublicUserData(user.uid, publicData, user.uid),
        ])

        // Check for failures
        if (!privateResult.success) {
          const error = privateResult as Extract<typeof privateResult, { success: false }>
          throw new Error(`Failed to create private data: ${error.error}`)
        }
        if (!publicResult.success) {
          const error = publicResult as Extract<typeof publicResult, { success: false }>
          throw new Error(`Failed to create public data: ${error.error}`)
        }

        // Refresh profile in context
        await refreshProfile()

        setPendingProfileCreation(false)
        setLoading(false)
        navigate('/profile')
      } catch (error) {
        console.error('Failed to create user profile:', error)
        toast.error('Account created but failed to save profile. Please complete your profile manually.')
        setPendingProfileCreation(false)
        setLoading(false)
        // Still navigate to profile page so user can complete it manually
        navigate('/profile')
      }
    }

    createProfile()
  }, [
    pendingProfileCreation,
    user?.uid,
    formData.email,
    formData.firstName,
    formData.lastName,
    formData.birthDate,
    formData.gender,
    refreshProfile,
    navigate,
  ])

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6" data-testid="signup-form">
      {/* Info Note */}
      <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-md p-3 mb-4">
        <p className="text-sm text-pairup-cream">
          Join PairUp Events! Create your account to start connecting with other pairs and organizing amazing
          activities.
        </p>
      </div>

      {/* Auth Error Display */}
      {authError && (
        <AuthErrorDisplay
          error={authError}
          onRetry={handleRetry}
          onClear={handleClearError}
          showRetry={authError.retryable}
        />
      )}

      {/* Signup Error Display */}
      {signupError && !authError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-red-500">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Signup Failed</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{signupError}</p>
              </div>
              <div className="mt-3">
                <AuthRetryButton
                  onRetry={handleRetry}
                  error={signupError}
                  retryCount={retryCount}
                  maxRetries={3}
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={value => handleInputChange('firstName', value)}
          icon={User}
          placeholder="John"
          required
          testId="signup-first-name"
        />
        <FormField
          id="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={value => handleInputChange('lastName', value)}
          icon={User}
          placeholder="Doe"
          required
          testId="signup-last-name"
        />
      </div>

      {/* Email Field */}
      <FormField
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={value => handleInputChange('email', value)}
        icon={Mail}
        placeholder="john@example.com"
        required
        testId="signup-email"
      />

      {/* Password Fields */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          Password <span className="text-red-400">*</span>
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
            placeholder="Create a password"
            disabled={loading}
            data-testid="signup-password"
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

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
          Confirm Password <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={e => handleInputChange('confirmPassword', e.target.value)}
            className="block w-full pl-10 pr-12 py-3 border rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors border-gray-500"
            placeholder="Confirm your password"
            disabled={loading}
            data-testid="signup-confirm-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={toggleConfirmPasswordVisibility}
            disabled={loading}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Birth Date */}
      <FormField
        id="birthDate"
        label="Birth Date"
        type="date"
        value={formData.birthDate}
        onChange={value => handleInputChange('birthDate', value)}
        icon={Calendar}
        required
        testId="signup-birth-date"
      />

      {/* Gender */}
      <div className="space-y-2">
        <label htmlFor="gender" className="block text-sm font-medium text-white">
          Gender <span className="text-red-400">*</span>
        </label>
        <select
          id="gender"
          value={formData.gender}
          onChange={e => handleInputChange('gender', e.target.value)}
          className="block w-full pl-3 pr-3 py-3 border rounded-md bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:border-transparent transition-colors border-gray-500"
          disabled={loading}
          data-testid="signup-gender"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-pairup-darkBlue bg-pairup-cyan hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        data-testid="signup-submit-button"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-pairup-cyan hover:underline font-medium" data-testid="signup-login-link">
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  )
})

EmailSignupForm.displayName = 'EmailSignupForm'

export default EmailSignupForm
