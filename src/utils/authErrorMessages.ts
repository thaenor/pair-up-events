/**
 * User-friendly error messages for Firebase authentication errors
 * Converts technical Firebase error codes into helpful, actionable messages
 */

export interface AuthError {
  code: string;
  message: string;
}

export const getAuthErrorMessage = (error: unknown): string => {
  // Handle Firebase Auth errors
  if (error && typeof error === 'object' && 'code' in error) {
    const authError = error as AuthError;

    switch (authError.code) {
      // Sign in errors
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please check your credentials and try again.';

      case 'auth/user-not-found':
        return 'No account found with this email address. Please check your email or create a new account.';

      case 'auth/invalid-email':
        return 'Please enter a valid email address.';

      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support for assistance.';

      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a moment before trying again.';

      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';

      // Sign up errors
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in instead.';

      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password with at least 6 characters.';

      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';

      // General errors
      case 'auth/requires-recent-login':
        return 'This action requires recent authentication. Please sign in again.';

      case 'auth/credential-already-in-use':
        return 'This credential is already associated with a different account.';

      default:
        // For unknown Firebase errors, provide a generic message
        return 'An authentication error occurred. Please try again or contact support if the problem persists.';
    }
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if an error is a Firebase auth error
 */
export const isFirebaseAuthError = (error: unknown): error is AuthError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as AuthError).code === 'string' &&
    (error as AuthError).code.startsWith('auth/')
  );
};

/**
 * Get a user-friendly title for the error
 */
export const getAuthErrorTitle = (error: unknown): string => {
  if (isFirebaseAuthError(error)) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Sign In Failed';

      case 'auth/email-already-in-use':
        return 'Account Already Exists';

      case 'auth/weak-password':
        return 'Password Too Weak';

      case 'auth/too-many-requests':
        return 'Too Many Attempts';

      case 'auth/network-request-failed':
        return 'Connection Error';

      default:
        return 'Authentication Error';
    }
  }

  return 'Error';
};
