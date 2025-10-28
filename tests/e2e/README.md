# E2E Authentication Tests

## Running Tests

### With Firebase Emulator (Recommended)

```bash
npm run test:e2e:emulator
```

### Manual Setup

1. Start Firebase Emulator:

   ```bash
   npm run emulator:start
   ```

2. Start dev server:

   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npx playwright test tests/e2e/auth.spec.ts
   ```

## Test Coverage

### Authentication Flow Tests (`auth.spec.ts`)

- Full signup flow
- Login with credentials
- Logout functionality
- Session persistence across reloads
- Session sharing across tabs
- Error handling for invalid credentials
- Error handling for duplicate emails
- Console error monitoring
- **NEW**: Retry button visibility for error types

### Authentication Error Handling Tests (`auth-error-handling.spec.ts`)

- **NEW**: Network error handling with retry mechanism
- **NEW**: Auth error boundary display and functionality
- **NEW**: Invalid credentials error UI validation
- **NEW**: Duplicate email signup error UI validation
- **NEW**: Network status indicator (online/offline)
- **NEW**: Retry mechanism for network failures
- **NEW**: Error boundary navigation (Home/Login)
- **NEW**: Console error monitoring during error scenarios

### Page Snapshot Tests (`page-snapshots.spec.ts`)

- Full-page screenshots for visual regression
- Console error monitoring
- Authentication flow validation for protected pages
- Protected page redirect validation

### Account Management Tests (`account-management.spec.ts`)

- Password reset functionality
- Account deletion workflow
- Profile management features

### Sidebar Tests (`sidebar.spec.ts`)

- Sidebar navigation and interaction
- Mobile responsiveness
- User menu functionality

## Test Account Cleanup

Tests use the Firebase Auth Emulator, so accounts are automatically cleaned up when the emulator stops. No manual cleanup required.

## Test Files

- `auth.spec.ts` - Comprehensive authentication flow tests
- `auth-error-handling.spec.ts` - **NEW** Authentication error handling and recovery tests
- `sidebar.spec.ts` - Sidebar navigation and interaction tests
- `account-management.spec.ts` - Account management features (password reset, account deletion)
- `page-snapshots.spec.ts` - Visual regression tests for all pages
- `test-helpers.ts` - Shared test constants and utilities
