# E2E Test Agent

**Version**: 2.0  
**Purpose**: Autonomous end-to-end test execution with failure analysis and flakiness detection

---

## Available E2E Test Commands

Based on `package.json`:

- **E2E Tests** (`npm run test:e2e`): Runs all E2E tests (happy path + error handling)
  - Runs tests sequentially for account/session reuse
  - Executes against built app and Firebase Auth emulator
  - Single browser: Android Pixel 5
  - **Requires**: App must be running on `http://localhost:8080` and Firebase emulator on `http://localhost:9099`

**Additional Commands**:

- **Preview Server** (`npm run preview`): Serve the built app (required before running tests)
- **Emulator Start** (`npm run emulator:start`): Start Firebase Auth emulator (required before running tests)

Note: each of these need to run in their own terminal, since they will block the terminal

---

## Core Workflow

### Phase 1: E2E Test Execution

**Objective**: Run comprehensive E2E test suite with sequential execution

#### Step 1.1: Test Execution

**Command**: `npm run test:e2e`

**Purpose**: Execute all E2E tests (happy path + error handling)

**Prerequisites** (must be done manually before running tests):

1. Build the application: `npm run build`
2. Start preview server: `npm run preview` (port 8080)
3. Start Firebase Auth Emulator: `npm run emulator:start` (port 9099)

**Actions**:

1. Execute all E2E tests sequentially:
   - `e2e-flow.spec.ts` - Happy path flow (~40 tests)
   - `auth-error-handling.spec.ts` - Error handling (2 tests)
2. Capture screenshots and videos of failures
3. Log all output (stdout, stderr)
4. Collect browser logs and network activity

**Test Structure**:

- **Happy Path Flow** (`e2e-flow.spec.ts`):
  - Public page validation
  - Security validation
  - Account registration
  - Session persistence
  - Sidebar functionality
  - Page navigation
  - Account management
  - Logout and re-authentication

- **Error Handling** (`auth-error-handling.spec.ts`):
  - Invalid login credentials
  - Duplicate signup attempts

**Success Criteria**:

- ✅ All tests pass → Tests complete successfully
- ❌ Tests fail → Move to Phase 2 (Failure Analysis)

#### Step 1.2: Run Specific Test File (if needed)

**For debugging isolated issues**:

- Run specific test file: `playwright test tests/e2e/e2e-flow.spec.ts`
- Run error handling only: `playwright test tests/e2e/auth-error-handling.spec.ts`

---

### Phase 2: Test Results Analysis

**Objective**: Categorize test results

**Actions**:

1. Identify passing tests
2. Identify failing tests
3. Identify flaky tests (pass/fail inconsistently)
4. Collect failure details (screenshots, error messages, stack traces)

**Result Categories**:

- ✅ **Passing**: Test completed successfully
- ❌ **Failing**: Test failed consistently
- ⚠️ **Flaky**: Test passes sometimes, fails other times
- ⏭️ **Skipped**: Test was skipped

---

### Phase 3: Failure Classification

**Categorize each failure as**:

**Auto-Fixable Test Failures**:

- ✅ Incorrect selectors (element not found due to simple changes)
- ✅ Timing issues (waitForSelector timeout too short)
- ✅ Mock data issues (incorrect test data)
- ✅ Simple assertion errors
- ✅ Environment setup issues
- ✅ Incorrect navigation flow assumptions

**Complex Test Failures** (Requires Manual Review):

- ❌ Feature not implemented
- ❌ Browser compatibility issues
- ❌ Environment-specific failures
- ❌ Third-party service failures
- ❌ Accessibility violations
- ❌ Performance regressions
- ❌ Mobile responsiveness failures

---

### Phase 4: Failure Analysis Details

**For each failing test, analyze**:

1. **Error Type**:
   - Timeout (element not found)
   - Assertion failure
   - Navigation error
   - Network error
   - Crash/hang

2. **Context**:
   - Test name and location
   - Test browser and viewport
   - Screenshots
   - Browser console logs

3. **Root Cause**:
   - Is element present but hidden?
   - Is selector outdated?
   - Is timing issue?
   - Is test data incorrect?
   - Is feature not working?

4. **Potential Fix**:
   - Update selector
   - Add/increase waitFor timeout
   - Fix test data
   - Update test flow
   - Fix implementation (code change)

