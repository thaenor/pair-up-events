import { logInfo, logError } from '@/utils/logger';

const FCM_TOKEN_KEY = 'fcm_token';
const FCM_TOKEN_EXPIRY_KEY = 'fcm_token_expiry';

export interface FCMTokenData {
  token: string;
  timestamp: number;
  expiry: number;
}

export class FCMTokenManager {
  private static instance: FCMTokenManager;
  private tokenData: FCMTokenData | null = null;

  private constructor() {
    this.loadTokenFromStorage();
  }

  static getInstance(): FCMTokenManager {
    if (!FCMTokenManager.instance) {
      FCMTokenManager.instance = new FCMTokenManager();
    }
    return FCMTokenManager.instance;
  }

  private loadTokenFromStorage(): void {
    try {
      const token = localStorage.getItem(FCM_TOKEN_KEY);
      const expiry = localStorage.getItem(FCM_TOKEN_EXPIRY_KEY);
      
      if (token && expiry) {
        const expiryTime = parseInt(expiry, 10);
        const now = Date.now();
        
        if (now < expiryTime) {
          this.tokenData = {
            token,
            timestamp: now,
            expiry: expiryTime,
          };
        } else {
          // Token expired, remove from storage
          this.clearToken();
        }
      }
    } catch (error) {
      logError('Failed to load FCM token from storage', {
        component: 'FCMTokenManager',
        action: 'loadTokenFromStorage',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  saveToken(token: string): void {
    try {
      const now = Date.now();
      const expiry = now + (60 * 24 * 60 * 60 * 1000); // 60 days from now
      
      this.tokenData = {
        token,
        timestamp: now,
        expiry,
      };
      
      localStorage.setItem(FCM_TOKEN_KEY, token);
      localStorage.setItem(FCM_TOKEN_EXPIRY_KEY, expiry.toString());
      
      logInfo('FCM token saved successfully', {
        component: 'FCMTokenManager',
        action: 'saveToken',
      });
    } catch (error) {
      logError('Failed to save FCM token', {
        component: 'FCMTokenManager',
        action: 'saveToken',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  getToken(): string | null {
    if (this.tokenData && Date.now() < this.tokenData.expiry) {
      return this.tokenData.token;
    }
    
    // Token expired or doesn't exist
    this.clearToken();
    return null;
  }

  clearToken(): void {
    try {
      this.tokenData = null;
      localStorage.removeItem(FCM_TOKEN_KEY);
      localStorage.removeItem(FCM_TOKEN_EXPIRY_KEY);
      
      logInfo('FCM token cleared', {
        component: 'FCMTokenManager',
        action: 'clearToken',
      });
    } catch (error) {
      logError('Failed to clear FCM token', {
        component: 'FCMTokenManager',
        action: 'clearToken',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  isTokenValid(): boolean {
    return this.tokenData !== null && Date.now() < this.tokenData.expiry;
  }

  getTokenAge(): number | null {
    if (this.tokenData) {
      return Date.now() - this.tokenData.timestamp;
    }
    return null;
  }
}

// Export singleton instance
export const fcmTokenManager = FCMTokenManager.getInstance();
