# Unit Test Coverage

This document outlines the comprehensive unit test coverage for authentication error handling components.

## Test Files

### Hook Tests

- `src/hooks/__tests__/useAuth.test.ts` - Comprehensive tests for the enhanced useAuth hook

### Component Tests

- `src/components/__tests__/AuthErrorBoundary.test.tsx` - Tests for the auth-specific error boundary
- `src/components/molecules/Auth/__tests__/AuthErrorDisplay.test.tsx` - Tests for error display component
- `src/components/molecules/Auth/__tests__/NetworkStatus.test.tsx` - Tests for network status indicator

## Test Coverage Details

### useAuth Hook Tests (`useAuth.test.ts`)

**Initial State Tests**:

- ✅ Initializes with loading true and no user
- ✅ Sets up auth state listener on mount
- ✅ Cleans up auth listener on unmount

**Authentication State Changes**:

- ✅ Updates user when auth state changes
- ✅ Handles auth state errors gracefully

**Login Function Tests**:

- ✅ Returns success when login succeeds
- ✅ Returns error when login fails
- ✅ Returns error when auth is not configured
- ✅ Handles various Firebase error codes

**Signup Function Tests**:

- ✅ Returns success when signup succeeds
- ✅ Returns error when signup fails
- ✅ Handles duplicate email errors

**Logout Function Tests**:

- ✅ Returns success when logout succeeds
- ✅ Returns error when logout fails
- ✅ Handles network errors with retry flag

**Reset Password Function Tests**:

- ✅ Returns success when reset succeeds
- ✅ Returns error when reset fails
- ✅ Handles user not found errors

**Error Handling Tests**:

- ✅ Clears auth error when clearError is called
- ✅ Retries auth state when retryAuthState is called

**Retry Logic Tests**:

- ✅ Retries network errors with exponential backoff
- ✅ Does not retry non-retryable errors
- ✅ Respects maximum retry attempts

### AuthErrorBoundary Tests (`AuthErrorBoundary.test.tsx`)

**Error Catching Tests**:

- ✅ Catches errors and displays fallback UI
- ✅ Does not display fallback UI when no error occurs

**Custom Fallback Tests**:

- ✅ Uses custom fallback component when provided

**Retry Functionality Tests**:

- ✅ Retries when retry button is clicked
- ✅ Shows retry count when retrying
- ✅ Disables retry after max attempts

**Navigation Tests**:

- ✅ Navigates to home when home button is clicked
- ✅ Navigates to login when login button is clicked

**Error Type Tests**:

- ✅ Displays network error UI for network errors
- ✅ Displays auth error UI for auth errors

**Error Handler Callback Tests**:

- ✅ Calls onError callback when error occurs

**Development Mode Tests**:

- ✅ Shows error details in development mode
- ✅ Does not show error details in production mode

### AuthErrorDisplay Tests (`AuthErrorDisplay.test.tsx`)

**Error Type Display Tests**:

- ✅ Displays network error with correct styling and icon
- ✅ Displays auth error with correct styling and icon
- ✅ Displays config error with correct styling and icon
- ✅ Displays unknown error with correct styling and icon

**Retry Functionality Tests**:

- ✅ Shows retry button for retryable errors
- ✅ Does not show retry button for non-retryable errors
- ✅ Calls onRetry when retry button is clicked
- ✅ Does not show retry button when showRetry is false

**Clear Functionality Tests**:

- ✅ Shows dismiss button when onClear is provided
- ✅ Does not show dismiss button when onClear is not provided
- ✅ Calls onClear when dismiss button is clicked

**Styling and CSS Tests**:

- ✅ Applies custom className when provided
- ✅ Has correct base CSS classes

**Accessibility Tests**:

- ✅ Has proper ARIA attributes
- ✅ Has proper text content for screen readers

### NetworkStatus Tests (`NetworkStatus.test.tsx`)

**Online State Tests**:

- ✅ Shows online indicator when navigator.onLine is true
- ✅ Shows online indicator with correct styling

**Offline State Tests**:

- ✅ Shows offline indicator when navigator.onLine is false
- ✅ Shows offline message when showOfflineMessage is true
- ✅ Does not show offline message when showOfflineMessage is false
- ✅ Auto-hides offline message after 5 seconds

**Event Listener Tests**:

- ✅ Adds online and offline event listeners on mount
- ✅ Removes event listeners on unmount

**SSR Compatibility Tests**:

- ✅ Handles missing window object gracefully
- ✅ Handles missing navigator object gracefully

**Custom Styling Tests**:

- ✅ Applies custom className when provided
- ✅ Has correct positioning classes

**Accessibility Tests**:

- ✅ Has proper text content for screen readers
- ✅ Has proper text content for offline state

## Running Unit Tests

```bash
# Run all unit tests
npm run test

# Run specific test file
npm run test useAuth.test.ts

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Test Configuration

Tests are configured using:

- **Vitest** - Test runner and framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **Firebase mocking** - Complete Firebase Auth and Firestore mocking

## Mocking Strategy

### Firebase Mocking

- Complete Firebase Auth service mocking
- Firestore database mocking
- Auth state change simulation
- Error simulation for various scenarios

### React Router Mocking

- Navigation function mocking
- Location and params mocking

### Component Mocking

- Button component mocking for consistent testing
- Icon component mocking

## Coverage Goals

- **Statements**: 95%+
- **Branches**: 90%+
- **Functions**: 95%+
- **Lines**: 95%+

## Test Quality Standards

- **Descriptive test names** - Clear indication of what is being tested
- **Arrange-Act-Assert pattern** - Consistent test structure
- **Comprehensive error scenarios** - All error paths covered
- **Accessibility testing** - ARIA attributes and screen reader compatibility
- **Edge case coverage** - SSR, missing objects, network failures
- **Mock cleanup** - Proper cleanup after each test
