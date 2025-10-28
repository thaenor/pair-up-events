# PairUp Events - TODO List

## High Priority

### Authentication

- [x] **Password Reset Flow** - Implement complete password reset functionality
  - Show modal to prompt user for email confirmation
  - Integrate with useAuth.resetPassword() hook
  - Display success/error toasts
  - Location: src/components/molecules/Auth/account-controls.tsx

- [x] **Account Deletion** - Implement full account deletion workflow
  - Delete Firebase Auth user
  - Clean up Firestore user document and related data
  - Sign out and redirect after deletion
  - Location: src/components/molecules/Auth/account-controls.tsx

### Firestore Integration

- [ ] **User Profile Creation** - Save profile data during signup
  - Create src/lib/firebase/userProfile.ts service
  - Store firstName, lastName, birthDate, gender to users/{userId}
  - Integrate with signup flow
  - Location: src/components/molecules/Auth/email-signup-form.tsx

- [ ] **Profile Picture Upload** - Implement photo upload to Firebase Storage
  - Create upload function in userProfile service
  - Handle image compression and validation
  - Update photoUrl in Firestore
  - Location: src/pages/profile.tsx (ProfilePictureUpload component)

- [ ] **Profile Details Save** - Persist user profile details
  - Create or update user document in Firestore
  - Handle validation and error states
  - Show success/error feedback
  - Location: src/pages/profile.tsx (ProfileDetailsForm component)

- [ ] **Profile Preferences Save** - Persist user preferences
  - Save preferences object to Firestore
  - Update age range, vibes, connection intentions
  - Location: src/pages/profile.tsx (ProfilePreferencesForm component)

## Medium Priority

### other

- [ ] Offline Auth State - Cache auth for service outages

### Code Quality

- [x] Add unit tests for useRequireAuth hook
- [x] Add integration tests for auth state changes
- [x] **Implement error boundaries for auth failures** - Enhanced authentication error handling
  - Created AuthErrorBoundary component with retry mechanisms
  - Enhanced useAuth hook with error recovery for auth state corruption
  - Added auth-specific error UI components with better messaging
  - Implemented network retry logic with exponential backoff
  - Integrated all error handling components into authentication flow
  - Removed misaligned E2E test "Auth error boundary displays for authentication failures"
  - Location: src/components/AuthErrorBoundary.tsx, src/hooks/useAuth.ts, src/components/molecules/Auth/
- [ ] Add rate limiting for signup/login attempts

### Security

- [ ] Add CAPTCHA for production signup/login forms
- [ ] Implement session timeout and refresh logic
- [ ] Add security rules for Firestore user collection

## Notes

- All high-priority items should be completed before moving to medium priority
- Authentication items should be tackled before Firestore integration
- Each item should have comprehensive error handling and user feedback
