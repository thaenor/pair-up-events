/// <reference types="vite/client" />
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, type FirebaseStorage, connectStorageEmulator } from 'firebase/storage'

/**
 * Firebase project configuration object
 *
 * Contains all required configuration values from environment variables
 * for connecting to the Firebase project. Used to initialize Firebase app,
 * authentication, and Firestore database services.
 *
 * @type {Object}
 * @constant
 * @property {string} apiKey - Firebase API key
 * @property {string} authDomain - Authentication domain
 * @property {string} projectId - Firebase project ID
 * @property {string} appId - Application ID
 * @property {string} storageBucket - Firebase Storage bucket name
 *
 * @example
 * ```ts
 * const app = initializeApp(firebaseConfig);
 * const auth = getAuth(app);
 * ```
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
}

/**
 * Firebase resource types structure
 *
 * @typedef {Object} FirebaseResources
 * @property {FirebaseApp | null} app - Firebase app instance
 * @property {Auth | null} auth - Firebase authentication instance
 * @property {Firestore | null} db - Firestore database instance
 * @property {FirebaseStorage | null} storage - Firebase Storage instance
 */
type FirebaseResources = {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  storage: FirebaseStorage | null
}

/**
 * Check if all Firebase configuration values are present
 *
 * Validates that all required Firebase configuration values are populated.
 * Returns true only if every configuration field has a non-empty value.
 *
 * @type {boolean}
 * @constant
 *
 * @example
 * ```ts
 * if (!isFirebaseConfigured) {
 *   console.warn('Firebase configuration incomplete');
 * }
 * ```
 */
export const isFirebaseConfigured = Object.values(firebaseConfig).every(value => value)

/**
 * Initialize Firebase app and services
 *
 * Creates or retrieves the existing Firebase app instance and initializes
 * associated services (Auth, Firestore, and Storage). Returns null values if
 * configuration is incomplete.
 *
 * @returns {FirebaseResources} Object containing app, auth, db, and storage instances
 * @returns {FirebaseApp | null} returns.app - Firebase app instance
 * @returns {Auth | null} returns.auth - Authentication service
 * @returns {Firestore | null} returns.db - Firestore database
 * @returns {FirebaseStorage | null} returns.storage - Firebase Storage service
 *
 * @throws {Error} Logs error if Firebase initialization fails
 *
 * @example
 * ```ts
 * const { app, auth, db, storage } = initializeFirebase();
 * if (auth) {
 *   signInWithEmailAndPassword(auth, email, password);
 * }
 * ```
 */
const initializeFirebase = (): FirebaseResources => {
  if (!isFirebaseConfigured) {
    console.warn('Firebase configuration is incomplete.')
    return {
      app: null,
      auth: null,
      db: null,
      storage: null,
    }
  }

  const existingApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

  return {
    app: existingApp,
    auth: getAuth(existingApp),
    db: getFirestore(existingApp),
    storage: getStorage(existingApp),
  }
}

const { app, auth, db, storage } = initializeFirebase()

/**
 * Connect to Firebase Emulators when running locally
 *
 * Automatically connects to the local Firebase Emulators (Auth, Firestore, and Storage) on localhost
 * to enable offline testing without affecting production data.
 * Only activates in development environment when running on localhost and
 * VITE_USE_EMULATOR is not explicitly set to 'false'.
 *
 * @see {@link https://firebase.google.com/docs/emulator-suite} Firebase Emulator Suite
 *
 * @example
 * // Automatically runs when hostname is localhost and emulator is available
 * // Set VITE_USE_EMULATOR=false to disable and use live Firebase
 * ```
 */
// Connect to Emulators when running locally
const shouldUseEmulator = import.meta.env.VITE_USE_EMULATOR !== 'false' && window.location.hostname === 'localhost'

if (shouldUseEmulator) {
  // Connect to Auth Emulator
  if (auth) {
    try {
      // Check if emulator is already connected
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const authInstance = auth as any
      const isAlreadyConnected = authInstance._delegate?._config?.emulator

      if (!isAlreadyConnected) {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      }
    } catch (error) {
      console.warn('Firebase Auth Emulator connection failed:', error)
      // Emulator might not be running - continue with production auth
    }
  }

  // Connect to Firestore Emulator
  if (db) {
    try {
      // Firestore emulator runs on port 8081 (8080 is used by Vite dev server)
      // We need to check if already connected by checking the host
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dbInstance = db as any
      const isFirestoreEmulatorConnected =
        dbInstance._settings?.host === 'localhost:8081' || dbInstance._delegate?._settings?.host === 'localhost:8081'

      if (!isFirestoreEmulatorConnected) {
        connectFirestoreEmulator(db, 'localhost', 8081)
      }
    } catch (error) {
      console.warn('Firebase Firestore Emulator connection failed:', error)
      // Emulator might not be running - continue with production Firestore
    }
  }

  // Connect to Storage Emulator
  if (storage) {
    try {
      // Storage emulator runs on port 9199 (default Firebase Storage emulator port)
      // We need to check if already connected by checking the host
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storageInstance = storage as any
      const isStorageEmulatorConnected =
        storageInstance._delegate?._host === 'localhost:9199' || storageInstance._host === 'localhost:9199'

      if (!isStorageEmulatorConnected) {
        connectStorageEmulator(storage, 'localhost', 9199)
      }
    } catch (error) {
      console.warn('Firebase Storage Emulator connection failed:', error)
      // Emulator might not be running - continue with production Storage
    }
  }
}

/**
 * Firebase app instance
 *
 * Singleton Firebase application instance used throughout the application
 * for all Firebase service interactions.
 *
 * @type {FirebaseApp | null}
 * @constant
 */
export { app, auth, db, storage }
