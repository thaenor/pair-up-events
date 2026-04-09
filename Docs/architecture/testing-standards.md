# Testing Standards

## Testing Frameworks

| Type            | Framework         | Library                       | Environment                    |
| --------------- | ----------------- | ----------------------------- | ------------------------------ |
| **Unit**        | Vitest 3.2.4      | React Testing Library 16.3.0  | jsdom (browser-like)           |
| **Component**   | Vitest + RTL      | React Testing Library         | jsdom                          |
| **E2E**         | Playwright 1.56.1 | Native                        | Real browser (Android Pixel 5) |
| **Integration** | Vitest            | React Testing Library + mocks | jsdom                          |

## Test Placement

Tests are **co-located** with their source code:

```
src/components/atoms/button/
├── button.tsx
└── button.test.tsx

src/hooks/
├── useAuth.ts
└── useAuth.test.ts

src/lib/firebase/
├── user-service.ts
└── user-service.test.ts
```

### Naming Conventions

- Test file must match source file name with `.test.tsx` or `.test.ts` suffix
- Example: `event-card.tsx` → `event-card.test.tsx`

### Directory Alternative

Large test suites can use `__tests__/` subdirectory:

```
src/components/atoms/button/
├── button.tsx
├── __tests__/
│   └── button.test.tsx
```

## Test Selectors

Use **data-testid** attributes for querying elements:

```tsx
// button.tsx
export const Button = ({ label }: Props) => {
  return (
    <button data-testid="submit-button" onClick={handleClick}>
      {label}
    </button>
  )
}

// button.test.tsx
it('calls onClick when clicked', () => {
  const onClick = vi.fn()
  render(<Button label="Submit" onClick={onClick} />)
  screen.getByTestId('submit-button').click()
  expect(onClick).toHaveBeenCalled()
})
```

Avoid brittle selectors like CSS classes or implementation details.

## Minimum Test Coverage Per Component

Every component test should include these three test types:

### 1. Render Test

Verify the component renders without crashing with required props:

```tsx
it('renders without crashing', () => {
  render(<Button label="Click me" onClick={() => {}} />)
  expect(screen.getByTestId('button')).toBeInTheDocument()
})
```

### 2. Behavior Test

Test key user interactions and state changes:

```tsx
it('calls onClick handler when clicked', () => {
  const onClick = vi.fn()
  render(<Button label="Click" onClick={onClick} />)
  screen.getByTestId('button').click()
  expect(onClick).toHaveBeenCalledTimes(1)
})

it('disables button when disabled prop is true', () => {
  render(<Button label="Click" onClick={() => {}} disabled />)
  expect(screen.getByTestId('button')).toBeDisabled()
})
```

### 3. Error/Fallback Test (If Applicable)

Test edge cases and error states:

```tsx
it('shows error message when error prop is provided', () => {
  render(<ErrorAlert error={new Error('Something went wrong')} />)
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})

it('shows loading spinner when loading is true', () => {
  render(<DataDisplay loading data={null} />)
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
})
```

## Unit Testing Configuration

The project uses these Vitest settings in `vite.config.ts`:

```ts
test: {
  globals: true,                          // Use 'it', 'describe' without import
  environment: 'jsdom',                   // Browser-like environment
  setupFiles: './src/tests/setup.tsx',    // Global test setup
  css: true,                              // Process CSS in tests
  threads: 2,                             // CI: 2 threads max (memory optimized)
  testTimeout: 10000,                     // 10 second timeout per test
}
```

## E2E Testing with Playwright

E2E tests verify complete user flows in a real browser (Android Pixel 5).

### Configuration

Located in `playwright.config.ts`:

- Device: Android Pixel 5 (mobile-first)
- Base URL: Configurable, defaults to localhost:5173
- Retries: 2 attempts if flaky
- Reporters: List (default) or HTML (via `E2E_REPORT=html`)

### Running E2E Tests

```bash
# Run locally
npm run test:e2e

# With HTML report
E2E_REPORT=html npm run test:e2e

# Run via Husky pre-commit hook
git commit -m "message"  # Tests run automatically
```

### E2E Test Example

```ts
// tests/e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test'

test('user can login with email', async ({ page }) => {
  // Navigate
  await page.goto('/login')

  // Fill form
  await page.fill('[data-testid="email-input"]', 'user@example.com')
  await page.fill('[data-testid="password-input"]', 'password123')

  // Submit
  await page.click('[data-testid="submit-button"]')

  // Verify navigation
  await expect(page).toHaveURL('/profile')
})
```

### E2E Best Practices

- Use `data-testid` for stable selectors
- Wait for elements explicitly: `expect(page.locator(...)).toBeVisible()`
- Avoid `waitForLoadState('networkidle')` — use element-based waits
- Mock third-party services if needed
- Take screenshots on failure (automatically enabled)

## Test Quality Principles

### Test Behavior, Not Implementation

Focus on what users see and do, not internal code details:

```tsx
// ✅ CORRECT - Tests behavior
it('shows welcome message to logged-in user', () => {
  render(<Dashboard user={{ name: 'Alice' }} />)
  expect(screen.getByText(/welcome, alice/i)).toBeInTheDocument()
})

// ❌ WRONG - Tests implementation detail
it('calls useState with initial state', () => {
  // Can't test this directly — tests internal implementation
})
```

