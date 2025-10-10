```md
## Summary
The profile flow currently shows only Firebase Auth metadata and static copy, with no ability to persist editable fields beyond authentication data.

We need to introduce a Firestore-backed user profile layer, surface it through React context, and redesign the Profile page to let users maintain the richer fields outlined in the design guidelines (profile photo, name, fun facts, likes/dislikes, hobbies, etc.).

## Implementation Plan

### 1. Introduce a Firestore-backed user profile data layer
Create a typed Firestore integration that can create, read, and update `UserProfile` documents, and hook account lifecycle events so each authenticated user owns a corresponding profile record.

- Update `src/lib/firebase/index.ts` to initialize and export a Firestore instance alongside existing Auth exports (`getFirestore`, `doc`, `setDoc`, `onSnapshot`, etc.).
- Add a shared `UserProfile` interface (per the user-provided shape, extended with design-doc fields such as fun fact/likes/hobbies) in a new `src/types/user-profile.ts`, following the shared-type guidance in `Docs/Gemini.md`.
- Create `src/lib/firebase/user-profile.ts` that wraps Firestore access (e.g., `createUserProfile`, `subscribeToUserProfile`, `updateUserProfile`, `deleteUserProfile`) with strong typing and centralized error logging via `logError`.
- In `AuthProvider.signUpWithEmail`, call `createUserProfile` after account creation to seed the profile document with Auth metadata defaults; in `deleteUserAccount`, remove the matching Firestore document before deleting the auth user.

### 2. Provide a reusable user profile context and hook
Expose profile data, loading state, and mutation helpers across the app so Profile and future screens can consume Firestore state declaratively.

- Create `src/contexts/UserProfileContext.tsx` that subscribes to the Firestore document for the current `authState.user?.uid`, handles loading/error states, and exposes `profile`, `loading`, `error`, and `saveProfile` helpers.
- Add a companion hook `src/hooks/useUserProfile.ts` (mirroring `useAuth`) that retrieves the context and throws if used outside the provider.
- Wrap the router tree with `UserProfileProvider` in `src/App.tsx`, nesting it inside `AuthProvider` so it can react to sign-in/sign-out transitions while preserving the existing suspense and toaster structure.
- Ensure the provider cleans up Firestore listeners on unmount and when the user logs out to avoid memory leaks.

### 3. Redesign the Profile page UI for editable profile data
Refactor the page to use the new profile context, separate display vs. edit surfaces, and cover all customizable fields requested in the design brief.

- Replace `ProfileSection` so it renders `UserProfile` data (display name, email, createdAt, timezone) instead of raw `firebase.auth.User`; adjust props and tests accordingly.
- Introduce new molecule components (e.g., `profile-details-form.tsx`, `profile-preferences-form.tsx`, `profile-stats-card.tsx`) to handle editable fields like photo URL, fun fact, likes/dislikes, hobbies, notification toggles, and timezone, aligning with the fields listed in the design doc.
- Update `src/pages/profile.tsx` to consume `useUserProfile`, show loading/error states, render the new form components, and wire their submit handlers to `saveProfile`, while keeping existing sections (survey prompt, invite friend, account controls).
- Add optimistic UI feedback via `sonner` toasts on save success/failure and guard against concurrent submissions with disabled buttons/spinners following the established patterns in `account-controls`.

### 4. Testing, docs, and configuration updates
Guarantee quality through automated tests and keep documentation/configuration in sync with the new profile capabilities.

- Write unit tests for `UserProfileProvider`/`useUserProfile` (mocking Firestore) under `src/contexts/__tests__` or `src/hooks/__tests__`, plus component tests for the new profile form molecules verifying validation, rendering, and submission events.
- Extend `Docs/config.md` to document any new configurable strings, profile copy, or asset references introduced for the editable sections.
- Update `README.md` (or a new doc in `Docs/`) with setup notes for the Firestore profile collection (e.g., required indexes, local emulator tips) and mention the new profile customization workflow.
- Run `npm run lint`, `npm run test`, and `npm run build` locally to satisfy the mandatory verification steps outlined in `Docs/Gemini.md`.

## Testing
- ⚠️ `npm run test` (Not run — planning-only, read-only QA task)
```
