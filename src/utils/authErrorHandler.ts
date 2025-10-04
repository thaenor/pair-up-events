import { AuthState } from '@/lib/firebase/types';

export const createAuthErrorHandler = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  return (error: unknown, operation: string) => {
    const errorMessage = error instanceof Error ? error.message : `${operation} failed`;
    setAuthState(prev => ({
      ...prev,
      loading: false,
      error: errorMessage,
    }));
    return errorMessage;
  };
};
