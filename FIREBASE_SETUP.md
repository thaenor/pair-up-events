# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `pair-up-events` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Google**: Click "Google" → Enable → Add your project support email
   - **Apple**: Click "Apple" → Enable → Add your Apple Developer Team ID and Key ID
   - **Facebook**: Click "Facebook" → Enable → Add your Facebook App ID and App Secret
   - **Email/Password**: Click "Email/Password" → Enable both options

## Step 3: Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</> icon)
4. Register your app with a nickname (e.g., "PairUp Events Web")
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase configuration in `.env.local` (minimal setup for OAuth only):
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_actual_project_id
   ```

## Step 5: Configure OAuth Redirects

### Google OAuth
- In Google Cloud Console, add authorized redirect URIs:
  - `http://localhost:8080` (development)
  - `https://yourdomain.com` (production)

### Facebook OAuth
- In Facebook Developer Console, add valid OAuth redirect URIs:
  - `http://localhost:8080` (development)
  - `https://yourdomain.com` (production)

### Apple OAuth
- In Apple Developer Console, add redirect URIs:
  - `http://localhost:8080` (development)
  - `https://yourdomain.com` (production)

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth` (when we implement it in Step 2)
3. Test each OAuth provider

## Project Structure

The Firebase integration is organized in `src/lib/firebase/`:
- `config.ts` - Firebase configuration and validation
- `index.ts` - Firebase initialization and exports
- `types.ts` - TypeScript types using Firebase's built-in types

## Next Steps

After completing this setup, you'll be ready for:
- Step 2: OAuth Integration (replacing static buttons with functional ones)
- Step 3: User Experience (loading states, error handling)

## Troubleshooting

### Common Issues:
1. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to Firebase Auth authorized domains

2. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your `.env.local` file has the correct API key

3. **OAuth popup blocked**
   - Ensure popups are allowed for your domain
   - Check browser console for specific error messages

### Development Tips:
- Use Firebase Emulator Suite for local development
- Check Firebase Console for authentication logs
- Use browser dev tools to inspect network requests
