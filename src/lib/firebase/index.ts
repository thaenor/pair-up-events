import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getMessaging, type Messaging } from 'firebase/messaging';

import { logWarning } from '@/utils/logger';

import { firebaseConfig } from './config';

type FirebaseResources = {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  messaging: Messaging | null;
};

const missingConfigKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingConfigKeys.length === 0;

const initializeFirebase = (): FirebaseResources => {
  if (!isFirebaseConfigured) {
    logWarning('Firebase configuration is incomplete. Falling back to disabled Firebase features.', {
      component: 'firebase:index',
      action: 'initialize',
      additionalData: { missingConfigKeys },
    });

    return {
      app: null,
      auth: null,
      db: null,
      messaging: null,
    };
  }

  const existingApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

  return {
    app: existingApp,
    auth: getAuth(existingApp),
    db: getFirestore(existingApp),
    messaging: getMessaging(existingApp),
  };
};

const { app, auth, db, messaging } = initializeFirebase();

export { app, auth, db, messaging };
export const missingFirebaseConfig = missingConfigKeys;

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

// Re-export messaging functions
export {
  getToken,
  onMessage,
  isSupported,
} from 'firebase/messaging';
