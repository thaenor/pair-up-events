# Firebase Setup

This guide covers the minimum steps to get a Firebase project wired up for local development and deployment of Pair Up Events.

---

## 1. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add project**.
2. Enter a project name, optionally enable Google Analytics, then click **Create project**.
3. Once the project is created, click **Add app** → **Web** (`</>`), register a nickname, and click **Register app**.
4. Copy the config snippet — you will need these values for `.env.local`.

---

## 2. Enable Authentication providers

Go to **Authentication → Sign-in method** and enable the following providers:

### Email/Password
- Toggle **Email/Password** to **Enabled**.
- Email link (passwordless) is optional — the app does not use it.

### Google
- Toggle **Google** to **Enabled**.
- Set a **Project support email**.
- The OAuth client is created automatically.

### Facebook
- Toggle **Facebook** to **Enabled**.
- Enter your **App ID** and **App Secret** from [Meta for Developers](https://developers.facebook.com/).
- Copy the **OAuth redirect URI** shown in the Firebase console (see [Section 6](#6-oauth-redirect-uris)).

> **Note:** Apple sign-in is **not** implemented in this project. Do not enable it.

---

## 3. Set up Firestore database

1. In the Firebase console, go to **Firestore Database → Create database**.
2. Choose **Start in test mode** for local development (tighten rules before going to production).
3. Select a Cloud Firestore location and click **Enable**.

---

## 4. Configure Firebase Storage

1. Go to **Storage → Get started**.
2. Accept the default security rules for now (tighten before production).
3. Select a storage location (should match or be near your Firestore region) and click **Done**.

---

## 5. Environment variables

Copy `.env.example` to `.env.local` and fill in the values from the Firebase console.

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Project Settings → Your apps → SDK config → `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | SDK config → `authDomain` (format: `<project-id>.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | SDK config → `projectId` (also visible in the URL bar) |
| `VITE_FIREBASE_APP_ID` | SDK config → `appId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | SDK config → `storageBucket` |
| `VITE_SENTRY_DSN` | Sentry → Settings → Projects → Client Keys (DSN) |
| `VITE_RECAPTCHA_SITE_KEY` | [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin) → your site → Settings |
| `VITE_APP_VERSION` | Any version string you choose, e.g. `1.0.0` |
| `VITE_USE_EMULATOR` | Set to `false` to skip emulators; omit or set to `true` for local emulator mode |

To access Project Settings in the Firebase console, click the gear icon next to **Project Overview**.

---

## 6. OAuth redirect URIs

### Google
Firebase manages the Google OAuth redirect automatically using `VITE_FIREBASE_AUTH_DOMAIN`. No manual redirect URI configuration is needed in Google Cloud Console for standard web sign-in.

### Facebook
1. In the Firebase console, go to **Authentication → Sign-in method → Facebook** and copy the **OAuth redirect URI** (format: `https://<project-id>.firebaseapp.com/__/auth/handler`).
2. In [Meta for Developers](https://developers.facebook.com/), open your app → **Facebook Login → Settings**.
3. Paste the URI into **Valid OAuth Redirect URIs** and save.

For local development with the emulator, the redirect URI is handled automatically; no additional Facebook configuration is needed.

---

## 7. Local emulator setup

The app connects to the Firebase Local Emulator Suite automatically when running on `localhost` (unless `VITE_USE_EMULATOR=false`). Emulator ports:

| Service | Port |
|---|---|
| Auth | 9099 |
| Firestore | 8081 |
| Storage | 9199 |

Start all three emulators with:

```bash
npm run emulator:start
```

Then in a separate terminal start the dev server as usual:

```bash
npm run dev
```

To develop against live Firebase instead of emulators (e.g. to test OAuth flows), use:

```bash
npm run dev:live
```

or set `VITE_USE_EMULATOR=false` in `.env.local`.

### App Check in development

App Check debug mode is enabled automatically in `DEV` builds. A debug token is printed to the browser console on first load. Register that token in **Firebase Console → App Check → Apps → Manage debug tokens** to allow your local environment to pass App Check.
