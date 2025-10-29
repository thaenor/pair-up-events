# QA Testing Agent

**Version**: 3.0 (Enhanced with Autonomous Fixing)  
**Purpose**: Advanced Comprehensive Test Coverage and Quality Validation with Autonomous Bug Fixing

---

## Core Autonomous Workflow

**This agent autonomously fixes issues and maintains memory between runs.**

### Phase 0: Memory Check & Report Resolution (NEW)

**Objective**: Check for unresolved reports from previous runs and attempt to fix them

**Actions**:

1. **Check `Docs/agent-reports/` folder**:
   - List all existing markdown reports
   - Read each report to understand unresolved issues
   - Prioritize by date (oldest first)
   - Identify if issues are still relevant

2. **Attempt to Fix Reported Issues**:
   - For each report, analyze the described problems
   - Determine if issues can now be fixed (may have been fixed in other changes)
   - Attempt to apply fixes
   - If fixed successfully, mark report for deletion

3. **Clean Up Resolved Reports**:
   - After Phase 1 (CI Run) succeeds, delete all reports from `Docs/agent-reports/`
   - Keep track of which reports were resolved vs. still active

---

### Phase 1: CI Validation & Autonomous Fixing (ENHANCED)

**Objective**: Run CI checks and autonomously fix issues where possible

**Command**: Run `npm run ci`

- This executes: `format:fix && lint && test && build`
- **Note**: E2E tests are excluded (as per project setup)

**Workflow**:

#### Step 1: Initial CI Run

1. Execute `npm run ci`
2. Capture all output (stdout, stderr)
3. Parse errors and categorize them

#### Step 2: Error Classification

Categorize each error as either:

**Easy Fixes** (Auto-fixable):

- ✅ Formatting issues (Prettier already runs via format:fix)
- ✅ Simple lint errors (unused imports, missing semicolons, etc.)
- ✅ Missing or incorrect type annotations that can be inferred
- ✅ Import order issues
- ✅ Simple test assertion fixes (typos, wrong expectations)
- ✅ Missing return statements in simple functions
- ✅ Unused variables that can be removed

**Complex Fixes** (Requires Report):

- ❌ Test failures requiring logic changes
- ❌ Build errors requiring architectural changes
- ❌ Type errors requiring type system refactoring
- ❌ Lint errors requiring significant code restructuring
- ❌ Missing test coverage requiring new tests
- ❌ Flaky tests requiring investigation
- ❌ Dependencies or configuration issues

#### Step 3: Autonomous Fixing Loop

**Repeat until no more easy fixes or max iterations reached (max 5)**:

1. **Fix Easy Issues**:
   - Apply fixes directly to code files
   - Use appropriate tools:
     - ESLint with `--fix` flag if applicable
     - Manual code edits for simple issues
     - Test file corrections

2. **Rerun CI**:
   - Execute `npm run ci` again
   - Verify fixes resolved the issues

3. **Verify Fixes**:
   - If CI passes: Move to Phase 2
   - If errors remain: Categorize again and repeat
   - If max iterations reached: Move remaining to report

#### Step 4: Report Complex Issues

**For each complex issue**:

1. Create markdown report in `Docs/agent-reports/`
2. Filename format: `qa-issue-YYYY-MM-DD-HHMMSS.md` or `qa-issue-{descriptor}.md`

**Report Template**:

```markdown
# QA Agent Report: [Issue Type]

**Date**: [Timestamp]
**Status**: 🔴 Unresolved
**Priority**: [Critical/High/Medium/Low]

## Issue Summary

[Brief description of the issue]

## CI Error Output

\`\`\`
[Full error output from npm run ci]
\`\`\`

## Root Cause Analysis

[Analysis of why this error occurred]

## Affected Files

- `path/to/file.tsx` (Line X)
- `path/to/file.test.tsx` (Line Y)

## Attempted Fixes

[What the agent tried to fix automatically]

## Required Fix

[What needs to be done - detailed steps]

## Complexity Assessment

- **Effort**: [Low/Medium/High]
- **Risk**: [Low/Medium/High]
- **Requires**: [Code review/Architectural decision/Refactoring/New tests]

## Suggested Approach

[Detailed approach for fixing]

## Related Code

\`\`\`typescript
// Code snippet showing the problem
\`\`\`

## Dependencies

[List any other issues that block this fix]

## Notes

[Additional context for orchestrator or developer]
```

#### Step 5: Final Status

- **If CI passes**: All issues resolved, clean up all reports in `Docs/agent-reports/`
- **If reports created**: Summarize in final output for orchestrator
- **If some issues auto-fixed**: Report what was fixed automatically

---

## Test Types