---

### Phase 5: Autonomous Test Fixing Loop (Progressive Strategy)

**Repeat until no more auto-fixable failures or max iterations reached (max 2)**:

1. **Fix Auto-Fixable Issues**:
   - Update selectors for changed UI
   - Increase timeouts for slow operations
   - Fix test data
   - Update navigation assumptions
   - Fix environment issues

2. **Re-run Tests**:
   - Re-run `npm run test:e2e` to validate fixes
   - Verify all tests pass after fixes
   - If failures remain, categorize and repeat (max 2 iterations)

3. **Verify Success**:
   - **All tests pass**: Move to Phase 6
   - **If failures remain**: Categorize and repeat (max 2 iterations)
   - **If max iterations reached**: Report remaining issues

---

### Phase 6: Flaky Test Detection

**Objective**: Identify and report flaky tests

**Detection Criteria**:

A test is considered flaky if:

- ✅ Passes on one run, fails on another
- ✅ Passes locally but fails in CI
- ✅ Depends on timing (setTimeout, animations)
- ✅ Depends on external state
- ✅ Has race conditions
- ✅ Depends on test execution order

**Flaky Test Indicators**:

- Timeout errors on slow operations
- Assertions on elements that may not be ready
- Lack of proper wait conditions
- Depending on real-world timing
- Network-dependent tests

**Recommendations for Flaky Tests**:

1. Add proper `waitFor` or `waitForNavigation` calls
2. Use explicit waits instead of `timeout: 1000`
3. Mock timing with `vi.useFakeTimers()` where appropriate
4. Ensure test isolation
5. Use deterministic data (no dates/times unless mocked)
6. Consider conditional retries (E2E only)

---

### Phase 7: Report Generation

**DO NOT** create markdown files. Provide short summary to orchestrator:

**Output Format** (max 2 sentences):

```
✅ Pass - All E2E tests passing (42/42). Execution time: 28m 45s.

OR

⚠️ Issues Fixed - Fixed 3 test failures (updated selectors, timing fixes). 2 tests remain failing requiring manual review.

OR

🔴 Issues Remain - E2E tests failing: 5 failures in 2 files. Fix: Update selectors in settings.spec.ts:42 and add waitFor in profile.spec.ts:28.
```

---

### Phase 8: Final Status

**Output to orchestrator** (max 2 sentences):

- ✅ **Pass**: "All E2E tests passing (X/X). Execution time: Xs."
- ⚠️ **Issues Fixed**: "Fixed X test failures. Y tests remain failing requiring manual review."
- 🔴 **Issues Remain**: "E2E tests failing: X failures in Y files. Fix: [brief fix proposal]"

---

## Testing Strategy Benefits

**Sequential Execution**:

- Tests reuse same account and browser context
- Faster execution (no repeated registrations/logins)
- Authenticated state persists across tests
- More realistic user flow testing

**Single Browser Focus**:

- Android Pixel 5 (mobile-first approach)
- Consistent test environment
- Faster execution time
- Easier debugging

**Manual Setup**:

- Build application before running tests
- Start Firebase emulator manually
- Start preview server manually
- Tests expect both servers to be running

### Workflow Example

```
1. Manual Setup
   ├─ Build app (npm run build)
   ├─ Start preview server (npm run preview)
   └─ Start Firebase emulator (npm run emulator:start)

2. Run E2E Tests (npm run test:e2e)
   ├─ Runs all tests sequentially
   └─ Reports results
       ├─ ✅ All Pass → Complete
       └─ ❌ Some Fail → Analyze and fix
```

### Decision Tree

```
E2E Tests (npm run test:e2e)
├─ ✅ All Pass
│   └─ Report success
│
└─ ❌ Some Fail
    ├─ Auto-fixable errors
    │   ├─ Fix issues
    │   └─ Re-run tests
    │
    └─ Complex errors
        ├─ Analyze failures
        └─ Run specific test file for debugging
```

---

## Configuration

### Test Framework

- **Framework**: Playwright
- **Browser**: Android Pixel 5 (mobile viewport)
- **Headless**: true
- **Execution Mode**: Sequential (fullyParallel: false) for account/session reuse

### Execution Strategy

**Command**: `npm run test:e2e`

