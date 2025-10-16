import { useState, useEffect } from 'react'
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
 */
type AuthResult = {
  success: boolean
  error?: string
}

/**
 * Custom hook for Firebase authentication operations
 *
 * Provides methods for user authentication including login, signup, logout,
 * and password reset. Manages authentication state and loading status.
 * Automatically syncs with Firebase Auth state changes.
 *
 * @returns {Object} Authentication state and methods
 * @returns {User | null} returns.user - Currently authenticated user or null
 * @returns {boolean} returns.loading - Whether authentication state is loading
 * @returns {Function} returns.login - Async login function (email, password)
 * @returns {Function} returns.signup - Async signup function (email, password)
 * @returns {Function} returns.logout - Async logout function
 * @returns {Function} returns.resetPassword - Async password reset function (email)
 *
 * @example
 * ```tsx
 * const { user, loading, login } = useAuth();
 *
 * const handleLogin = async () => {
 *   const result = await login('user@example.com', 'password123');
 *   if (result.success) {
 *     // Handle success
 *   } else {
 *     console.error(result.error);
 *   }
 * };
 * ```
 */
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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
   * }
   * ```
   */
  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (!auth) return { success: false, error: 'Authentication not configured' }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage((error as { code?: string })?.code || '') }
    }
  }

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
  const signup = async (email: string, password: string): Promise<AuthResult> => {
    if (!auth) return { success: false, error: 'Authentication not configured' }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage((error as { code?: string })?.code || '') }
    }
  }

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
  const logout = async (): Promise<AuthResult> => {
    if (!auth) return { success: false, error: 'Authentication not configured' }

    try {
      await signOut(auth)
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage((error as { code?: string })?.code || '') }
    }
  }

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
  const resetPassword = async (email: string): Promise<AuthResult> => {
    if (!auth) return { success: false, error: 'Authentication not configured' }

    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage((error as { code?: string })?.code || '') }
    }
  }

  return {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
  }
}

/**
 * Convert Firebase Auth error codes to user-friendly messages
 *
 * Maps Firebase Authentication error codes to readable error messages
 * that can be displayed to users.
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
      return 'Network error. Please check your connection'
    default:
      return 'An unexpected error occurred'
  }
}

export default useAuth
