import { useState, useEffect, useCallback } from 'react';
import { 
  messaging, 
  getToken, 
  onMessage, 
  isSupported 
} from '@/lib/firebase';
import { logError, logInfo } from '@/utils/logger';
import { fcmTokenManager } from '@/utils/fcmTokenManager';

export interface NotificationPermission {
  permission: 'default' | 'granted' | 'denied';
  isSupported: boolean;
  token: string | null;
}

export interface PushNotificationHook {
  permission: NotificationPermission;
  requestPermission: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  isSupported: boolean;
}

export const usePushNotifications = (): PushNotificationHook => {
  const [permission, setPermission] = useState<NotificationPermission>({
    permission: 'default',
    isSupported: false,
    token: null,
  });

  // Check if notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = await isSupported();
        setPermission(prev => ({
          ...prev,
          isSupported: supported,
        }));
      } catch (error) {
        logError('Failed to check notification support', {
          component: 'usePushNotifications',
          action: 'checkSupport',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    checkSupport();
  }, []);

  // Get current permission status and load existing token
  useEffect(() => {
    if (permission.isSupported && 'Notification' in window) {
      setPermission(prev => ({
        ...prev,
        permission: Notification.permission,
        token: fcmTokenManager.getToken(),
      }));
    }
  }, [permission.isSupported]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!permission.isSupported || !messaging) {
      logError('Push notifications not supported or messaging not available', {
        component: 'usePushNotifications',
        action: 'requestPermission',
      });
      return false;
    }

    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(prev => ({
        ...prev,
        permission: permissionResult,
      }));

      if (permissionResult === 'granted') {
        logInfo('Notification permission granted', {
          component: 'usePushNotifications',
          action: 'requestPermission',
        });
        return true;
      } else {
        logError('Notification permission denied', {
          component: 'usePushNotifications',
          action: 'requestPermission',
          additionalData: { permission: permissionResult },
        });
        return false;
      }
    } catch (error) {
      logError('Failed to request notification permission', {
        component: 'usePushNotifications',
        action: 'requestPermission',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }, [permission.isSupported]);

  // Get FCM token
  const getFCMToken = useCallback(async (): Promise<string | null> => {
    if (!permission.isSupported || !messaging) {
      return null;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        fcmTokenManager.saveToken(token);
        setPermission(prev => ({
          ...prev,
          token,
        }));
        logInfo('FCM token retrieved successfully', {
          component: 'usePushNotifications',
          action: 'getFCMToken',
        });
        return token;
      } else {
        logError('No FCM token available', {
          component: 'usePushNotifications',
          action: 'getFCMToken',
        });
        return null;
      }
    } catch (error) {
      logError('Failed to get FCM token', {
        component: 'usePushNotifications',
        action: 'getFCMToken',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, [permission.isSupported]);

  // Set up message listener
  useEffect(() => {
    if (!permission.isSupported || !messaging) {
      return;
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      logInfo('Foreground message received', {
        component: 'usePushNotifications',
        action: 'onMessage',
        additionalData: { payload },
      });

      // Handle foreground messages here
      // You can show a toast notification or update UI
      console.log('Foreground message:', payload);
    });

    return () => {
      unsubscribe();
    };
  }, [permission.isSupported]);

  return {
    permission,
    requestPermission,
    getToken: getFCMToken,
    isSupported: permission.isSupported,
  };
};
