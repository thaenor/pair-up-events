import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './config';

// Initialize Firebase immediately and synchronously
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Re-export all auth functions we need
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
  onAuthStateChanged,
} from 'firebase/auth';