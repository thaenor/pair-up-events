# Orchestrator Implementation Guide

## Table of Contents

1. [How to Trigger](#how-to-trigger)
2. [Pipeline Execution Flow](#pipeline-execution-flow)
3. [Agent Specifications](#agent-specifications)
4. [Context Passing Between Phases](#context-passing-between-phases)
5. [Output Reports](#output-reports)
6. [Integration Examples](#integration-examples)

---

## How to Trigger

### Method 1: Direct Agent Reference (Recommended)

Open Cursor's Command Palette and type:

```
@orchestrator
```

Then in your message, describe your changes:

```
I've implemented the new Sidebar component with navigation menus and
responsive behavior. Please run the full pipeline to validate everything.
```

### Method 2: Explicit Pipeline Request

```
Run the full orchestrator pipeline on the current changes
```

### Method 3: Combined with Specific Context

```
@orchestrator

Changes Made:
- Added Sidebar.tsx component
- Updated Navigation.tsx to include new sidebar
- Created sidebar.spec.ts tests

Please validate all changes through the complete pipeline.
```

---

## Pipeline Execution Flow

```
┌─────────────────────────────────────────┐
│   ORCHESTRATOR INITIALIZES              │
│   (Receives user prompt & context)      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
     ┌─────────────────────────────┐
     │ PHASE 1: CODE REVIEW        │
     │ (Reviewer Agent)            │
     │                             │
     │ 1. Analyze git diff         │
     │ 2. Check logic issues       │
     │ 3. Check style consistency  │
     │ 4. Check for bugs           │
     │ 5. Generate report          │
     │                             │
     └─────────────┬───────────────┘
                   │
                   ▼ (Pass findings)
     ┌─────────────────────────────┐
     │ PHASE 2: QA & TESTING       │
     │ (QA Agent)                  │
     │                             │
     │ 1. Run test suite           │
     │ 2. Analyze failures         │
     │ 3. Check coverage gaps      │
     │ 4. Generate report          │
     │                             │
     └─────────────┬───────────────┘
                   │
                   ▼ (Pass coverage findings)
     ┌─────────────────────────────┐
     │ PHASE 3: DOCUMENTATION      │
     │ (Documentation Agent)       │
     │                             │
     │ 1. Update CHANGELOG.md      │
     │ 2. Update component map     │
     │ 3. Validate JSDoc           │
     │ 4. Generate report          │
     │                             │
     └─────────────┬───────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ ORCHESTRATOR CONSOLIDATES FINDINGS       │
│ (Generates final comprehensive report)   │
└──────────────────────────────────────────┘
```

---

## Agent Specifications

### Phase 1: Reviewer Agent

**File**: `.cursor/commands/reviewer.md`

**Input Context**:

- Current staged and unstaged changes
- Project standards from `.cursor/config.json`
- Review thresholds (Medium severity minimum)

**Analysis Areas**:

| Category              | Checks                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------- |
| **Logic Issues**      | Algorithmic efficiency, edge cases, control flow accuracy, logical implementation integrity |
| **Style Consistency** | Coding standards, naming conventions, formatting uniformity, code complexity                |
| **Potential Bugs**    | Memory management, exception handling, type safety, boundary conditions                     |

**Output Format**: Markdown table with columns:

- Location (file:line)
- Issue
- Severity (Low/Medium/High/Critical)
- Recommended Solution

**Severity Guide**:

- 🔴 **Critical**: Breaks functionality or violates critical patterns
- 🟠 **High**: Significant improvement opportunity or pattern violation
- 🟡 **Medium**: Should address; impacts maintainability
- 🟢 **Low**: Nice to have; minor style issues

---

### Phase 2: QA Agent

**File**: `.cursor/commands/qa.md` (v3.0 with autonomous fixing)

**Input Context**:

- Code changes from Phase 1
- Current test suite status
- Coverage requirements from `.cursor/config.json`

**Validation Steps**:

1. **Existing Test Suite**
   - Run: `npm test`
   - Identify failing tests
   - Document failure root causes

2. **Coverage Analysis**
   - Calculate unit test coverage
   - Calculate E2E test coverage
   - Compare against previous coverage

3. **Gap Identification**
   - Missing tests for new functionality
   - Missing E2E tests for user flows
   - Edge case coverage gaps

**Output Format**: Markdown report with sections:

- Existing Test Failures (table)
- Fixed Tests (list)
- New Tests Recommended (table)
- Coverage Summary (metrics)

**Metrics Provided**:

- Total tests: X
- Passed: X (Y%)
- Failed: X (Z%)
- Coverage change: ±X%

---

### Phase 3: Documentation Agent

**File**: `.cursor/commands/documentation.md`

**Input Context**:

- Code changes from Phase 1
- Test improvements from Phase 2
- Component tree structure

**Update Procedures**:

1. **CHANGELOG.md Updates**

   ```
   ## [Unreleased]

   ### Added
   - New Sidebar component with responsive navigation
   - Settings page with user preferences

   ### Changed
   - Navigation component now includes sidebar integration
   - Updated test suite with new E2E tests

   ### Fixed
   - Toast notification positioning (Sonner integration)
   ```

2. **component-tree-map.md Updates**
   - Add new components to correct atomic level
   - Update component counts
   - Add to component categories section
   - Document structural changes

3. **JSDoc Validation**
   - Verify prop types match implementation
   - Update examples if changed
   - Ensure feature lists are current
   - Check parameter documentation

**Output Format**:

- Updated files confirmation
- List of changed documentation
- Validation report

---

## Context Passing Between Phases

### Review → QA Context

The orchestrator passes from Phase 1 to Phase 2:

```json
{
  "filesModified": ["src/components/organisms/Navigation/Sidebar.tsx"],
  "linesAdded": 234,
  "linesRemoved": 12,
  "componentsAdded": ["Sidebar"],
  "componentsModified": ["Navigation"],
  "reviewFindings": {
    "critical": 0,
    "high": 1,
    "medium": 2
  }
}
```

### QA → Documentation Context

The orchestrator passes from Phase 2 to Phase 3:

```json
{
  "testStatus": "4 new tests recommended",
  "coverageChange": "+2.3%",
  "failingTests": [],
  "newTestsNeeded": ["Sidebar component rendering", "Navigation integration", "Responsive behavior"]
}
```

---

## Output Reports

### Individual Phase Reports

#### Phase 1: Code Review Report

```markdown
# Code Review Analysis

## Logic Issues

| Location       | Issue                                | Severity | Recommended Solution |
| -------------- | ------------------------------------ | -------- | -------------------- |
| Sidebar.tsx:45 | Unnecessary re-render on prop change | Medium   | Memoize component    |

## Style Consistency

[Style findings table]

## Potential Bugs

[Bug findings table]

## Summary

- Critical: 0
- High: 1
- Medium: 2
- Low: 0
```

#### Phase 2: QA Report

```markdown
# Test Validation Report

## Existing Test Failures

[Failures table - currently showing 0 failures]

## New Tests Created

| Test Type | Name                       | Coverage  | Status |
| --------- | -------------------------- | --------- | ------ |
| Unit      | Sidebar renders with props | 100%      | ✅     |
| E2E       | Navigation to settings     | User flow | ✅     |

## Coverage Summary

- Total Tests: 48
- Passed: 48 (100%)
- Failed: 0
- Coverage Change: +2.3%
```

#### Phase 3: Documentation Report

```markdown
# Documentation Updates

## Files Updated

- ✅ CHANGELOG.md
- ✅ component-tree-map.md
- ✅ Sidebar.tsx JSDoc

## Components Added

- Sidebar (Organism)

## Structural Changes

- Navigation.tsx now integrates Sidebar component
- Settings page added to routes

## Breaking Changes

- None detected
```

### Consolidated Final Report

```
═══════════════════════════════════════════════════════════
        ORCHESTRATOR PIPELINE FINAL REPORT
═══════════════════════════════════════════════════════════

📋 PHASE 1: CODE REVIEW
   Status: ✅ COMPLETED
   Critical Issues: 0
   High Priority: 1
   Medium: 2
   Low: 0
   Key Findings: Minor optimization opportunity identified

🧪 PHASE 2: QA & TESTING
   Status: ✅ COMPLETED
   Test Pass Rate: 100% (48/48)
   Coverage Change: +2.3%
   New Tests: 4 added
   Failing Tests: 0

📚 PHASE 3: DOCUMENTATION
   Status: ✅ COMPLETED
   Files Updated: 3
   Components: +1 (Sidebar)
   Breaking Changes: 0

═══════════════════════════════════════════════════════════
OVERALL PIPELINE STATUS: ✅ PASS WITH RECOMMENDATIONS
═══════════════════════════════════════════════════════════

Actionable Recommendations:
1. Review memoization suggestion in Sidebar.tsx (Medium priority)
2. Consider edge case handling for responsive behavior
3. Document new settings page in user guide

Next Steps:
→ Address recommendations above
→ Commit changes with generated documentation
→ Create PR with full pipeline report attached
```

---

## Integration Examples

### Example 1: Feature Implementation

**Scenario**: Adding new Sidebar component

**Invocation**:

```
@orchestrator

I've completed the Sidebar component with the following:
- New component: Sidebar.tsx (Organism)
- Updated: Navigation.tsx to integrate sidebar
- Added: Responsive menu behavior
- Tests: Basic unit and E2E tests

Please run the full pipeline.
```

**Expected Flow**:

1. **Review**: Checks component structure, type safety, styling
2. **QA**: Validates test coverage for new component
3. **Docs**: Updates CHANGELOG, component-tree-map, adds JSDoc
4. **Output**: Consolidated report with all findings

### Example 2: Bug Fix Validation

**Scenario**: Fixed toast notification positioning

**Invocation**:

```
@orchestrator

Fixed the Sonner toast positioning issue in Navigation component.
The success toast no longer blocks button clicks during logout.
```

**Expected Flow**:

1. **Review**: Checks fix implementation
2. **QA**: Runs tests to ensure fix works
3. **Docs**: Updates CHANGELOG with fix note
4. **Output**: Confirmation report

### Example 3: Refactoring

**Scenario**: Extract common logic to hooks

**Invocation**:

```
@orchestrator

Refactored useAuth hook to extract common logic.
No new features, purely DRY principle application.
```

**Expected Flow**:

1. **Review**: Checks refactoring quality
2. **QA**: Validates no regressions
3. **Docs**: Documents refactoring in CHANGELOG
4. **Output**: Refactoring validation report

---

## Quick Command Reference

| Task               | Command                |
| ------------------ | ---------------------- |
| Full pipeline      | `@orchestrator`        |
| Code review only   | `@reviewer`            |
| Testing only       | `@qa`                  |
| Documentation only | `@documentation`       |
| Show this guide    | `@orchestrator --help` |
| Auto-run on commit | `@orchestrator --auto` |

---

## Troubleshooting Common Issues

### "Review phase never completed"

- Check for large diffs (>2000 lines might timeout)
- Split changes into smaller batches
- Run reviewer directly: `@reviewer`

### "Tests timing out"

- Some E2E tests may take time
- Check for flaky tests in sidebar.spec.ts
- Review memory consumption

### "Documentation not updating"

- Verify file paths are correct
- Check CHANGELOG.md is accessible
- Ensure component-tree-map.md format is valid

### "Context lost between phases"

- Rare occurrence; restart orchestrator
- Provide explicit file list in your prompt

---

## Best Practices

✅ **DO**:

- Run orchestrator early and often
- Review all findings, even "Low" severity
- Act on documentation updates immediately
- Keep CHANGELOG current

❌ **DON'T**:

- Ignore Critical/High severity findings
- Skip test coverage recommendations
- Modify documentation manually (let agent handle it)
- Run on uncommitted sensitive changes

---

**Version**: 1.0  
**Last Updated**: October 2025  
**Part of**: `.cursor/commands/` orchestration system
