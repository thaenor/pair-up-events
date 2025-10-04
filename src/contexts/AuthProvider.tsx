import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthContextType, AuthState, OAuthProvider as OAuthProviderType } from '@/lib/firebase/types';
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

  // OAuth sign in helper
  const signInWithOAuth = async (providerType: OAuthProviderType) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      let provider;
      switch (providerType) {
        case 'google':
          provider = new GoogleAuthProvider();
          break;
        case 'facebook':
          provider = new FacebookAuthProvider();
          break;
        case 'apple':
          provider = new OAuthProvider('apple.com');
          break;
        default:
          throw new Error(`Unsupported OAuth provider: ${providerType}`);
      }

      await signInWithPopup(auth, provider);
    } catch (error: unknown) {
      handleAuthError(error, 'Authentication');
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    await signInWithOAuth('google');
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    await signInWithOAuth('apple');
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    await signInWithOAuth('facebook');
  };

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
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      handleAuthError(error, 'Sign up');
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

  // Clear error
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...authState,
    signInWithGoogle,
    signInWithApple,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
