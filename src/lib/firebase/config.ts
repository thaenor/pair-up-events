// Firebase configuration - minimal setup for OAuth only
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// Validate that all required environment variables are present
export const validateFirebaseConfig = () => {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
  ];
  if (import.meta.env.MODE === 'test' || import.meta.env.VITEST) {
    return true;
  }

  const missingKeys = requiredKeys.filter(key => !import.meta.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(`Missing Firebase environment variables: ${missingKeys.join(', ')}`);
  }

  return true;
};
