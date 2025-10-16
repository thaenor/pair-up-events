import { logInfo, logError } from '@/utils/logger';

// PWA Install Prompt Event Interface
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAService {
  isInstallable: boolean;
  isInstalled: boolean;
  installPrompt: PWAInstallPrompt | null;
  registerServiceWorker: () => Promise<boolean>;
  requestInstall: () => Promise<boolean>;
}

class PWAManager implements PWAService {
  private _installPrompt: PWAInstallPrompt | null = null;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  constructor() {
    this.setupInstallPrompt();
    this.checkInstallationStatus();
  }

  get isInstallable(): boolean {
    return this.installPrompt !== null;
  }

  get isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
           document.referrer.includes('android-app://');
  }

  get installPrompt(): PWAInstallPrompt | null {
    return this._installPrompt;
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event) => {
      logInfo('PWA install prompt available', {
        component: 'PWAManager',
        action: 'beforeinstallprompt',
      });

      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      
      // Stash the event so it can be triggered later
      this.deferredPrompt = event;
      
      this._installPrompt = {
        prompt: async () => {
          if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            logInfo('PWA install prompt result', {
              component: 'PWAManager',
              action: 'installPrompt',
              additionalData: { outcome },
            });
            this.deferredPrompt = null;
            this._installPrompt = null;
          }
        },
        userChoice: this.deferredPrompt?.userChoice || Promise.resolve({ outcome: 'dismissed' as const }),
      };
    });

    window.addEventListener('appinstalled', () => {
      logInfo('PWA installed successfully', {
        component: 'PWAManager',
        action: 'appinstalled',
      });
      
      this.deferredPrompt = null;
      this._installPrompt = null;
    });
  }

  private checkInstallationStatus(): void {
    if (this.isInstalled) {
      logInfo('PWA is already installed', {
        component: 'PWAManager',
        action: 'checkInstallationStatus',
      });
    }
  }

  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      logError('Service Worker not supported', {
        component: 'PWAManager',
        action: 'registerServiceWorker',
      });
      return false;
    }

    // Skip service worker registration in development for better HMR
    if (import.meta.env.DEV) {
      logInfo('Service Worker registration skipped in development mode', {
        component: 'PWAManager',
        action: 'registerServiceWorker',
      });
      return true; // Return true to indicate "success" but don't actually register
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      logInfo('Service Worker registered successfully', {
        component: 'PWAManager',
        action: 'registerServiceWorker',
        additionalData: { scope: registration.scope },
      });

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              logInfo('New service worker available', {
                component: 'PWAManager',
                action: 'updatefound',
              });
              
              // Notify user about update
              if (confirm('New version available! Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });

      return true;
    } catch (error) {
      logError('Service Worker registration failed', {
        component: 'PWAManager',
        action: 'registerServiceWorker',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  async requestInstall(): Promise<boolean> {
    if (!this.installPrompt) {
      logError('Install prompt not available', {
        component: 'PWAManager',
        action: 'requestInstall',
      });
      return false;
    }

    try {
      await this.installPrompt.prompt();
      return true;
    } catch (error) {
      logError('Install request failed', {
        component: 'PWAManager',
        action: 'requestInstall',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }
}

// Create singleton instance
export const pwaService = new PWAManager();
