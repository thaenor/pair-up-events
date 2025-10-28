import { useState, useEffect, useCallback, useRef } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

/**
 * Result object returned by authentication operations
 *
 * @typedef {Object} AuthResult
 * @property {boolean} success - Whether the operation succeeded
 * @property {string} [error] - Error message if operation failed
 * @property {boolean} [retryable] - Whether the operation can be retried
 */
type AuthResult = {
  success: boolean
  error?: string
  retryable?: boolean
  originalError?: unknown
}

/**
 * Authentication error types for better error handling
 */
type AuthErrorType = 'network' | 'auth' | 'config' | 'unknown'

/**
 * Enhanced authentication error with additional context
 */
interface AuthError extends Error {
  type: AuthErrorType
  retryable: boolean
  originalError?: unknown
}

/**
 * Custom hook for Firebase authentication operations
 *
 * Provides methods for user authentication including login, signup, logout,
 * and password reset. Manages authentication state and loading status.
 * Automatically syncs with Firebase Auth state changes with enhanced error recovery.
 *
 * @returns {Object} Authentication state and methods
 * @returns {User | null} returns.user - Currently authenticated user or null
 * @returns {boolean} returns.loading - Whether authentication state is loading
 * @returns {AuthError | null} returns.authError - Current authentication error if any
 * @returns {Function} returns.login - Async login function (email, password)
 * @returns {Function} returns.signup - Async signup function (email, password)
 * @returns {Function} returns.logout - Async logout function
 * @returns {Function} returns.resetPassword - Async password reset function (email)
 * @returns {Function} returns.clearError - Clear current authentication error
 * @returns {Function} returns.retryAuthState - Retry authentication state recovery
 *
 * @example
 * ```tsx
 * const { user, loading, authError, login, clearError } = useAuth();
 *
 * const handleLogin = async () => {
 *   const result = await login('user@example.com', 'password123');
 *   if (result.success) {
 *     // Handle success
 *   } else {
 *     console.error(result.error);
 *     if (result.retryable) {
 *       // Show retry option to user
 *     }
 *   }
 * };
 * ```
 */
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<AuthError | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const retryCountRef = useRef(0)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initializeAuthStateRef = useRef<(() => void) | null>(null)
  const maxRetries = 3

  /**
   * Enhanced error handler for authentication state changes
   */
  const handleAuthError = useCallback((error: unknown, context: string) => {
    const authError = createAuthError(error)
    setAuthError(authError)
    console.error(`Auth error in ${context}:`, error)
  }, [])

  /**
   * Retry authentication state recovery
   */
  const retryAuthState = useCallback(() => {
    if (retryCountRef.current >= maxRetries) {
      const error = new Error('Maximum retry attempts reached') as AuthError
      error.type = 'unknown'
      error.retryable = false
      setAuthError(error)
      return
    }

    retryCountRef.current += 1
    setAuthError(null)
    setLoading(true)

    // Clean up existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    // Retry with exponential backoff
    const delay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 10000)
    retryTimeoutRef.current = setTimeout(() => {
      if (initializeAuthStateRef.current) {
        initializeAuthStateRef.current()
      }
    }, delay)
  }, [maxRetries])

  /**
   * Initialize authentication state with error recovery
   */
  const initializeAuthState = useCallback(() => {
    if (!auth) {
      const error = new Error('Authentication not configured') as AuthError
      error.type = 'config'
      error.retryable = false
      setAuthError(error)
      setLoading(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        currentUser => {
          try {
            setUser(currentUser)
            setLoading(false)
            setAuthError(null)
            retryCountRef.current = 0 // Reset retry count on success
          } catch (error) {
            handleAuthError(error, 'auth state update')
            setLoading(false)
          }
        },
        error => {
          handleAuthError(error, 'auth state listener')
          setLoading(false)
        }
      )

      unsubscribeRef.current = unsubscribe
    } catch (error) {
      handleAuthError(error, 'auth state initialization')
      setLoading(false)
    }
  }, [handleAuthError])

  // Store the function in ref to avoid circular dependency
  initializeAuthStateRef.current = initializeAuthState

  /**
   * Clear current authentication error
   */
  const clearError = useCallback(() => {
    setAuthError(null)
  }, [])

  useEffect(() => {
    initializeAuthState()

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [initializeAuthState])

  /**
   * Execute authentication operation with retry logic
   */
  const executeWithRetry = useCallback(
    async <T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<AuthResult> => {
      let lastError: unknown

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await operation()
          return { success: true }
        } catch (error) {
          lastError = error
          const authError = createAuthError(error)

          // Don't retry non-retryable errors
          if (!authError.retryable) {
            return {
              success: false,
              error: authError.message,
              retryable: false,
              originalError: error,
            }
          }

          // If this is the last attempt, return the error
          if (attempt === maxRetries) {
            return {
              success: false,
              error: authError.message,
              retryable: true,
              originalError: error,
            }
          }

          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }

      // This should never be reached, but just in case
      const finalError = createAuthError(lastError)
      return {
        success: false,
        error: finalError.message,
        retryable: finalError.retryable,
        originalError: lastError,
      }
    },
    []
  )

  /**
   * Sign in an existing user with email and password
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<AuthResult>} Success status and error message if failed
   *
   * @example
   * ```tsx
   * const result = await login('user@example.com', 'password123');
   * if (!result.success) {
   *   toast.error(result.error);
   *   if (result.retryable) {
   *     // Show retry option
   *   }
   * }
   * ```
   */
  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!auth) {
        const error = new Error('Authentication not configured') as AuthError
        error.type = 'config'
        error.retryable = false
        setAuthError(error)
        return { success: false, error: 'Authentication not configured', retryable: false }
      }

      const result = await executeWithRetry(() => signInWithEmailAndPassword(auth!, email, password))

      // Set authError state for failed login attempts
      if (!result.success && result.originalError) {
        const authError = createAuthError(result.originalError)
        setAuthError(authError)
      } else if (result.success) {
        // Clear any existing auth error on successful login
        setAuthError(null)
      }

      return result
    },
    [executeWithRetry]
  )

  /**
   * Create a new user account with email and password
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<AuthResult>} Success status and error message if failed
   *
   * @example
   * ```tsx
   * const result = await signup('newuser@example.com', 'securepassword123');
   * if (result.success) {
   *   // User account created
   * }
   * ```
   */
  const signup = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!auth) {
        const error = new Error('Authentication not configured') as AuthError
        error.type = 'config'
        error.retryable = false
        setAuthError(error)
        return { success: false, error: 'Authentication not configured', retryable: false }
      }

      const result = await executeWithRetry(() => createUserWithEmailAndPassword(auth!, email, password))

      // Set authError state for failed signup attempts
      if (!result.success && result.originalError) {
        const authError = createAuthError(result.originalError)
        setAuthError(authError)
      } else if (result.success) {
        // Clear any existing auth error on successful signup
        setAuthError(null)
      }

      return result
    },
    [executeWithRetry]
  )

  /**
   * Sign out the currently authenticated user
   *
   * @returns {Promise<AuthResult>} Success status and error message if failed
   *
   * @example
   * ```tsx
   * const handleLogout = async () => {
   *   const result = await logout();
   *   if (result.success) {
   *     navigate('/login');
   *   }
   * };
   * ```
   */
  const logout = useCallback(async (): Promise<AuthResult> => {
    if (!auth) {
      return { success: false, error: 'Authentication not configured', retryable: false }
    }

    return executeWithRetry(() => signOut(auth!))
  }, [executeWithRetry])

  /**
   * Send a password reset email to the user
   *
   * Sends an email with a password reset link to the provided email address.
   * The user can click the link to reset their password.
   *
   * @param {string} email - User's email address
   * @returns {Promise<AuthResult>} Success status and error message if failed
   *
   * @example
   * ```tsx
   * const result = await resetPassword('user@example.com');
   * if (result.success) {
   *   toast.success('Password reset email sent');
   * }
   * ```
   */
  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      if (!auth) {
        return { success: false, error: 'Authentication not configured', retryable: false }
      }

      return executeWithRetry(() => sendPasswordResetEmail(auth!, email))
    },
    [executeWithRetry]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  return {
    user,
    loading,
    authError,
    login,
    signup,
    logout,
    resetPassword,
    clearError,
    retryAuthState,
  }
}

