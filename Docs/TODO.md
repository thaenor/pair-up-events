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

### Code Quality

- [ ] Add unit tests for useRequireAuth hook
- [ ] Add integration tests for auth state changes
- [ ] Implement error boundaries for auth failures
- [ ] Add rate limiting for signup/login attempts

### Security

- [ ] Add CAPTCHA for production signup/login forms
- [ ] Implement session timeout and refresh logic
- [ ] Add security rules for Firestore user collection

## Notes

- All high-priority items should be completed before moving to medium priority
- Authentication items should be tackled before Firestore integration
- Each item should have comprehensive error handling and user feedback
