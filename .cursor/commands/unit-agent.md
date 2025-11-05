# Unit Test Agent

**Version**: 1.0  
**Purpose**: Autonomous unit test execution, failure analysis, and snapshot validation with intelligent decision-making

---

## Core Workflow

### Phase 1: Test Execution

**Objective**: Run unit tests and capture results

**Command**: `npm run test`

**Actions**:

1. Execute unit test suite (Vitest)
2. Capture all output (stdout, stderr)
3. Generate coverage report
4. Identify failing tests and snapshots

---

### Phase 2: Failure Analysis & Classification

**Categorize each failure as either:**

**Auto-Fixable Test Failures**:

- ✅ Incorrect mock data (typos, wrong values)
- ✅ Simple assertion errors (wrong expected value)
- ✅ Missing mocks for simple dependencies
- ✅ Wrong test data setup
- ✅ Simple timing issues (wrong timeout values)
- ✅ **Snapshot failures from intended code changes** (see Snapshot Validation)

**Complex Test Failures** (Requires Manual Review):

- ❌ Component rendering errors
- ❌ Test failures requiring business logic fixes
- ❌ Flaky tests with race conditions
- ❌ Missing integration setup
- ❌ **Snapshot failures from unintended changes** (see Snapshot Validation)
- ❌ Tests failing due to external service issues
- ❌ Performance regression tests

---

### Phase 3: Snapshot Test Failure Detection & Validation

**Objective**: Automatically handle snapshot test failures with intelligent analysis

**When triggered**: When test failures include snapshot mismatches

**Process**:

#### Step 1: Identify Snapshot Failures

1. Parse test output for snapshot mismatch errors
2. Extract failing snapshot file paths
3. Identify corresponding component/test files
4. Locate both old (git HEAD) and new snapshot files

#### Step 2: Retrieve Snapshots

1. Read old snapshot from git: `git show HEAD:{snapshot_path}`
2. Read new snapshot from filesystem: `{snapshot_path}`
3. Read corresponding test file to understand what's being tested
4. Read source component file to understand what changed

#### Step 3: Deep Comparison Analysis

**For each snapshot failure**:

**a. Context Analysis**:

- Review git diff of source component files
- Identify what UI/logic changes were made
- Review test file to understand test intent
- Check if test mocks were updated

**b. Snapshot Diff Analysis**:

- Compare old vs new snapshot line-by-line
- Categorize differences:
  - **Structural changes** (new/removed elements, attributes)
  - **Content changes** (text values, class names, IDs)
  - **State changes** (disabled states, visibility, data attributes)
  - **Formatting changes** (whitespace, attribute order)

**c. Change Classification**:

**INTENDED Changes** (Result of intentional UI modifications):

- ✅ New elements added that match code changes
- ✅ Removed elements that match code removal
- ✅ Modified content that matches prop/state changes
- ✅ Attribute changes that match styling/logic updates
- ✅ Class name changes that match CSS/styling updates
- ✅ Data values that match updated test data/mocks
- ✅ Structural changes that match component refactoring

**UNINTENDED Changes** (Potential bugs or test issues):

- ❌ Unexpected element additions/removals
- ❌ Missing expected elements
- ❌ Content changes without corresponding code changes
- ❌ Class/attribute changes without styling/logic changes
- ❌ State changes (disabled, hidden) without code changes
- ❌ Test mock issues causing wrong snapshots
- ❌ Missing mocks causing error states in snapshots
- ❌ Broken components rendering error boundaries

#### Step 4: Reasoning & Decision

**If changes are INTENDED**:

- ✅ Update snapshot automatically using `npm test -- -u`
- Log action: "Snapshot updated for {component}: Changes reflect intended UI modifications"
- Continue to next snapshot failure

**If changes are UNINTENDED**:

- ❌ **DO NOT** update snapshot
- Create detailed snapshot validation report (see Phase 4)
- Include specific differences and reasoning
- Continue analysis (don't block pipeline)

---

### Phase 4: Report Unintended Snapshot Changes

**DO NOT** create markdown files. For unintended snapshot changes, provide short summary:

**Output Format** (max 2 sentences):

```
⚠️ Unintended Snapshot Changes - Detected unintended snapshot changes in Modal component (missing element, incorrect props). Fix: Update test mocks in Modal.test.tsx or verify component logic changes in Modal.tsx.

OR

✅ Snapshots Updated - Updated 3 snapshots for intended UI changes. No unintended changes detected.
```

---

### Phase 5: Autonomous Test Fixing Loop

**Repeat until no more auto-fixable failures or max iterations reached (max 3)**:

1. **Fix Auto-Fixable Issues**:
   - Update incorrect mock data
   - Fix assertion values
   - Add missing mocks
   - Fix test setup issues
   - **Update snapshots for intended changes**

2. **Re-run Tests**:
   - Execute `npm run test` again
   - Verify fixes resolved failures

3. **Verify Success**:
   - If tests pass: Move to Phase 6
   - If failures remain: Categorize and repeat
   - If max iterations reached: Report remaining issues

---

### Phase 6: Coverage Analysis

**Objective**: Analyze test coverage metrics

**Actions**:

1. Collect coverage metrics (line, branch, function)
2. Identify uncovered critical code paths
3. Compare against baseline coverage
4. Identify gaps for modified code

**Coverage Targets**:

- Line Coverage: Target 80%, Critical Threshold 60%
- Branch Coverage: Target 75%, Critical Threshold 55%
- Function Coverage: Target 90%, Critical Threshold 70%

---

### Phase 7: Final Status

**DO NOT** create markdown files. Provide short summary to orchestrator (max 2 sentences):

**Output Format**:

```
✅ Pass - All tests passing (47/47). Coverage: 85% line, 80% branch, 92% function. Snapshots updated for intended changes.

OR

⚠️ Issues Fixed - Fixed 3 test failures and updated 2 snapshots. 1 test failure remains in UserService.test.tsx:42 requiring manual review.

OR

🔴 Issues Remain - Tests failing: 3 failures in 2 files. Fix: Update mocks in UserService.test.tsx:42 and fix async test in Auth.test.tsx:15.
```

---

## Configuration

### Test Framework

- **Framework**: Vitest
- **Library**: React Testing Library
- **Selector**: data-testid
- **Co-location**: true (tests next to components)

### Execution

- **Command**: `npm run test`
- **Coverage**: Enabled with reporting
- **Max Auto-Fix Iterations**: 3
- **Fail on Error**: false (continue to report issues)

### Snapshot Handling

- **Auto-update**: Only for INTENDED changes
- **Deep validation**: Automatic analysis of all changes
- **Reporting**: Generate reports for unintended changes

---

## Success Criteria

✅ All auto-fixable test failures fixed  
✅ All intended snapshots updated  
✅ Unintended snapshot changes reported  
✅ Coverage metrics collected and analyzed  
✅ Final report generated (if issues remain)
