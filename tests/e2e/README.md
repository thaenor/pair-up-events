# E2E Tests

## Running Tests

### Prerequisites

Before running E2E tests, you must have the following services running:

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Start the preview server** (runs on port 8080):

   ```bash
   npm run preview
   ```

3. **Start Firebase Auth Emulator** (runs on port 9099):
   ```bash
   npm run emulator:start
   ```

### Running Tests

Once both servers are running, execute tests:

```bash
npm run test:e2e
```

This command:

- Runs all E2E tests sequentially
- Uses shared browser context for account/session reuse
- Expects app at `http://localhost:8080` and Firebase emulator at `http://localhost:9099`

### HTML Reports

To generate HTML reports for debugging:

```bash
E2E_REPORT=html npm run test:e2e
```

## Test Coverage

### Happy Path Flow (`e2e-flow.spec.ts`)

- Public page validation (landing, login)
- Security validation (protected page redirects, public page accessibility)
- Account registration
- Session persistence (reload, tabs)
- Enhanced sidebar functionality (open/close, ESC, backdrop, accessibility)
- Page navigation (Events, Events Create, Messenger, Settings, Invite, Contact Us, About, Terms of Service, Privacy Policy with screenshots)
- Sidebar navigation to all pages
- Account management features (password reset modal, account controls visibility)
- Logout and re-authentication

### Error Handling (`auth-error-handling.spec.ts`)

- Login with invalid credentials shows error
- Signup with existing email shows error

## Test Execution

Tests run sequentially using a shared browser context for account/session reuse. The first test creates an account, and subsequent tests reuse that authenticated session, making tests faster and more realistic.

## Test Files

- `e2e-flow.spec.ts` - Happy path flow (~40 tests)
- `auth-error-handling.spec.ts` - Error handling (2 tests)
- `helpers.ts` - Shared test utilities
- `constants.ts` - Test timeout constants
