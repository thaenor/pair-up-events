import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import type { User, Unsubscribe } from 'firebase/auth';

import { loadAuthResources } from '@/lib/firebase';
import { AuthContextType, AuthState } from '@/lib/firebase/types';
import { AuthContext } from './AuthContext';
import { getAuthErrorMessage } from '@/utils/authErrorMessages';
import { setSentryUser, clearSentryUser, addSentryBreadcrumb } from '@/lib/sentry';

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
    [] // setAuthState is stable, so no dependencies needed
  );

  const ensureAuthResources = useCallback(() => loadAuthResources(), []);

  // Set up auth state listener
  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;
    let isMounted = true;

    ensureAuthResources()
      .then(({ authModule, auth }) => {
        if (!isMounted) {
          return;
        }

        unsubscribe = authModule.onAuthStateChanged(auth, (user: User | null) => {
          setAuthState({
            user,
            loading: false,
            error: null,
          });

          // Update Sentry user context
          if (user) {
            setSentryUser({
              uid: user.uid,
              email: user.email || undefined,
            });
            addSentryBreadcrumb('User signed in', 'auth', {
              userId: user.uid,
              email: user.email,
            });
          } else {
            clearSentryUser();
            addSentryBreadcrumb('User signed out', 'auth');
          }
        });
      })
      .catch((error: unknown) => {
        handleAuthError(error);
      });

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [ensureAuthResources, handleAuthError]);

  const runWithAuth = async <T,>(callback: (
    resources: Awaited<ReturnType<typeof ensureAuthResources>>
  ) => Promise<T>) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const resources = await ensureAuthResources();
      return await callback(resources);
    } catch (error: unknown) {
      handleAuthError(error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    addSentryBreadcrumb('Sign in attempt', 'auth', { email });
    try {
      await runWithAuth(async ({ authModule, auth }) => {
        await authModule.signInWithEmailAndPassword(auth, email, password);
      });
      addSentryBreadcrumb('Sign in successful', 'auth', { email });
    } catch (error) {
      const errorDetails = error instanceof Error ? { error: error.message } : undefined;
      addSentryBreadcrumb('Sign in failed', 'auth', {
        email,
        ...errorDetails,
      });
      throw error;
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string) => {
    addSentryBreadcrumb('Sign up attempt', 'auth', { email });

    try {
      await runWithAuth(async ({ authModule, auth }) => {
        const userCredential = await authModule.createUserWithEmailAndPassword(auth, email, password);

        if (userCredential.user) {
          await authModule.sendEmailVerification(userCredential.user);
          addSentryBreadcrumb('Email verification sent', 'auth', {
            email,
            userId: userCredential.user.uid,
          });
        }

        addSentryBreadcrumb('Sign up successful', 'auth', {
          email,
          userId: userCredential.user?.uid,
        });
      });
    } catch (error) {
      const errorDetails = error instanceof Error ? { error: error.message } : undefined;
      addSentryBreadcrumb('Sign up failed', 'auth', {
        email,
        ...errorDetails,
      });
      throw error;
    }
  };

  // Send email verification
  const sendEmailVerificationToUser = async () => {
    await runWithAuth(async ({ authModule, auth }) => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      await authModule.sendEmailVerification(currentUser);
    });
  };

  // Sign out
  const signOut = async () => {
    await runWithAuth(async ({ authModule, auth }) => {
      await authModule.signOut(auth);
    });
  };

  // Send password reset email
  const sendPasswordReset = async (email: string) => {
    await runWithAuth(async ({ authModule, auth }) => {
      await authModule.sendPasswordResetEmail(auth, email);
    });
  };

  // Delete user account
  const deleteUserAccount = async () => {
    await runWithAuth(async ({ authModule, auth }) => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      await authModule.deleteUser(currentUser);
    });
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
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