### Ensure Test Isolation

Each test should run independently without affecting others:

```tsx
// ✅ Setup and cleanup in each test
it('logs user in', () => {
  const { unmount } = render(<LoginForm />)
  // ... test
  unmount() // Cleanup
})

// ✅ Use beforeEach/afterEach for repeated setup
beforeEach(() => {
  vi.clearAllMocks()
})
```

### Use Deterministic Data

Avoid tests depending on current time or randomness:

```tsx
// ✅ Mock dates for consistency
vi.useFakeTimers()
vi.setSystemTime(new Date('2026-04-08'))

// ✅ Use fixed data
const mockUser = { id: '123', name: 'Alice', createdAt: new Date('2026-01-01') }

// ❌ WRONG - Depends on current time
expect(user.createdToday).toBe(true) // Fails tomorrow!
```

### Mock External Dependencies

Mock Firebase, HTTP calls, and timers:

```tsx
// Mock Firebase
vi.mock('@/lib/firebase/user-service', () => ({
  getUser: vi.fn(() => Promise.resolve({ id: '123', name: 'Alice' })),
}))

// Mock timers
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
vi.useRealTimers()
```

## Firebase Testing Strategy

### Unit Testing Patterns

Mock Firebase calls and test logic:

```ts
import { getEvent } from '@/lib/firebase/event-service'
import { vi } from 'vitest'

vi.mock('@/lib/firebase/init', () => ({
  db: {},
}))

it('parses event data correctly', async () => {
  const mockEvent = { id: '1', title: 'Dinner', createdAt: new Date() }
  vi.mocked(getEvent).mockResolvedValue(mockEvent)

  const event = await getEvent('1')
  expect(event.title).toBe('Dinner')
})
```

### E2E Testing with Firebase Emulator

Use Firebase emulator for realistic auth testing:

```bash
# Start emulator with dev server
npm run emulator:start &
npm run dev
```

## Coverage Expectations

The project does not enforce strict coverage % but expects:

- **New code**: Should have tests before merge
- **Critical paths** (auth, data mutations): Comprehensive testing
- **Utility functions**: 100% coverage when possible
- **UI components**: At least render + behavior + error tests

## Test Performance

### Optimization Rules

- Keep unit tests fast (< 1s per test)
- Run E2E tests only for critical flows
- Parallelize unit tests (Vitest default)
- Cache test fixtures and mocks

### Slow Test Investigation

If a test runs slowly:

```ts
// Profile it
it('loads large event list', async () => {
  const start = performance.now()
  render(<EventList events={largeArray} />)
  const duration = performance.now() - start
  console.log(`Rendered in ${duration}ms`)
})
```

## Testing Firebase Auth (useAuth Hook)

Direct unit tests for `useAuth` are challenging due to global mock conflicts in `src/tests/setup.tsx` and async auth state complexity. The recommended strategy:

1. **Integration tests** — Test auth behaviour through components that consume the hook (e.g., `EmailLoginForm`)
2. **E2E tests with Firebase Emulator** — Most reliable; real auth flows in isolation
3. **Manual test checklist** — Use when E2E suite is unavailable

### Manual Auth Test Checklist

| Flow               | Test Case            | Expected                                      |
| ------------------ | -------------------- | --------------------------------------------- |
| **Login**          | Valid credentials    | Success                                       |
| **Login**          | Invalid email format | "Invalid email address"                       |
| **Login**          | Wrong password       | "Incorrect password"                          |
| **Login**          | Non-existent user    | "No account found"                            |
| **Login**          | Network error        | "Network error. Please check your connection" |
| **Signup**         | Valid credentials    | Success, user created                         |
| **Signup**         | Existing email       | "Email is already in use"                     |
| **Signup**         | Weak password        | "Password is too weak"                        |
| **Logout**         | Logged-in user       | user state becomes null                       |
| **Password reset** | Valid email          | Reset email sent                              |
| **Password reset** | Invalid email        | "Invalid email address"                       |
| **Password reset** | Non-existent user    | "No account found"                            |
| **Auth state**     | Initial render       | user is null, loading is true                 |
| **Auth state**     | After init           | loading becomes false                         |

## Troubleshooting Common Issues

| Issue                                             | Cause                           | Fix                                                        |
| ------------------------------------------------- | ------------------------------- | ---------------------------------------------------------- |
| **"Can't perform action on unmounted component"** | Component updates after unmount | Add proper cleanup or use `waitFor`                        |
| **Flaky E2E tests**                               | Timing issues                   | Use element visibility waits, not `waitFor('networkidle')` |
| **Mock not working**                              | Module imported before mock     | Move `vi.mock()` to top of file                            |
| **useEffect not running in test**                 | Dependencies wrong or missing   | Check deps array matches render                            |
| **Test timeout**                                  | Async operation hanging         | Add error handling, increase timeout if justified          |

## Checklist for New Tests

- [ ] Test file co-located with source file
- [ ] Uses `data-testid` for selectors
- [ ] Includes render, behavior, and error tests
- [ ] No direct state/implementation testing
- [ ] Proper async handling with `waitFor` or `findBy`
- [ ] Firebase calls mocked
- [ ] No test interdependencies
- [ ] Clears mocks between tests
- [ ] Descriptive test names
- [ ] Fast execution (< 1s for units, < 30s for E2E)
