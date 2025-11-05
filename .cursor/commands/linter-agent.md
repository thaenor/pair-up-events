# Linter Agent

**Version**: 1.0  
**Purpose**: Autonomous code formatting and linting with intelligent error fixing

---

## Core Workflow

### Phase 1: Initial Formatting Pass

**Objective**: Auto-fix all formatting issues

**Actions**:

1. Execute `npm run format`
2. This runs Prettier and auto-fixes formatting
3. Verify no formatting errors remain

---

### Phase 2: Linting Analysis

**Objective**: Run linter and categorize errors

**Command**: `npm run lint`

**Actions**:

1. Execute linting
2. Capture all output (stdout, stderr)
3. Parse errors and categorize them

---

### Phase 3: Error Classification

**Categorize each error as either:**

**Easy Fixes** (Auto-fixable):

- ✅ Unused imports
- ✅ Missing semicolons
- ✅ Incorrect indentation
- ✅ Import order issues
- ✅ Simple naming convention violations
- ✅ Unused variables/parameters
- ✅ Missing return statements
- ✅ Simple prop validation issues

**Complex Fixes** (Requires User Input):

- ❌ ESLint rule violations requiring architectural changes
- ❌ Complexity issues requiring code restructuring
- ❌ Rule violations requiring business logic changes
- ❌ Warnings requiring configuration decisions
- ❌ Performance-related linting issues
- ❌ Security vulnerabilities requiring investigation

---

### Phase 4: Autonomous Fixing Loop

**Repeat until no more easy fixes or max iterations reached (max 3)**:

1. **Fix Easy Issues**:
   - Remove unused imports
   - Fix import order
   - Remove unused variables
   - Fix simple naming violations
   - Use ESLint `--fix` flag for auto-fixable rules

2. **Re-run Linter**:
   - Execute `npm run lint` again
   - Verify fixes resolved issues

3. **Verify Success**:
   - If lint passes: Move to Phase 5
   - If errors remain: Categorize and repeat
   - If max iterations reached: Report remaining issues

---

### Phase 5: Report Complex Issues

**DO NOT** create markdown files. Instead, provide short summary to orchestrator:

**Output Format** (max 2 sentences):

```
✅ Pass - All linting issues auto-fixed. No remaining errors.

OR

⚠️ Issues Fixed - Fixed 5 auto-fixable issues (unused imports, formatting). 2 complex issues remain requiring manual review: complexity rule violation in user-service.ts:142 and unused dependency warning.

OR

🔴 Issues Remain - Linting failed with 8 errors in 3 files. Fix: Update ESLint config to disable complexity rule or refactor user-service.ts:142 to reduce cyclomatic complexity.
```

---

### Phase 6: Final Status

**Output to orchestrator** (max 2 sentences):

- **If lint passes**: "✅ Pass - All linting issues resolved. No errors remaining."
- **If issues auto-fixed**: "⚠️ Issues Fixed - Auto-fixed X issues. Y complex issues remain requiring manual review."
- **If issues remain**: "🔴 Issues Remain - Linting failed with X errors in Y files. Fix: [brief fix proposal]"

---

## Error Examples and Fixes

### Example 1: Unused Import

**Error**: `'React' is defined but never used (no-unused-vars)`

**File**: `src/components/Button.tsx`

**Auto-Fix**: Remove the import line

```typescript
- import React from 'react';
  import { useState } from 'react';
```

**Status**: ✅ Auto-fixed

---

### Example 2: Import Order

**Error**: `Import statement not alphabetized (simple-import-sort/imports)`

**File**: `src/pages/dashboard.tsx`

**Auto-Fix**: Reorder imports

```typescript
- import { Button } from 'components';
- import { api } from 'lib';
+ import { api } from 'lib';
+ import { Button } from 'components';
```

**Status**: ✅ Auto-fixed

---

### Example 3: Unused Variable

**Error**: `'tempData' is assigned a value but never used (no-unused-vars)`

**File**: `src/hooks/useData.ts:15`

**Auto-Fix**: Remove the variable

```typescript
- const tempData = fetchData();
  const data = processData();
```

**Status**: ✅ Auto-fixed

---

### Example 4: Missing Return

**Error**: `Expected return value (consistent-return)`

**File**: `src/utils/helper.ts:8`

**Fix Attempt**: Add return statement

```typescript
- if (condition) {
-   doSomething();
- }
+ if (condition) {
+   return doSomething();
+ }
```

**Status**: ✅ Auto-fixed

---

### Example 5: Rule Violation Requiring Discussion

**Error**: `Function 'processUserData' is too complex (complexity)`

**File**: `src/services/user.ts:42`

**Why Not Auto-Fixed**: Requires architectural decision on refactoring strategy

**Status**: 🟡 Report for review

---

## Configuration

### Linting Rules

- **Framework**: ESLint
- **Config**: `.eslintrc` or `eslint.config.js`
- **Plugins**: Various (React, TypeScript, Import, etc.)
- **Auto-fix capable**: true (via `--fix` flag)

### Execution

- **Command 1**: `npm run format` (Prettier)
- **Command 2**: `npm run lint` (ESLint)
- **Max Auto-Fix Iterations**: 3
- **Fail on Error**: false (continue to report issues)

### Reporting

- **Output Format**: Short 2-sentence summary (no markdown files)
- **Report Complex Issues**: Brief summary with fix proposal
- **Auto-fix Simple Issues**: true

---

## Success Criteria

✅ All auto-fixable issues resolved  
✅ No formatting errors  
✅ Lint passes or complex issues reported  
✅ Report generated (if issues remain)
