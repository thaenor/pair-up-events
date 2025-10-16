# PWA Setup Guide

This guide explains how to set up the Progressive Web App (PWA) functionality and Firebase Cloud Messaging for push notifications.

## PWA Features Implemented

- ✅ Web App Manifest
- ✅ Service Worker for offline functionality
- ✅ Push notifications via Firebase Cloud Messaging
- ✅ Install prompt for mobile and desktop
- ✅ Offline caching
- ✅ Background sync capabilities

## Firebase Cloud Messaging Setup

### 1. Enable Firebase Cloud Messaging

1. Go to your Firebase Console
2. Navigate to your project
3. Go to "Project Settings" > "Cloud Messaging" tab
4. Note down your Server Key (you'll need this for sending notifications)

### 2. Generate VAPID Keys

1. In Firebase Console, go to "Project Settings" > "Cloud Messaging" tab
2. Scroll down to "Web configuration"
3. Click "Generate key pair" under "Web push certificates"
4. Copy the key pair and add it to your environment variables

### 3. Environment Variables

Add these environment variables to your `.env` file:

```env
# Complete Firebase Configuration
# Get these values from Firebase Console > Project Settings > General > Your apps
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789

# Firebase Cloud Messaging VAPID Key
# Get this from Firebase Console > Project Settings > Cloud Messaging > Web push certificates
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

**Important**: Make sure you have ALL the Firebase configuration values, especially the `appId` which is required for Firebase Cloud Messaging to work properly.

### 4. Update Firebase Configuration

The Firebase configuration in `src/lib/firebase/config.ts` should include the messaging service. This is already set up in the code.

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
- Background sync
- Push notification handling
- Cache management

## Testing PWA Features

### 1. Install the App

1. Open the app in Chrome/Edge
2. Look for the install prompt or click the install button in the address bar
3. The PWA install prompt component will also appear

### 2. Test Push Notifications

1. Grant notification permissions when prompted
2. Use the Firebase Console to send test notifications
3. Or use the Firebase Admin SDK to send notifications programmatically

### 3. Test Offline Functionality

1. Install the PWA
2. Go offline (disable network in DevTools)
3. The app should still work with cached content

## Sending Push Notifications

### Using Firebase Console

1. Go to Firebase Console > Cloud Messaging
2. Click "Send your first message"
3. Enter notification details
4. Select target (all users or specific tokens)
5. Send the message

### Using Firebase Admin SDK (Server-side)

```javascript
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Send notification
const message = {
  notification: {
    title: 'New Event Available!',
    body: 'Check out the latest events in your area'
  },
  token: 'user_fcm_token_here'
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
```

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

### Push Notifications Not Working

1. Verify VAPID key is correctly set
2. Check notification permissions
3. Ensure Firebase project has Cloud Messaging enabled
4. Check browser console for FCM errors

### PWA Not Installable

1. Ensure manifest.json is valid
2. Check that all required icons are present
3. Verify HTTPS is enabled (required for PWA)
4. Check browser support for PWA features

## Security Considerations

- Always use HTTPS in production
- Validate notification payloads
- Implement proper authentication for notification endpoints
- Use secure token storage
- Regularly rotate VAPID keys

## Performance Optimization

- Implement proper cache strategies
- Use background sync for offline actions
- Optimize service worker bundle size
- Implement lazy loading for PWA features
