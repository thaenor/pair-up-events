import { useState, useEffect } from 'react';
import { pwaService } from '@/lib/pwa';

export interface PWAHook {
  isInstalled: boolean;
  registerServiceWorker: () => Promise<boolean>;
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
    isInstalled: pwaService.isInstalled,
    registerServiceWorker: pwaService.registerServiceWorker,
    isServiceWorkerRegistered,
  };
};