/**
 * Create an enhanced authentication error with context
 */
const createAuthError = (error: unknown): AuthError => {
  const errorObj = error as { code?: string; message?: string }
  const code = errorObj?.code || ''
  const message = getErrorMessage(code)

  const authError = new Error(message) as AuthError
  authError.type = getErrorType(code)
  authError.retryable = isRetryableError(code)
  authError.originalError = error

  return authError
}

/**
 * Determine error type based on Firebase error code
 */
const getErrorType = (code: string): AuthErrorType => {
  if (code.includes('network') || code.includes('timeout')) {
    return 'network'
  }
  if (code.startsWith('auth/')) {
    return 'auth'
  }
  if (code.includes('config') || code.includes('not-configured')) {
    return 'config'
  }
  return 'unknown'
}

/**
 * Determine if an error is retryable
 */
const isRetryableError = (code: string): boolean => {
  const retryableCodes = [
    'auth/network-request-failed',
    'auth/timeout',
    'auth/too-many-requests',
    'auth/service-unavailable',
    'auth/internal-error',
  ]

  return retryableCodes.includes(code) || code.includes('network')
}

/**
 * Convert Firebase Auth error codes to user-friendly messages
 *
 * Maps Firebase Authentication error codes to readable error messages
 * that can be displayed to users. Enhanced with better context and
 * retry guidance.
 *
 * @param {string} code - Firebase Auth error code
 * @returns {string} Human-readable error message
 *
 * @example
 * ```ts
 * const message = getErrorMessage('auth/invalid-email'); // "Invalid email address"
 * ```
 */
const getErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-disabled':
      return 'This account has been disabled'
    case 'auth/user-not-found':
      return 'No account found with this email'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/email-already-in-use':
      return 'Email is already in use'
    case 'auth/weak-password':
      return 'Password is too weak'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again'
    case 'auth/timeout':
      return 'Request timed out. Please try again'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again'
    case 'auth/service-unavailable':
      return 'Authentication service is temporarily unavailable. Please try again'
    case 'auth/internal-error':
      return 'An internal error occurred. Please try again'
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password'
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method'
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this action'
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled'
    case 'auth/user-token-expired':
      return 'Your session has expired. Please sign in again'
    case 'auth/invalid-user-token':
      return 'Invalid session. Please sign in again'
    case 'auth/user-mismatch':
      return 'The provided credentials do not match the current user'
    case 'auth/provider-already-linked':
      return 'This account is already linked to another provider'
    case 'auth/no-such-provider':
      return 'No such provider is linked to this account'
    case 'auth/invalid-action-code':
      return 'Invalid or expired action code'
    case 'auth/invalid-verification-code':
      return 'Invalid verification code'
    case 'auth/invalid-verification-id':
      return 'Invalid verification ID'
    case 'auth/missing-verification-code':
      return 'Verification code is required'
    case 'auth/missing-verification-id':
      return 'Verification ID is required'
    case 'auth/quota-exceeded':
      return 'Quota exceeded. Please try again later'
    case 'auth/captcha-check-failed':
      return 'Captcha verification failed. Please try again'
    case 'auth/invalid-phone-number':
      return 'Invalid phone number'
    case 'auth/missing-phone-number':
      return 'Phone number is required'
    case 'auth/sms-quota-exceeded':
      return 'SMS quota exceeded. Please try again later'
    default:
      return 'An unexpected error occurred. Please try again'
  }
}

export default useAuth
