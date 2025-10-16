# Firebase Configuration Troubleshooting

## Error: "Missing App configuration value: appId"

This error occurs when the Firebase configuration is incomplete. Here's how to fix it:

### 1. Get Complete Firebase Configuration

1. Go to your Firebase Console
2. Navigate to **Project Settings** (gear icon)
3. Scroll down to **Your apps** section
4. If you don't have a web app, click **Add app** and select the web icon
5. Copy the complete configuration object

### 2. Required Environment Variables

Make sure your `.env` file contains ALL these variables:

```env
# Complete Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789

# VAPID Key for Push Notifications
VITE_FIREBASE_VAPID_KEY=your_vapid_key_here
```

### 3. Firebase Configuration Object

Your Firebase config should look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  appId: "1:123456789:web:abcdef123456",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789"
};
```

### 4. Common Issues and Solutions

#### Issue: Missing appId
**Solution**: Add `VITE_FIREBASE_APP_ID` to your environment variables

#### Issue: Missing storageBucket
**Solution**: Add `VITE_FIREBASE_STORAGE_BUCKET` to your environment variables

#### Issue: Missing messagingSenderId
**Solution**: Add `VITE_FIREBASE_MESSAGING_SENDER_ID` to your environment variables

#### Issue: Content Security Policy blocking Firebase
**Solution**: Make sure the CSP in `index.html` includes Firebase domains:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self'; 
  connect-src 'self' https://*.googleapis.com https://www.gstatic.com https://fcm.googleapis.com;
  script-src 'self' 'unsafe-inline' https://www.gstatic.com;
" />
```

### 5. Verify Configuration

1. Check that all environment variables are loaded:
   ```javascript
   console.log('Firebase Config:', {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
   });
   ```

2. Restart your development server after adding environment variables:
   ```bash
   npm run dev
   ```

### 6. Firebase Console Setup

1. **Enable Cloud Messaging**:
   - Go to Firebase Console > Project Settings
   - Click on "Cloud Messaging" tab
   - Make sure Cloud Messaging is enabled

2. **Generate VAPID Key**:
   - In Cloud Messaging tab, scroll to "Web configuration"
   - Click "Generate key pair" under "Web push certificates"
   - Copy the key and add it as `VITE_FIREBASE_VAPID_KEY`

3. **Verify App Registration**:
   - Make sure your web app is registered in Firebase Console
   - Check that the appId matches your environment variable

### 7. Testing

After fixing the configuration:

1. Clear browser cache and reload
2. Check browser console for any remaining errors
3. Test Firebase authentication (if using)
4. Test push notification permissions

### 8. Still Having Issues?

1. **Check Network Tab**: Look for failed requests to Firebase services
2. **Check Console**: Look for specific Firebase error messages
3. **Verify Environment**: Make sure you're using the correct `.env` file
4. **Check Build**: Run `npm run build` to ensure no build errors

The most common cause of the "Missing App configuration value: appId" error is simply missing the `VITE_FIREBASE_APP_ID` environment variable. Make sure you have all the required Firebase configuration values in your `.env` file.
