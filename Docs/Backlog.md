# PairUp Events - Backlog

## High Priority

### ~~Auth Race Condition in User Service~~ ✅ RESOLVED

**Location**: `src/entities/user/user-service.ts`
**Issue**: Direct `auth?.currentUser?.uid` access in async functions can cause race conditions if user logs out mid-operation
**Fix**: Made `currentUserId` parameter required in all user service functions to enforce explicit passing from authenticated context
**Resolution**: Updated `createPrivateUserData`, `createPublicUserData`, `savePrivateUserData`, and `savePublicUserData` to require `currentUserId` parameter, eliminating race condition risk

### E2E Test Network Idle Timeout

**Location**: `tests/e2e/e2e-flow.spec.ts:86,109`
**Issue**: `waitForLoadState('networkidle')` times out due to GTM and long-lived connections
**Fix**: Block GTM requests in E2E tests and replace with element-based waiting strategy
**Impact**: E2E tests timing out, preventing reliable test execution

## Medium Priority

### Email Change User Feedback

**Location**: `src/pages/profile.tsx:85-87`
**Issue**: Uses `console.warn` for email change attempts - users don't see feedback in UI
**Fix**: Replace with user-facing toast notification explaining email changes require re-authentication
**Impact**: Users won't understand why email changes aren't working

### Bundle Size Optimization

**Location**: `vite.config.ts`
**Issue**: Main bundle is 760KB (201.75KB gzipped), exceeds recommended 500KB threshold
**Fix**: Implement route-based code splitting and vendor chunk optimization
**Impact**: Affects initial load performance and Time to Interactive metrics

### Placeholder Email Documentation

**Location**: `src/entities/user/user-service.ts:66`
**Issue**: Placeholder emails for other users' profiles could cause confusion if logged/debugged
**Enhancement**: Add explicit documentation/comments explaining this is intentional and should never be displayed
**Impact**: Low - works for current use case but could be clearer

### Rate Limiting for Auth Attempts

**Location**: `src/components/molecules/Auth/email-login-form.tsx`, `src/components/molecules/Auth/email-signup-form.tsx`
**Issue**: No rate limiting on signup/login attempts to prevent abuse
**Fix**: Implement rate limiting (should be in Firebase Auth settings) or add client-side throttling
**Impact**: Security risk - vulnerable to brute force attacks

### Offline Auth State Caching

**Location**: `src/hooks/useAuth.ts`
**Issue**: No caching mechanism for auth state during service outages
**Fix**: Cache auth state in localStorage/sessionStorage with expiration logic
**Impact**: Poor UX during Firebase service interruptions

## Low Priority

### CAPTCHA for Production

**Location**: `src/components/molecules/Auth/email-signup-form.tsx`, `src/components/molecules/Auth/email-login-form.tsx`
**Enhancement**: Add reCAPTCHA for production to prevent automated signups and bot attacks
**Impact**: Security improvement for production deployment

### Session Timeout and Refresh Logic

**Location**: `src/hooks/useAuth.ts`
**Enhancement**: Implement automatic session timeout and token refresh logic
**Impact**: Better session management and security

### Firestore Security Rules for User Collection

**Location**: `firebase/firestore.rules`
**Enhancement**: Add explicit security rules for Firestore user collection (may already exist - needs verification)
**Impact**: Ensure proper access control for user data
