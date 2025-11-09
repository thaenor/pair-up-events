import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'
import { app } from './firebase'

/**
 * Initialize Firebase App Check with reCAPTCHA v3
 *
 * App Check helps protect your Firebase resources from abuse by preventing
 * unauthorized clients from accessing your backend resources. It works with
 * reCAPTCHA v3 to verify requests are coming from your authentic app.
 *
 * @see {@link https://firebase.google.com/docs/app-check}
 */
export const initializeAppCheckService = () => {
  // Only initialize if Firebase app is configured
  if (!app) {
    console.warn('Firebase app not initialized. Skipping App Check setup.')
    return null
  }

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

  if (!recaptchaSiteKey) {
    console.warn('reCAPTCHA site key not configured. Skipping App Check setup.')
    return null
  }

  try {
    // Initialize App Check with reCAPTCHA v3
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),

      // Automatic token refresh enabled
      isTokenAutoRefreshEnabled: true,
    })

    console.log('✅ Firebase App Check initialized successfully with reCAPTCHA v3')
    return appCheck
  } catch (error) {
    console.error('❌ Failed to initialize App Check:', error)
    return null
  }
}

/**
 * Enable App Check debug mode for local development
 *
 * When enabled, the browser console will display a debug token that you need to
 * register in the Firebase Console to allow local development.
 *
 * @see {@link https://firebase.google.com/docs/app-check/web/debug-provider}
 */
export const enableAppCheckDebugMode = () => {
  if (import.meta.env.DEV) {
    // Enable debug mode in development
    // @ts-expect-error - Debug token is a global self property
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    console.log('🐛 App Check Debug Mode enabled - Check console for debug token')
  }
}
