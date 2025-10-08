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
  onAuthStateChanged
} from '@/lib/firebase';
import { AuthContextType, AuthState } from '@/lib/firebase/types';
import { AuthContext } from './AuthContext';
import { getAuthErrorMessage } from '@/utils/authErrorMessages';
import { setUser } from '@/lib/sentry';

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

  // Set up auth state listener
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
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
  }, []);


  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
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
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const currentUser = auth.currentUser;

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
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signOut(auth);
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
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
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
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error('No user is currently signed in');
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
