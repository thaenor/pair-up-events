import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthContextType, AuthState } from '@/lib/firebase/types';
import { AuthContext } from './AuthContext';
import { createAuthErrorHandler } from '@/utils/authErrorHandler';

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
  const handleAuthError = useMemo(
    () => createAuthErrorHandler(setAuthState),
    []
  );

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);


  // Sign in with email and password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      handleAuthError(error, 'Sign in');
      throw error;
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Send email verification after successful registration
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
    } catch (error: unknown) {
      handleAuthError(error, 'Sign up');
      throw error;
    }
  };

  // Send email verification
  const sendEmailVerificationToUser = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await sendEmailVerification(auth.currentUser);
    } catch (error: unknown) {
      handleAuthError(error, 'Send email verification');
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await firebaseSignOut(auth);
    } catch (error: unknown) {
      handleAuthError(error, 'Sign out');
      throw error;
    }
  };

  // Send password reset email
  const sendPasswordReset = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      handleAuthError(error, 'Send password reset');
      throw error;
    }
  };

  // Delete user account
  const deleteUserAccount = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await deleteUser(auth.currentUser);
    } catch (error: unknown) {
      handleAuthError(error, 'Delete account');
      throw error;
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
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
