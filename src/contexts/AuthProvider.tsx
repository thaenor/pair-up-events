import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import type { User } from 'firebase/auth';

import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
  onAuthStateChanged,
  missingFirebaseConfig,
} from '@/lib/firebase';
import { AuthContextType, AuthState } from '@/lib/firebase/types';
import { AuthContext } from './AuthContext';
import { getAuthErrorMessage } from '@/utils/authErrorMessages';
import { setUser } from '@/lib/sentry';
import { createUserProfile, deleteUserProfile } from '@/lib/firebase/user-profile';
import { logError, logWarning } from '@/utils/logger';

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Centralized error handler
  const handleAuthError = useCallback(
    (error: unknown) => {
      // Use user-friendly error messages instead of raw Firebase errors
      const errorMessage = getAuthErrorMessage(error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return errorMessage;
    },
    [setAuthState] // Explicitly include setAuthState for clarity and maintainability
  );

  const ensureAuthConfigured = useCallback((options?: { suppressErrorState?: boolean }) => {
    if (!auth) {
      const errorMessage = missingFirebaseConfig.length > 0
        ? 'Authentication is unavailable because Firebase credentials are not configured.'
        : 'Authentication is temporarily unavailable. Please try again later.';

      const error = new Error(errorMessage);

      if (options?.suppressErrorState) {
        logWarning('Firebase Auth is disabled due to missing configuration.', {
          component: 'AuthProvider',
          action: 'ensureAuthConfigured:suppressed',
          additionalData: { missingFirebaseConfig },
        });
      } else {
        logError('Attempted to use Firebase Auth without a valid configuration.', error, {
          component: 'AuthProvider',
          action: 'ensureAuthConfigured',
          additionalData: { missingFirebaseConfig },
        });
      }

      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: options?.suppressErrorState ? prev.error : errorMessage,
      }));

      setUser(null);

      return { auth: null, error } as const;
    }

    return { auth, error: null as Error | null } as const;
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const { auth: authInstance } = ensureAuthConfigured({ suppressErrorState: true });

    if (!authInstance) {
      return undefined;
    }

    let isMounted = true;

    const unsubscribe = onAuthStateChanged(authInstance, (user: User | null) => {
      if (!isMounted) {
        return;
      }

      setAuthState({
        user,
        loading: false,
        error: null,
      });

      // Update Sentry user context
      if (user) {
        setUser({
          id: user.uid,
          email: user.email || undefined,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [ensureAuthConfigured]);


  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { auth: authInstance, error } = ensureAuthConfigured();
      if (!authInstance) {
        throw error;
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(authInstance, email, password);
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const { auth: authInstance, error: configurationError } = ensureAuthConfigured();
      if (!authInstance) {
        throw configurationError;
      }

      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);

      if (userCredential.user) {
        try {
          await createUserProfile({
            id: userCredential.user.uid,
            email,
            displayName: userCredential.user.displayName,
            photoUrl: userCredential.user.photoURL,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          });
          await sendEmailVerification(userCredential.user);
        } catch (profileError) {
          logError('Failed to finalize sign up flow', profileError, {
            component: 'AuthProvider',
            action: 'signUpWithEmail',
            additionalData: { uid: userCredential.user.uid },
          });

          try {
            await deleteUser(userCredential.user);
          } catch (cleanupError) {
            logError('Failed to rollback user creation after profile error', cleanupError, {
              component: 'AuthProvider',
              action: 'signUpWithEmail:rollback',
              additionalData: { uid: userCredential.user.uid },
            });
          }

          throw profileError;
        }
      }
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Send email verification
  const sendEmailVerificationToUser = async () => {
    try {
      const { auth: authInstance, error } = ensureAuthConfigured();
      if (!authInstance) {
        throw error;
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const currentUser = authInstance.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      await sendEmailVerification(currentUser);
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Sign out
  const signOutUser = async () => {
    try {
      const { auth: authInstance, error } = ensureAuthConfigured();
      if (!authInstance) {
        throw error;
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signOut(authInstance);
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Send password reset email
  const sendPasswordReset = async (email: string) => {
    try {
      const { auth: authInstance, error } = ensureAuthConfigured();
      if (!authInstance) {
        throw error;
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(authInstance, email);
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Delete user account
  const deleteUserAccount = async () => {
    try {
      const { auth: authInstance, error } = ensureAuthConfigured();
      if (!authInstance) {
        throw error;
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const currentUser = authInstance.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      try {
        await deleteUserProfile(currentUser.uid);
      } catch (profileError) {
        logError('Profile cleanup failed during account deletion. Continuing with auth deletion.', profileError, {
          component: 'AuthProvider',
          action: 'deleteUserAccount:profileCleanupError',
          additionalData: { uid: currentUser.uid },
        });
      }

      await deleteUser(currentUser);
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Clear error
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...authState,
    signInWithEmail,
    signUpWithEmail,
    sendEmailVerification: sendEmailVerificationToUser,
    sendPasswordReset,
    deleteUserAccount,
    signOut: signOutUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
