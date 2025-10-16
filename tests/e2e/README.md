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

- Full signup flow
- Login with credentials
- Logout functionality
- Session persistence across reloads
- Session sharing across tabs
- Error handling for invalid credentials
- Error handling for duplicate emails
- Console error monitoring

## Test Account Cleanup

Tests use the Firebase Auth Emulator, so accounts are automatically cleaned up when the emulator stops. No manual cleanup required.

## Test Files

- `auth.spec.ts` - Comprehensive authentication flow tests
- `sidebar.spec.ts` - Sidebar navigation and interaction tests
- `account-management.spec.ts` - Account management features (password reset, account deletion)
- `test-helpers.ts` - Shared test constants and utilities
