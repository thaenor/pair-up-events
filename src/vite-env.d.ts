/// <reference types="vite/client" />

// Vite environment variables
interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Web Share API types
interface Navigator {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
}

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}
