/**
 * Google Analytics / Google Tag Manager utilities
 * Provides a clean interface for tracking events and page views
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

// Google Analytics Measurement ID from environment or default
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-VLKL39B635';

// Check if analytics is available and working
export const isAnalyticsAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check if gtag is available
  if (typeof window.gtag === 'function') return true;
  
  // Check if dataLayer is available (GTM fallback)
  if (window.dataLayer && Array.isArray(window.dataLayer)) return true;
  
  return false;
};

/**
 * Initialize Google Analytics tracking
 * This should be called after GTM is loaded
 */
export const initializeAnalytics = (): void => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    // GTM is already loaded, analytics is ready
    return;
  }
  
  // If gtag is not available, we'll wait for GTM to load it
  if (typeof window !== 'undefined' && !window.dataLayer) {
    window.dataLayer = [];
  }
};

/**
 * Track a custom event
 * @param eventName - The name of the event
 * @param parameters - Additional parameters for the event
 */
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Use gtag if available (loaded by GTM)
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    } else if (window.dataLayer) {
      // Fallback to dataLayer push for GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...parameters,
      });
    } else {
      // Analytics not available - log for debugging but don't throw
      console.log('Analytics not available for event:', eventName, parameters);
    }
  } catch (error) {
    // Silently handle analytics errors to prevent app crashes
    console.log('Analytics tracking failed:', error);
  }
};

/**
 * Track page views
 * @param pagePath - The path of the page being viewed
 * @param pageTitle - The title of the page
 */
export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    } else if (window.dataLayer) {
      // Fallback to dataLayer push for GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'page_view',
        page_path: pagePath,
        page_title: pageTitle,
      });
    } else {
      // Analytics not available - log for debugging but don't throw
      console.log('Analytics not available for page view:', pagePath, pageTitle);
    }
  } catch (error) {
    // Silently handle analytics errors to prevent app crashes
    console.log('Analytics page view tracking failed:', error);
  }
};

/**
 * Track user authentication events
 * @param action - The authentication action (login, signup, logout)
 * @param method - The authentication method (email, google, etc.)
 */
export const trackAuthEvent = (action: 'login' | 'signup' | 'logout', method?: string): void => {
  trackEvent('auth_event', {
    event_category: 'authentication',
    event_label: action,
    method: method || 'unknown',
  });
};

/**
 * Track profile-related events
 * @param action - The profile action (update, view, etc.)
 * @param field - The specific field being updated (optional)
 */
export const trackProfileEvent = (action: 'update' | 'view', field?: string): void => {
  trackEvent('profile_event', {
    event_category: 'profile',
    event_label: action,
    field: field || 'general',
  });
};

/**
 * Track form interactions
 * @param formName - The name of the form
 * @param action - The form action (submit, error, etc.)
 */
export const trackFormEvent = (formName: string, action: 'submit' | 'error' | 'start'): void => {
  trackEvent('form_event', {
    event_category: 'form',
    event_label: formName,
    action: action,
  });
};