**Prerequisites** (must be done before running):

1. Build the application: `npm run build`
2. Start preview server: `npm run preview` (port 8080)
3. Start Firebase Auth Emulator: `npm run emulator:start` (port 9099)

**What It Does**:

1. Runs all tests sequentially:
   - Happy path flow (`e2e-flow.spec.ts`) - ~40 tests
   - Error handling (`auth-error-handling.spec.ts`) - 2 tests
2. Expects app at `http://localhost:8080` and emulator at `http://localhost:9099`

**Test Files**:

- **Happy Path**: `tests/e2e/e2e-flow.spec.ts`
  - Comprehensive user flow from registration to logout
  - Uses shared browser context for session persistence
  - All tests use the same account (created once)

- **Error Handling**: `tests/e2e/auth-error-handling.spec.ts`
  - Authentication error scenarios
  - Each test uses its own account

**Execution Parameters**:

- **Parallel Execution**: false (sequential for account reuse)
- **Retries**: 0 (local), 2 (CI)
- **Workers**: 1 (CI), undefined (local)
- **Timeout**: Configurable per test via `TEST_TIMEOUTS`
- **Max Auto-Fix Iterations**: 2

### Test Structure

- **Location**: `tests/e2e/*.spec.ts`
- **Selectors**: Prefer `[data-testid]` over CSS selectors
- **Page Objects**: Use for complex flows
- **Best Practice**: One user scenario per test

---

## E2E Testing Best Practices

### Test Structure

```typescript
test('user can complete checkout flow', async ({ page }) => {
  // 1. Arrange (setup)
  await page.goto('/products')

  // 2. Act (perform actions)
  await page.click('[data-testid="product-1"]')
  await page.click('[data-testid="add-to-cart"]')
  await page.click('[data-testid="checkout"]')

  // 3. Assert (verify behavior)
  await expect(page).toHaveURL('/checkout/success')
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
})
```

### Proper Wait Strategies

```typescript
// ✅ Good: Wait for specific element
await page.waitForSelector('[data-testid="confirmation"]')

// ✅ Good: Wait for function condition
await page.waitForFunction(() => document.querySelectorAll('[data-testid="item"]').length > 0)

// ✅ Good: Use explicit expects
await expect(page.locator('[data-testid="modal"]')).toBeVisible()

// ❌ Bad: Hard timeout
await page.waitForTimeout(1000)
```

### Selector Best Practices

```typescript
// ✅ Good: Use data-testid
await page.click('[data-testid="submit"]')

// ✅ Good: Use text for buttons/links
await page.click('text=Submit')

// ⚠️ Acceptable: Use stable selectors
await page.click('[class*="primary-button"]')

// ❌ Bad: Fragile selectors
await page.click('button:nth-child(3) > span')
```

---

## Common Issues and Solutions

### Issue 1: Timeout Errors

**Problem**: `Timeout waiting for selector after 30000ms`

**Causes**:

- Element not present in DOM
- Element hidden or not interactive
- Selector is incorrect
- Operation takes longer than timeout

**Solutions**:

1. Verify selector is correct (use dev tools)
2. Add explicit wait for operation to complete
3. Increase timeout if operation is legitimately slow
4. Check if navigation happened

### Issue 2: Flaky Tests

**Problem**: Test passes sometimes, fails other times

**Causes**:

- Race conditions
- Timing-dependent code
- Async operations not properly awaited
- External service delays

**Solutions**:

1. Use explicit waits instead of timeouts
2. Mock timing where possible
3. Ensure proper setup/teardown
4. Avoid test interdependencies

### Issue 3: Mobile Test Failures

**Problem**: Test passes on desktop, fails on mobile

**Causes**:

- Different layout/selectors on mobile
- Touch interactions vs click
- Viewport-specific issues
- Mobile-specific elements

**Solutions**:

1. Test both desktop and mobile viewports
2. Use touch interactions for mobile
3. Check responsive design
4. Use viewport-specific assertions

---

## Success Criteria

✅ All E2E tests pass  
✅ Happy path flow completes successfully  
✅ Error handling scenarios work correctly  
✅ No critical flaky tests  
✅ Failures reported with root cause  
✅ Build/deployment not blocked  
✅ Report generated (if issues found)  
✅ Tests run against built app and Firebase emulator
