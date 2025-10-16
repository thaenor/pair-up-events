import { useState, useEffect } from 'react';
import { pwaService, PWAInstallPrompt } from '@/lib/pwa';

export interface PWAHook {
  isInstallable: boolean;
  isInstalled: boolean;
  installPrompt: PWAInstallPrompt | null;
  registerServiceWorker: () => Promise<boolean>;
  requestInstall: () => Promise<boolean>;
  isServiceWorkerRegistered: boolean;
}

export const usePWA = (): PWAHook => {
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    // Register service worker on mount
    const registerSW = async () => {
      const registered = await pwaService.registerServiceWorker();
      setIsServiceWorkerRegistered(registered);
    };

    registerSW();
  }, []);

  return {
    isInstallable: pwaService.isInstallable,
    isInstalled: pwaService.isInstalled,
    installPrompt: pwaService.installPrompt,
    registerServiceWorker: pwaService.registerServiceWorker,
    requestInstall: pwaService.requestInstall,
    isServiceWorkerRegistered,
  };
};
