# Testing Guide

## Current Strategy

| Layer      | Tool                                | Status                                                          |
| ---------- | ----------------------------------- | --------------------------------------------------------------- |
| Unit tests | Vitest                              | Active — co-located under `__tests__/` next to each source file |
| E2E tests  | Playwright + Firebase Auth Emulator | Active — `tests/e2e/`                                           |
| Pre-commit | Husky                               | Runs `npm run ci` (format + lint + typecheck) — E2E not included |
| CI         | GitHub Actions                      | Runs lint + typecheck + unit tests + build                      |

## Running Tests

```bash
npm run test          # Vitest unit tests (watch mode: npm run test -- --watch)
npm run test:e2e      # Playwright E2E (requires emulators running)
npm run emulator:start # Start Auth + Firestore + Storage emulators first
npm run ci            # Full check: format + lint + typecheck + test + build
```

## E2E Tests (`tests/e2e/`)

Playwright specs test complete user flows against the Firebase Auth Emulator:

- Isolated environment — no production data touched
- Accounts auto-cleaned when emulator stops
- Covers auth flows, session persistence, and console error monitoring

See `tests/e2e/README.md` for setup and writing new specs.

## Unit Tests

Co-located under `__tests__/` folders next to each source file. Vitest config: `vitest.config.ts`.

Known gap: `useAuth` hook has no unit tests due to mock complexity with `onAuthStateChanged`. Auth flows are covered by E2E instead.

## Auth Hook Notes (legacy context)

Direct unit testing of `useAuth` is non-trivial because:

- `src/tests/setup.tsx` provides global Firebase mocks that affect all tests
- `onAuthStateChanged` callback timing requires careful `waitFor` management

Recommendation: test auth flows via E2E (already implemented), not unit tests.
