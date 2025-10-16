import React, { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, Download, Smartphone } from 'lucide-react';
import { trackPWAEvent, trackNotificationEvent } from '@/lib/analytics';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const { isInstallable, isInstalled, requestInstall } = usePWA();
  const { permission, requestPermission, getToken } = usePushNotifications();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Show prompt if app is installable and not already installed
    if (isInstallable && !isInstalled) {
      setShowPrompt(true);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await requestInstall();
      if (success) {
        setShowPrompt(false);
        // Track successful PWA installation
        trackPWAEvent('install');
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleRequestNotifications = async () => {
    setIsRequestingPermission(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        await getToken();
        // Track successful notification permission grant
        trackNotificationEvent('permission_granted');
      } else {
        // Track notification permission denial
        trackNotificationEvent('permission_denied');
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      // Track notification permission error
      trackNotificationEvent('permission_denied');
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Track PWA prompt dismissal
    trackPWAEvent('dismiss');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Smartphone className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900">
            Install Pair Up Events
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Get the full app experience with offline access and push notifications.
          </p>
          
          <div className="mt-3 flex flex-col space-y-2">
            {isInstallable && (
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pairup-cyan hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                {isInstalling ? 'Installing...' : 'Install App'}
              </button>
            )}
            
            {permission.permission === 'default' && (
              <button
                onClick={handleRequestNotifications}
                disabled={isRequestingPermission}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Bell className="h-4 w-4 mr-2" />
                {isRequestingPermission ? 'Requesting...' : 'Enable Notifications'}
              </button>
            )}
            
            {permission.permission === 'granted' && (
              <div className="text-xs text-green-600 flex items-center">
                <Bell className="h-3 w-3 mr-1" />
                Notifications enabled
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
