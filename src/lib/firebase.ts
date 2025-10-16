import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

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
 */
type FirebaseResources = {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
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
 * associated services (Auth and Firestore). Returns null values if
 * configuration is incomplete.
 *
 * @returns {FirebaseResources} Object containing app, auth, and db instances
 * @returns {FirebaseApp | null} returns.app - Firebase app instance
 * @returns {Auth | null} returns.auth - Authentication service
 * @returns {Firestore | null} returns.db - Firestore database
 *
 * @throws {Error} Logs error if Firebase initialization fails
 *
 * @example
 * ```ts
 * const { app, auth, db } = initializeFirebase();
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
    }
  }

  const existingApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

  return {
    app: existingApp,
    auth: getAuth(existingApp),
    db: getFirestore(existingApp),
  }
}

const { app, auth, db } = initializeFirebase()

/**
 * Connect to Firebase Auth Emulator when running locally
 *
 * Automatically connects to the local Firebase Auth Emulator on localhost
 * to enable offline authentication testing without affecting production data.
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
// Connect to Auth Emulator when running locally
const shouldUseEmulator = import.meta.env.VITE_USE_EMULATOR !== 'false' && window.location.hostname === 'localhost'

if (auth && shouldUseEmulator) {
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

/**
 * Firebase app instance
 *
 * Singleton Firebase application instance used throughout the application
 * for all Firebase service interactions.
 *
 * @type {FirebaseApp | null}
 * @constant
 */
export { app, auth, db }
