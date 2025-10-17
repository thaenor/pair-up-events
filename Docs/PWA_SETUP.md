# PWA Setup Guide

This guide explains how to set up the Progressive Web App (PWA) functionality for offline caching and installability.

## PWA Features Implemented

- ✅ Web App Manifest
- ✅ Service Worker for offline functionality
- ✅ Install prompt for mobile and desktop
- ✅ Offline caching

## Firebase Setup

### Environment Variables

Add these environment variables to your `.env` file:

```env
# Complete Firebase Configuration
# Get these values from Firebase Console > Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
```

**Note**: No VAPID key or messaging configuration is needed for the current PWA implementation.

## PWA Icons

The PWA uses the existing logo files:
- `/PUE_logo.png` - Main app icon
- `/PUE_logo_transparent.png` - Alternative icon

For better PWA support, consider creating specific icon sizes:
- 192x192px
- 512x512px
- 180x180px (Apple touch icon)

## Service Worker

The service worker (`/public/sw.js`) handles:
- Offline caching of static assets
- Cache management
- Offline fallback functionality

## Testing PWA Features

### 1. Install the App

1. Open the app in Chrome/Edge
2. Look for the install prompt or click the install button in the address bar

### 2. Test Offline Functionality

1. Install the PWA
2. Go offline (disable network in DevTools)
3. The app should still work with cached content


## PWA Manifest Configuration

The manifest file (`/public/manifest.json`) includes:
- App name and description
- Icons and theme colors
- Display mode (standalone)
- Start URL and scope
- Shortcuts for quick actions

## Browser Support

- ✅ Chrome/Edge (full PWA support)
- ✅ Firefox (basic PWA support)
- ✅ Safari (limited PWA support)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Service Worker Not Registering

1. Check browser console for errors
2. Ensure the service worker file is accessible at `/sw.js`
3. Check Content Security Policy settings


### PWA Not Installable

1. Ensure manifest.json is valid
2. Check that all required icons are present
3. Verify HTTPS is enabled (required for PWA)
4. Check browser support for PWA features

## Security Considerations

- Always use HTTPS in production
- Implement proper authentication for API endpoints
- Use secure token storage

## Performance Optimization

- Implement proper cache strategies
- Optimize service worker bundle size
- Implement lazy loading for PWA features
