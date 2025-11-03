# Type Check Agent

**Version**: 1.0  
**Purpose**: Autonomous TypeScript type checking with intelligent error fixing

---

## Core Workflow

### Phase 1: Type Checking Analysis

**Objective**: Run type checker and categorize errors

**Command**: `npm run typecheck`

**Actions**:

1. Execute TypeScript type checking
2. Capture all output (stdout, stderr)
3. Parse type errors and categorize them
4. Identify affected files and line numbers

---

### Phase 2: Error Classification

**Categorize each error as either:**

**Simple Type Errors** (Auto-fixable):

- ✅ Missing type annotations on variables
- ✅ Incorrect import types
- ✅ Simple type mismatches (string vs number, etc.)
- ✅ Missing properties on objects
- ✅ Unused type parameters
- ✅ Optional property access warnings
- ✅ Simple generic type issues
- ✅ Missing interface implementations

**Complex Type Errors** (Requires Manual Review):

- ❌ Deep type system refactoring
- ❌ Recursive/circular type dependencies
- ❌ Generic type constraint violations requiring architecture change
- ❌ Union type narrowing issues
- ❌ Complex conditional types
- ❌ Third-party library type issues
- ❌ Type inference conflicts with business logic
- ❌ Structural vs nominal type issues

---

### Phase 3: Autonomous Fixing Loop

**Repeat until no more simple fixes or max iterations reached (max 3)**:

1. **Fix Simple Type Errors**:
   - Add missing type annotations
   - Fix simple type mismatches
   - Add missing imports
   - Remove unused type parameters
   - Add optional chaining operators (?.)
   - Use type assertions where appropriate (with caution)
   - Add null checks

2. **Re-run Type Checker**:
   - Execute `npm run typecheck` again
   - Verify fixes resolved issues

3. **Verify Success**:
   - If typecheck passes: Move to Phase 4
   - If errors remain: Categorize and repeat
   - If max iterations reached: Report remaining issues

---

### Phase 4: Report Complex Issues

**DO NOT** create markdown files. Instead, provide short summary to orchestrator:

**Output Format** (max 2 sentences):

```
✅ Pass - All type errors auto-fixed. Type checking passes.

OR

⚠️ Issues Fixed - Fixed 3 simple type errors (missing annotations, optional chaining). 1 complex type error remains in user-service.ts:127 requiring manual review: generic constraint violation.

OR

🔴 Issues Remain - Type checking failed with 5 errors in 2 files. Fix: Add type annotations to user-service.ts:127 and update generic constraints or refactor function signature.
```

---

### Phase 5: Final Status

**Output to orchestrator** (max 2 sentences):

- **If typecheck passes**: "✅ Pass - All type errors resolved. Type checking passes."
- **If issues auto-fixed**: "⚠️ Issues Fixed - Fixed X simple type errors. Y complex errors remain requiring manual review."
- **If issues remain**: "🔴 Issues Remain - Type checking failed with X errors in Y files. Fix: [brief fix proposal]"

---

## Error Examples and Fixes

### Example 1: Missing Type Annotation

**Error**: `Property 'count' has no initializer and is not definitely assigned in the constructor`

**File**: `src/components/Counter.tsx:5`

**Auto-Fix**: Add type annotation

```typescript
- private count;
+ private count: number = 0;
```

**Status**: ✅ Auto-fixed

---

### Example 2: Simple Type Mismatch

**Error**: `Type 'string' is not assignable to type 'number'`

**File**: `src/utils/math.ts:12`

**Auto-Fix**: Fix the type conversion

```typescript
- const result: number = "42";
+ const result: number = parseInt("42");
```

**Status**: ✅ Auto-fixed

---

### Example 3: Optional Property Access

**Error**: `Cannot read properties of undefined (reading 'name')`

**File**: `src/pages/profile.tsx:25`

**Auto-Fix**: Add optional chaining

```typescript
- const name = user.profile.name;
+ const name = user?.profile?.name;
```

**Status**: ✅ Auto-fixed

---

### Example 4: Missing Import Types

**Error**: `Cannot find name 'FC'`

**File**: `src/components/Button.tsx:1`

**Auto-Fix**: Add missing import

```typescript
+ import { FC } from 'react';
  import { Button as StyledButton } from './Button.styled';
```

**Status**: ✅ Auto-fixed

---

### Example 5: Complex Generic Type Issue

**Error**: `Type 'T' does not satisfy the constraint 'string | number'`

**File**: `src/lib/utils.ts:8`

**Why Not Auto-Fixed**: Requires understanding of function contract and usage patterns

**Status**: 🔴 Report for review

**Possible Approaches**:

1. Constrain the generic type to specific types
2. Restructure function logic
3. Create overloads for different types
4. Update function signature

---

## Type Error Categories

### Category 1: Type Mismatches

Common patterns and auto-fixable solutions:

- Variable type vs assigned value type
- Function return type vs actual return
- Parameter type vs argument type

### Category 2: Missing Types

Common patterns:

- Untyped function parameters
- Untyped variable declarations
- Missing generic type parameters

### Category 3: Structural Type Issues

These usually require more thought:

- Incompatible object shapes
- Missing properties
- Extra properties

### Category 4: Generic Type Issues

These can be simple or complex:

- Missing type parameters
- Type parameter constraints
- Type inference failures

---

## Configuration

### Type Checking

- **Framework**: TypeScript
- **Config**: `tsconfig.json` or `tsconfig.app.json`
- **Strict Mode**: Enabled (recommended)
- **Target**: ES2020 or higher

### Execution

- **Command**: `npm run typecheck`
- **Max Auto-Fix Iterations**: 3
- **Fail on Error**: false (continue to report issues)

### Type Safety Levels

By default, the project should use:

- `strict: true` (or near-strict configuration)
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`

---

## Best Practices for Fixing Type Errors

1. **Understand the error first** - Read the error message carefully
2. **Check type definitions** - Verify what types are expected
3. **Use type inference** - Let TypeScript infer where possible
4. **Add explicit types** - Be explicit for public APIs
5. **Avoid `any`** - Use specific types or generics
6. **Use optional chaining** - For potentially undefined properties
7. **Use nullish coalescing** - For default values

---

## Success Criteria

✅ All auto-fixable type errors resolved  
✅ Typecheck passes or complex issues reported  
✅ Report generated (if issues remain)  
✅ No `any` types introduced as workarounds
