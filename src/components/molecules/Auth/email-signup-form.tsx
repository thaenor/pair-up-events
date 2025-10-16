import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, User, Calendar } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import useAuth from '@/hooks/useAuth'

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
  const { signup } = useAuth()
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

    // TODO: Save profile data (firstName, lastName, birthDate, gender) to Firestore users/{userId}
    // collection after successful authentication. Create userProfile service in src/lib/firebase/
    const result = await signup(formData.email, formData.password)

    if (result.success) {
      toast.success('Account created successfully!')
      navigate('/profile')
    } else {
      toast.error(result.error || 'Signup failed')
    }

    setLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6" data-testid="signup-form">
      {/* Info Note */}
      <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-md p-3 mb-4">
        <p className="text-sm text-pairup-cream">
          Join PairUp Events! Create your account to start connecting with other pairs and organizing amazing
          activities.
        </p>
      </div>

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
