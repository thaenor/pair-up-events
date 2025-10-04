import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig, validateFirebaseConfig } from './config';

// Validate configuration before initializing
validateFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  // Uncomment these lines if you want to use Firebase emulators for development
  // import { connectAuthEmulator } from 'firebase/auth';
  // connectAuthEmulator(auth, "http://localhost:9099");
}

export default app;