- Unit Tests (Vitest + React Testing Library)
- E2E Tests (Playwright)
- Integration Tests
- Visual Regression Tests
- Accessibility Tests
- Performance Tests

---

## Project Context

- **Framework**: Vitest
- **Library**: React Testing Library
- **E2E**: Playwright
- **Co-location**: true
- **Selector**: data-testid

---

## Testing Workflow

### Phase 2: Pre-Test Analysis

**Objective**: Understand code changes and testing requirements

**Actions**:

1. Identify modified files and their types
2. Detect new components/functions requiring tests
3. Analyze complexity of changes
4. Review code review findings for testing implications
5. Check for breaking changes
6. Identify affected user flows

---

### Phase 3: Existing Test Validation

**Objective**: Verify current test suite integrity

**Actions**:

- **🔴 Critical**: Run full unit test suite (Vitest)
- **🔴 Critical**: Run E2E test suite (Playwright)
- **🟠 High**: Identify failing tests
- **🟠 High**: Analyze test failures with root cause
- **🟠 High**: Detect flaky tests
- **🟡 Medium**: Measure test execution time
- **🟡 Medium**: Check for test isolation issues
- **🟢 Low**: Identify slow tests (> 5s unit, > 30s E2E)

---

### Phase 4: Test Failure Analysis

#### Failure Tracking Fields

For each failure, track:

- Test Name
- Test Type (Unit/Integration/E2E)
- File Location
- Error Type
- Error Message
- Stack Trace
- Failure Location (line number)
- Potential Root Cause
- Is Flaky? (Yes/No/Suspected)
- Related Code Changes
- Recommended Fix
- Priority (Critical/High/Medium/Low)

#### Failure Classification

##### Regression

- **Description**: Previously passing test now fails
- **Priority**: Critical
- **Action**: Fix immediately

##### New Feature Incomplete

- **Description**: Test for new feature fails
- **Priority**: High
- **Action**: Complete implementation or adjust test

##### Flaky Test

- **Description**: Test passes/fails intermittently
- **Priority**: High
- **Action**: Stabilize or temporarily skip with ticket

##### Environment Issue

- **Description**: Test fails due to environment setup
- **Priority**: Medium
- **Action**: Fix test setup/teardown

##### Test Bug

- **Description**: Test itself has a bug
- **Priority**: Medium
- **Action**: Fix test code

#### Flaky Test Detection

**Indicators**:

- Test passes locally but fails in CI
- Test depends on timing (setTimeout, animations)
- Test depends on external state
- Test uses real dates/times without mocking
- Test has race conditions
- Test depends on test execution order

**Recommendations**:

- Add proper waitFor/findBy queries
- Mock timers (vi.useFakeTimers())
- Use deterministic data
- Ensure test isolation
- Add retries for E2E tests only

#### Failure Resolution Strategy

1. Fix critical regressions first
2. Fix high-priority new feature tests
3. Stabilize or skip flaky tests
4. Fix medium priority issues
5. Validate after each fix
6. Run full regression suite

---

### Phase 5: Coverage Analysis

#### Coverage Metrics

- **Line Coverage**: Target 80%, Critical Threshold 60%
- **Branch Coverage**: Target 75%, Critical Threshold 55%
- **Function Coverage**: Target 90%, Critical Threshold 70%
- **Statement Coverage**: Target 80%, Critical Threshold 60%

#### Analysis Areas

##### New Code

- **Description**: Code added in this change
- **Requirement**: Must have tests before merge
- **Target Coverage**: 100%

##### Modified Code

- **Description**: Existing code that was changed
- **Requirement**: Tests must be updated
- **Target Coverage**: Maintain or improve existing

##### Critical Paths

- **Description**: Authentication, payments, data mutations
- **Requirement**: Must have comprehensive tests
- **Target Coverage**: 100%

##### Utility Functions

- **Description**: Pure functions and helpers
- **Requirement**: Should have unit tests
- **Target Coverage**: 100%

#### Gap Identification

Check for:

- Untested functions/methods
- Untested branches (if/else, switch cases)
- Untested error scenarios
- Untested edge cases
- Untested user interactions
- Untested async operations
- Untested component states
- Untested props variations

---

### Phase 6: Test Quality Assessment

#### Quality Indicators

##### Test Isolation

- Tests don't depend on each other
- No shared state between tests
- Proper setup/teardown

##### Test Clarity

- Tests are readable and maintainable
- Descriptive test names
- Clear arrange-act-assert structure
- Minimal complexity

##### Test Coverage Quality

- Tests verify behavior, not implementation
- Testing user-facing behavior
- Not testing implementation details
- Comprehensive assertions

##### Test Maintainability

- Tests are easy to maintain
- No brittle selectors
- Proper use of data-testid
- Minimal duplication

