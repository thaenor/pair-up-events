import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';

import { firebaseConfig, validateFirebaseConfig } from './config';

let appPromise: Promise<FirebaseApp> | null = null;
let authPromise: Promise<Auth> | null = null;
let authModulePromise: Promise<typeof import('firebase/auth')> | null = null;

const getFirebaseApp = async (): Promise<FirebaseApp> => {
  if (appPromise) {
    return appPromise;
  }

  validateFirebaseConfig();
  appPromise = import('firebase/app').then(({ initializeApp }) => initializeApp(firebaseConfig));
  return appPromise;
};

export const loadAuthModule = async () => {
  if (authModulePromise) {
    return authModulePromise;
  }

  authModulePromise = import('firebase/auth');
  return authModulePromise;
};

export const getFirebaseAuth = async (): Promise<Auth> => {
  if (authPromise) {
    return authPromise;
  }

  authPromise = Promise.all([getFirebaseApp(), loadAuthModule()]).then(([app, authModule]) => {
    const authInstance = authModule.getAuth(app);

    if (import.meta.env.DEV) {
      // Uncomment this block if you want to use Firebase emulators
      // authModule.connectAuthEmulator(authInstance, "http://localhost:9099");
    }

    return authInstance;
  });

  return authPromise;
};

export const loadAuthResources = async () => {
  const [authModule, auth] = await Promise.all([loadAuthModule(), getFirebaseAuth()]);
  return { authModule, auth };
};
