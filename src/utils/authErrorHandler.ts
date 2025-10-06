import { AuthState } from '@/lib/firebase/types';
import { getAuthErrorMessage } from './authErrorMessages';

export const createAuthErrorHandler = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  return (error: unknown) => {
    // Use user-friendly error messages instead of raw Firebase errors
    const errorMessage = getAuthErrorMessage(error);
    setAuthState(prev => ({
      ...prev,
      loading: false,
      error: errorMessage,
    }));
    return errorMessage;
  };
};
