import { User } from 'firebase/auth';

// Re-export Firebase types for convenience
export type { User } from 'firebase/auth';

// Authentication state using Firebase's built-in User type
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Authentication context type
export interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