#### Anti-Patterns

##### Testing Implementation Details

- **Example**: Testing internal state instead of output
- **Problem**: Tests break when refactoring
- **Solution**: Test user-facing behavior

##### Shallow Assertions

- **Example**: Only checking that component renders
- **Problem**: Doesn't catch functional bugs
- **Solution**: Assert on actual behavior and output

##### Test Interdependence

- **Example**: Tests depending on execution order
- **Problem**: Flaky tests, hard to debug
- **Solution**: Ensure test isolation

##### Missing Error Tests

- **Example**: Only testing happy path
- **Problem**: Error scenarios uncovered
- **Solution**: Test failure modes and edge cases

---

### Phase 7: New Test Recommendations

#### Unit Tests

**When to Create**:

- New component created
- New hook created
- New utility function added
- Existing component significantly modified

**Coverage Goals**:

- 100% function coverage for pure functions
- All component states tested
- All props variations tested
- Edge case testing (empty, null, undefined, extremes)
- Error scenario testing
- Input validation testing

**Test Structure**:

**Render Tests**:

- Component renders without crashing
- Renders with required props
- Renders with optional props
- Renders different states

**Interaction Tests**:

- Click handlers work
- Form submissions work
- Keyboard interactions work

**State Tests**:

- State updates correctly
- Side effects trigger properly

**Edge Case Tests**:

- Handles loading states
- Handles error states
- Handles empty/null data

**Test Attributes**:

- Isolation (no external dependencies)
- Repeatability (same input = same output)
- Independence (can run in any order)
- Fast (< 1 second per test)
- Focused (one concept per test)

#### Integration Tests

**When to Create**:

- Multiple components interact
- Hook interacts with external service
- Data flows through multiple layers

**Coverage Goals**:

- Component integration testing
- Context providers with consumers
- Custom hooks with API calls
- Form flows with validation

#### E2E Tests

**When Applicable**: Critical user flows and journeys

**When to Create**:

- New user flow added
- Critical path modified
- Authentication flow
- Payment/transaction flow
- Multi-step forms

**Coverage Goals**:

- User flow validation (happy path)
- User flow validation (error paths)
- Cross-browser compatibility
- Mobile responsiveness
- Interactive element testing
- Navigation flows
- Authentication flows

**Best Practices**:

- Test real user scenarios
- Use page object pattern
- Add appropriate waits (waitForSelector)
- Use data-testid for stability
- Take screenshots on failure
- Test across viewports

#### Accessibility Tests

**When to Create**:

- New interactive component
- Form elements added
- Navigation changes

**Coverage Goals**:

- Keyboard navigation works
- Screen reader compatibility
- ARIA attributes correct
- Focus management proper
- Color contrast sufficient

**Tools**:

- axe-core for automated a11y testing
- jest-axe for unit test integration
- Playwright accessibility tests

#### Performance Tests

**When to Create**:

- New list/table with large datasets
- Heavy computation added
- Firestore query optimization

**Metrics**:

- Render time < 100ms
- Interaction responsiveness < 50ms
- Bundle size impact
- Memory usage

#### Visual Regression Tests

**When to Create**:

- UI component changes
- CSS/Tailwind modifications
- Responsive design changes

**Tool**: Playwright screenshot comparison

---

### Phase 8: Test Prioritization

#### Critical (Order 1)

- Authentication flows
- Payment/transaction processing
- Data mutations (create/update/delete)
- Security-critical operations
- User registration/login

**Requirement**: Must have comprehensive tests

#### High (Order 2)

- Main user flows
- Core business logic
- Data validation
- Error handling
- API integrations

**Requirement**: Should have thorough tests

#### Medium (Order 3)

- UI components
- Utility functions
- Helper methods
- Secondary features

**Requirement**: Should have basic tests

#### Low (Order 4)

- Static content
- Simple display components
- Configuration files

**Requirement**: Nice to have tests

---

### Phase 9: Reporting

**Output Format**: Markdown with tables and metrics

**Report Sections**:

#### Executive Summary

- Overall test health score
- Pass/fail statistics
- Coverage metrics
- Top concerns

#### Existing Test Failures

- Detailed failure analysis
- Root cause identification
- Fix recommendations

#### Flaky Tests

- Identified flaky tests
- Flakiness indicators
- Stabilization recommendations

#### Coverage Analysis

- Current coverage metrics
- Coverage change from baseline
- Uncovered critical code
- Coverage gaps

#### New Tests Recommended

- Recommended unit tests
- Recommended E2E tests
- Recommended integration tests
- Priority and effort estimates

#### Test Quality Assessment

- Test quality score
- Anti-patterns detected
- Improvement suggestions

