# GitHub Secrets Setup for Firebase

## Step 1: Access Repository Settings

1. Go to your repository on **GitHub.com**
2. Click on **"Settings"** tab (top navigation)
3. In the left sidebar, click **"Secrets and variables"**
4. Click **"Actions"**

## Step 2: Add Firebase Secrets

Click **"New repository secret"** for each of these:

### Secret 1: Firebase API Key
- **Name**: `VITE_FIREBASE_API_KEY`
- **Value**: Your Firebase API key (from Firebase Console → Project Settings → Web App)

### Secret 2: Firebase Auth Domain
- **Name**: `VITE_FIREBASE_AUTH_DOMAIN`
- **Value**: `your-project-id.firebaseapp.com` (replace with your actual project ID)

### Secret 3: Firebase Project ID
- **Name**: `VITE_FIREBASE_PROJECT_ID`
- **Value**: Your Firebase project ID (from Firebase Console)

### Secret 4: Firebase App ID
- **Name**: `VITE_FIREBASE_APP_ID`
- **Value**: Your Firebase App ID (from Firebase Console → Project Settings → Web App)

### Secret 5: Firebase Measurement ID
- **Name**: `VITE_FIREBASE_MEASUREMENT_ID`
- **Value**: Your Firebase Measurement ID (from Firebase Console → Project Settings → Web App)

### Secret 6: Firebase Messaging Sender ID
- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value**: Your Firebase Messaging Sender ID (from Firebase Console → Project Settings → Web App)

### Secret 7: Firebase Storage Bucket
- **Name**: `VITE_FIREBASE_STORAGE_BUCKET`
- **Value**: Your Firebase Storage Bucket (from Firebase Console → Project Settings → Web App)

### Secret 8: Firebase VAPID Key
- **Name**: `VITE_FIREBASE_VAPID_KEY`
- **Value**: Your Firebase VAPID Key (from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates)

### Secret 9: Sentry DSN (Error Tracking)
- **Name**: `VITE_SENTRY_DSN`
- **Value**: Your Sentry DSN (from Sentry.io → Project Settings → Client Keys)

## Step 3: Verify Setup

After adding all secrets, you should see:
- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_AUTH_DOMAIN`
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `VITE_FIREBASE_APP_ID`
- ✅ `VITE_FIREBASE_MEASUREMENT_ID`
- ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `VITE_FIREBASE_STORAGE_BUCKET`
- ✅ `VITE_FIREBASE_VAPID_KEY`
- ✅ `VITE_SENTRY_DSN`

## Step 4: Test Deployment

1. Push your changes to the `main` branch
2. Go to **"Actions"** tab in your repository
3. Watch the deployment workflow run
4. Check that the build step includes your environment variables

## Security Notes

- ✅ Secrets are encrypted and only accessible during workflow runs
- ✅ Secrets are not visible in logs or pull requests
- ✅ Only repository admins can manage secrets
- ✅ Each secret is masked in workflow logs

## Troubleshooting

### Build Fails with "Missing Firebase environment variables"
- Double-check secret names match exactly (case-sensitive)
- Ensure all 9 secrets are added (Firebase + Sentry)
- Verify secret values are correct

### Firebase Authentication Not Working in Production
- Check that your Firebase project allows your domain
- Verify OAuth redirect URIs include your production domain
- Ensure Firebase project is properly configured

## Next Steps

Once secrets are set up:
1. Your deployment will automatically use Firebase
2. OAuth will work in production
3. Error tracking with Sentry will be enabled
4. No need to manually set environment variables
