# Orchestrator Command - Quick Reference & Usage Guide

## Overview

The **Orchestrator Command** is a powerful workflow automation tool that coordinates multiple specialized agents to perform comprehensive code quality checks, testing validation, and documentation updates in a single, efficient pipeline.

---

## Quick Start: How to Use

### Option 1: Simple Invocation

In Cursor, open the Command Palette and type:

```
@orchestrator
```

Then provide your initial prompt describing what you changed or what feature you want validated.

### Option 2: Explicit Agent Request

You can also trigger the full pipeline by simply stating:

```
Run the orchestrator on the current changes
```

or

```
Execute the full quality pipeline
```

---

## What Happens Next

When you invoke the orchestrator, it automatically triggers three sequential phases:

### 🔍 **Phase 1: Code Review** (Reviewer Agent)

The reviewer analyzes your code changes for:

- ✅ Logic issues (algorithmic efficiency, edge cases)
- ✅ Style consistency (naming, formatting, complexity)
- ✅ Potential bugs (type safety, exception handling)

**Output**: Markdown report with severity levels and recommendations

### ✅ **Phase 2: QA & Testing** (QA Agent)

The QA agent ensures comprehensive test coverage:

- ✅ Runs full test suite (unit + E2E tests)
- ✅ Identifies test failures and root causes
- ✅ Analyzes coverage gaps for modified code
- ✅ Recommends new tests to add

**Output**: Test validation report with coverage metrics

### 📚 **Phase 3: Documentation** (Documentation Agent)

The documentation agent keeps specs current:

- ✅ Updates CHANGELOG.md with code changes
- ✅ Updates component-tree-map.md
- ✅ Validates/updates JSDoc comments
- ✅ Flags breaking changes

**Output**: Documentation updates and validation report

---

## Expected Output

The orchestrator generates a comprehensive **Final Report** containing:

```
ORCHESTRATOR PIPELINE REPORT
==============================

Phase 1: Code Review Summary
- Critical Issues: X
- High Priority Issues: X
- Medium Issues: X
- Low Issues: X
- Key Findings: [Summary of major concerns]

Phase 2: QA & Testing Summary
- Overall Test Pass Rate: X%
- Coverage Change: ±X%
- New Tests Recommended: X
- Failed Tests: [List and root causes]

Phase 3: Documentation Summary
- Files Updated: X
- New Components Documented: X
- Component Changes: X
- Breaking Changes: X

OVERALL STATUS: [PASS ✅ | WARNING ⚠️ | REVIEW RECOMMENDED 🔍]

Actionable Recommendations:
1. [Priority recommendation]
2. [Next priority]
3. [Follow-up action]
```

---

## When to Use the Orchestrator

### ✅ Perfect For:

- After implementing a new feature
- Before creating a pull request
- When refactoring code
- Before merging to main branch
- To ensure quality gates are met
- To auto-update documentation

### ⚠️ Not Ideal For:

- Simple one-line bug fixes
- Minor comment updates
- Configuration-only changes

---

## Command Context Files

The orchestrator references three command specifications:

1. **`.cursor/commands/reviewer.md`** - Code quality standards
2. **`.cursor/commands/qa.md`** - Testing requirements (with autonomous fixing)
3. **`.cursor/commands/documentation.md`** - Documentation standards

All commands follow your project's `.cursor/config.json` configuration.

---

## Example Workflow

### Scenario: You've just created a new sidebar component

**You**:

```
@orchestrator

I've created a new Sidebar component at src/components/organisms/Navigation/Sidebar.tsx
with responsive behavior and navigation items. Please run the full pipeline.
```

**Orchestrator Response**:

```
✨ Starting automated multi-agent pipeline...

📋 Phase 1: Code Review Analysis
   Analyzing Sidebar.tsx (234 lines)
   ✅ Type safety: All props properly typed
   ⚠️  Medium: Consider memoizing navigation callbacks
   ✅ Style: Consistent with atomic design

🧪 Phase 2: QA & Testing
   Running test suite...
   ✅ Existing tests: 45/45 passed
   ⚠️  Warning: No tests for new Sidebar component
   📝 Recommended: Add 3 unit tests + 1 E2E test

📚 Phase 3: Documentation
   ✅ Updated CHANGELOG.md with new component
   ✅ Updated component-tree-map.md (Organisms count: +1)
   ✅ Generated JSDoc for Sidebar props

🎯 OVERALL STATUS: PASS WITH RECOMMENDATIONS ✅
```

---

## FAQ

### Q: Can I skip a phase?

**A**: The orchestrator runs all three phases sequentially for comprehensive quality. If you only need code review, invoke the reviewer directly: `@reviewer`

### Q: What if tests fail?

**A**: The orchestrator documents all failures in the report. You can then fix issues and re-run the pipeline.

### Q: How long does the pipeline take?

**A**: Typically 2-5 minutes depending on code complexity and test suite size.

### Q: Does it modify my code?

**A**: No. The orchestrator is non-destructive. Only the documentation agent updates files (CHANGELOG.md, component-tree-map.md, JSDoc).

### Q: Can I automate this on git commit?

**A**: Yes! In your git pre-commit hook, you can invoke: `@orchestrator --auto`

---

## Integration with Your Workflow

The orchestrator is designed to integrate into your development cycle:

```
Feature Development
        ↓
Local Testing
        ↓
@orchestrator (Run full pipeline)
        ↓
Address recommendations (if any)
        ↓
Commit changes
        ↓
Create PR
```

---

## Pro Tips

1. **Run early**: Execute the orchestrator frequently during development, not just before commits
2. **Review findings**: Pay attention to all severity levels, even "Low" issues
3. **Update docs**: The documentation agent saves time; let it keep your specs current
4. **Test-driven**: Use QA recommendations to guide test development
5. **Check reports**: Save the generated reports for team knowledge sharing

---

## Troubleshooting

### "Tests are failing"

→ Run `npm test` separately to diagnose, fix, then re-run orchestrator

### "Coverage is too low"

→ Check Phase 2 report for specific gaps and recommended tests

### "Documentation out of date"

→ Phase 3 handles this automatically; check the documentation report

### "Critical issues found"

→ Address High/Critical severity items first (shown in Phase 1 report)

---

## Related Commands

- `@reviewer` - Code quality review only
- `@qa` - Testing & coverage validation only
- `@documentation` - Update docs and specs only

---

**Created for**: PairUp Events Application  
**Version**: 1.0  
**Last Updated**: October 2025
