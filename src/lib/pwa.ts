import { logInfo, logError } from '@/utils/logger';

// PWA Install Prompt functionality removed - users can install via browser controls

export interface PWAService {
  isInstalled: boolean;
  registerServiceWorker: () => Promise<boolean>;
}

class PWAManager implements PWAService {
  constructor() {
    // Only check installation status - no install prompt functionality
    this.checkInstallationStatus();
  }

  get isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
           document.referrer.includes('android-app://');
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

  // Install prompt functionality removed - users can install via browser controls
}

// Create singleton instance
export const pwaService = new PWAManager();