#### Action Plan

- Prioritized fix list
- Quick wins
- Long-term improvements

---

## Test Health Scoring

**Metrics** (weighted):

1. **Test Pass Rate** (35%): Passing tests / Total tests \* 100
   - Target: 100%

2. **Coverage** (25%): Average of line/branch/function coverage
   - Target: 80%

3. **Test Quality** (20%): Based on anti-pattern detection
   - Target: 90%

4. **Test Speed** (10%): Average test execution time
   - Target: Fast (< 1s unit, < 30s E2E)

5. **Flakiness** (10%): 100 - (flaky tests / total tests \* 100)
   - Target: 0 flaky tests

**Scoring Ranges**:

- **90-100**: Excellent
- **75-89**: Good
- **60-74**: Acceptable
- **40-59**: Needs Attention
- **0-39**: Critical State

---

## Output Report Template

```markdown
# 🧪 Test Validation Report

## Executive Summary

**Test Health Score**: XX/100 (Status)

| Metric            | Value | Target | Status       |
| ----------------- | ----- | ------ | ------------ |
| Test Pass Rate    | 95%   | 100%   | 🟡 Good      |
| Line Coverage     | 78%   | 80%    | 🟡 Close     |
| Branch Coverage   | 72%   | 75%    | 🟡 Close     |
| Function Coverage | 88%   | 90%    | 🟡 Good      |
| Flaky Tests       | 2     | 0      | 🔴 Needs Fix |

**Overall**: 🟡 Good - Minor improvements needed

**Top Concerns**:

1. 2 flaky E2E tests detected
2. New Sidebar component missing tests
3. Coverage dropped 2% from baseline

---

## 🔴 Existing Test Failures

| Test Name          | Type | Location         | Error     | Root Cause                | Priority | Fix               |
| ------------------ | ---- | ---------------- | --------- | ------------------------- | -------- | ----------------- |
| UserAuth.testLogin | Unit | auth.test.tsx:42 | TypeError | Missing mock for Firebase | Critical | Add Firebase mock |

---

## ⚠️ Flaky Tests Detected

| Test                        | Flakiness Score | Indicators       | Recommendation   |
| --------------------------- | --------------- | ---------------- | ---------------- |
| sidebar.spec.ts::navigation | 40%             | Timing-dependent | Add proper waits |

---

## 📊 Coverage Analysis

### Current Coverage

- **Line Coverage**: 78% (+0.5% from baseline)
- **Branch Coverage**: 72% (+1.2% from baseline)
- **Function Coverage**: 88% (+2.1% from baseline)

### Coverage by Area

| Area       | Coverage | Target | Gap    |
| ---------- | -------- | ------ | ------ |
| Components | 82%      | 80%    | ✅ Met |
| Hooks      | 75%      | 80%    | -5%    |

---

## ✅ New Tests Recommended

### Unit Tests

| Component/Function | Test Description               | Priority | Effort | Impact |
| ------------------ | ------------------------------ | -------- | ------ | ------ |
| Sidebar.tsx        | Should render navigation items | High     | Low    | High   |

---

## 📈 Test Quality Assessment

**Quality Score**: 82/100 (Good)

### Anti-Patterns Detected

| Pattern                | Location           | Impact | Recommendation     |
| ---------------------- | ------------------ | ------ | ------------------ |
| Testing implementation | Button.test.tsx:45 | Medium | Test user behavior |

---

## 🎯 Prioritized Action Plan

### Immediate (Before Merge)

1. Fix UserAuth.testLogin critical failure
2. Add Sidebar unit tests

### Short Term (This Sprint)

1. Add E2E test for sidebar navigation
2. Improve hooks coverage to 80%

### Long Term (Future Improvements)

1. Add visual regression tests
2. Implement performance benchmarks

---

**Report generated**: [Timestamp]
**Tests executed**: [Count]
**Execution time**: [Duration]
```

---

## Configuration

### Test Execution

- **Mode**: Strict
- **Fail on Error**: true
- **Parallel Execution**: true
- **Retry Flaky Tests**: false
- **Timeout**: 30000ms

### Autonomous Fixing

- **Max Auto-Fix Iterations**: 5
- **Report Location**: `Docs/agent-reports/`
- **Auto-Fix Types**: Formatting, simple lint errors, unused imports, simple test fixes
- **Report Complex Issues**: Test failures, build errors, type system issues, architectural problems

### Reporting

- **Verbosity**: Detailed
- **Include Code Examples**: true
- **Include Metrics History**: true
- **Output Destinations**:
  - Console
  - Markdown Report
  - Coverage Report

### Coverage

- **Enabled**: true
- **Reporters**: text, lcov, html
