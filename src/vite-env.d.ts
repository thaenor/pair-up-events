/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

// Vite environment variables
interface ImportMetaEnv {
  readonly MODE: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_USE_EMULATOR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Web Share API types
interface Navigator {
  share?: (data: ShareData) => Promise<void>
  canShare?: (data: ShareData) => boolean
}

interface ShareData {
  title?: string
  text?: string
  url?: string
}
