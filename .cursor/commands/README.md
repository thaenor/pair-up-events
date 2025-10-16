# Cursor Commands Guide

## Overview

The `.cursor/commands/` directory contains specialized AI agent directives and orchestration configurations for the PairUp Events application. These commands automate code quality checks, testing validation, and documentation updates.

---

## 🎯 Quick Start

### The Orchestrator Command (New!)

The **Orchestrator** is your go-to command for comprehensive code validation:

```
@orchestrator

I've implemented the new Sidebar component. Please validate everything.
```

This automatically runs three agents in sequence:

1. **Code Review** - Validates quality and detects issues
2. **QA Testing** - Ensures test coverage and runs tests
3. **Documentation** - Updates specs and documentation

---

## 📋 Available Commands

### 1. Orchestrator (`orchestrator.md`)

**Purpose**: Coordinates all three agents in a comprehensive pipeline

**When to Use**:

- After implementing a new feature
- Before creating a pull request
- When refactoring code
- To ensure quality gates are met

**How to Invoke**:

```
@orchestrator

Describe your changes here. The system will:
1. Review your code
2. Validate tests
3. Update documentation
```

**Files**:

- `orchestrator.md` - Main orchestrator directive
- `orchestrator-usage.md` - Quick reference guide
- `orchestrator-implementation.md` - Detailed technical guide

---

### 2. Reviewer (`reviewer.xml`)

**Purpose**: Performs comprehensive code quality analysis

**Analysis Categories**:

- Logic issues (efficiency, edge cases, control flow)
- Style consistency (naming, formatting, complexity)
- Potential bugs (memory, exceptions, type safety)

**When to Use**:

- Focused code quality review
- When you need detailed issue categorization
- To validate specific code sections

**How to Invoke**:

```
@reviewer

Analyze the changes I made to Navigation.tsx
```

**Output**: Markdown table with issues, severity levels, and recommendations

---

### 3. QA Agent (`qa.xml`)

**Purpose**: Comprehensive test coverage and validation

**Responsibilities**:

- Runs full test suite (unit + Playwright)
- Identifies test failures with root causes
- Analyzes coverage gaps
- Recommends new tests

**When to Use**:

- After code changes to validate test coverage
- When test failures occur
- To ensure E2E and unit test alignment

**How to Invoke**:

```
@qa

Check test coverage for the Sidebar component changes
```

**Output**: Test validation report with metrics and recommendations

---

### 4. Documentation Agent (`documentation.md`)

**Purpose**: Keeps specifications and documentation current

**Updates**:

- `CHANGELOG.md` - Change history
- `component-tree-map.md` - Component structure
- JSDoc comments - Component documentation

**When to Use**:

- To automatically update documentation after changes
- To validate JSDoc matches implementation
- To keep component hierarchy current

**How to Invoke**:

```
@documentation

Update all docs for the new Sidebar component
```

**Output**: Updated documentation files and validation report

---

## 🔄 Pipeline Architecture

```
User Input
    ↓
@orchestrator
    ↓
┌─────────────────────────────────┐
│ PHASE 1: Code Review            │ (Reviewer)
│ - Analyze git diff              │
│ - Check logic, style, bugs      │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│ PHASE 2: QA & Testing           │ (QA Agent)
│ - Run test suite                │
│ - Analyze coverage gaps         │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│ PHASE 3: Documentation          │ (Documentation)
│ - Update CHANGELOG.md           │
│ - Update component maps         │
└────────────┬────────────────────┘
             ↓
Consolidated Final Report
```

---

## 📂 File Structure

```
.cursor/commands/
├── README.md                       ← You are here
├── orchestrator.md                 ← Main orchestrator (runs all 3 phases)
├── orchestrator-usage.md           ← Quick reference guide
├── orchestrator-implementation.md  ← Technical implementation details
├── reviewer.xml                    ← Code review agent directive
├── qa.xml                          ← QA & testing agent directive
└── documentation.md                ← Documentation agent directive
```

---

## 🚀 Usage Examples

### Example 1: New Feature Implementation

```
@orchestrator

I've implemented:
- Sidebar.tsx (new Organism component)
- Updated Navigation.tsx to integrate sidebar
- Added responsive behavior with Tailwind
- Created sidebar.spec.ts with tests

Please validate everything through the full pipeline.
```

**What Happens**:

- Reviewer checks component structure and type safety
- QA validates test coverage and runs tests
- Documentation updates CHANGELOG and component maps
- Final report shows all findings

### Example 2: Bug Fix

```
@orchestrator

Fixed the Sonner toast positioning issue in Navigation component.
The success toast no longer blocks button clicks during logout.
```

**What Happens**:

- Quick quality review of the fix
- Ensures tests pass
- Documents the fix in CHANGELOG

### Example 3: Code Refactoring

```
@orchestrator

Refactored useAuth hook to extract common logic (pure DRY principle).
No new features, purely organizational improvements.
```

**What Happens**:

- Validates refactoring maintains functionality
- Ensures no regressions
- Documents changes

---

## 📊 Output Reports

### Phase 1: Code Review Report

```markdown
# Code Review Analysis

## Logic Issues

| Location    | Issue                 | Severity | Solution       |
| ----------- | --------------------- | -------- | -------------- |
| file.tsx:45 | Unnecessary re-render | Medium   | Use React.memo |

## Style Consistency

| Location    | Problem             | Impact | Fix           |
| ----------- | ------------------- | ------ | ------------- |
| file.tsx:12 | Inconsistent naming | Medium | Use camelCase |

## Potential Bugs

| Location    | Risk          | Type        | Recommendation     |
| ----------- | ------------- | ----------- | ------------------ |
| file.tsx:78 | Type mismatch | Type Safety | Add type assertion |

## Summary

- Critical: 0 | High: 1 | Medium: 2 | Low: 0
```

### Phase 2: QA Report

```markdown
# Test Validation Report

## Test Results

- Total Tests: 48
- Passed: 48 (100%)
- Failed: 0
- Coverage Change: +2.3%

## Coverage by Type

- Unit Tests: 95%
- E2E Tests: 88%
- Integration: 92%

## Recommendations

- Add 2 unit tests for edge cases
- Add 1 E2E test for user flow
```

### Phase 3: Documentation Report

```markdown
# Documentation Updates

## Files Updated

- ✅ CHANGELOG.md
- ✅ component-tree-map.md
- ✅ Sidebar.tsx JSDoc

## Changes Summary

- Added: Sidebar component documentation
- Updated: Navigation component description
- Breaking Changes: None
```

### Final Consolidated Report

```
═══════════════════════════════════════════════════════════
        ORCHESTRATOR PIPELINE FINAL REPORT
═══════════════════════════════════════════════════════════

📋 Code Review:       ✅ 0 Critical | 1 High | 2 Medium
🧪 Testing:          ✅ 100% Pass Rate | +2.3% Coverage
📚 Documentation:    ✅ 3 Files Updated

OVERALL STATUS: ✅ PASS WITH RECOMMENDATIONS
═══════════════════════════════════════════════════════════

Next Steps:
1. Address High/Medium priority issues
2. Consider coverage recommendations
3. Review documentation updates
4. Commit with pipeline report attached
```

---

## 🎛️ Command Reference

| Command                | Purpose                            | When to Use         |
| ---------------------- | ---------------------------------- | ------------------- |
| `@orchestrator`        | Full pipeline (Review → QA → Docs) | Most common         |
| `@reviewer`            | Code review only                   | Quick quality check |
| `@qa`                  | Testing validation only            | Check test coverage |
| `@documentation`       | Update docs only                   | Keep specs current  |
| `@orchestrator --help` | Show help guide                    | Need guidance       |
| `@orchestrator --auto` | Auto-run on commit                 | CI/CD integration   |

---

## ⚙️ Configuration

All commands respect your project configuration:

**File**: `.cursor/config.json`

**Key Settings**:

- `preferences.architecture`: Enforces atomic design pattern
- `testing.framework`: Uses Vitest for unit tests
- `testing.library`: Uses React Testing Library
- `rules.requireTests`: Requires tests for new code
- `reviewAgent.focusAreas`: Review priorities

---

## 📈 Best Practices

### ✅ DO

- Run orchestrator after each feature
- Review all findings, even "Low" severity
- Act on documentation updates immediately
- Keep CHANGELOG current
- Run early and often (not just before commits)

### ❌ DON'T

- Ignore Critical/High severity findings
- Skip test coverage recommendations
- Manually modify auto-generated documentation
- Run on uncommitted sensitive changes
- Use orchestrator for single-character fixes

---

## 🔧 Troubleshooting

### "Tests are failing"

→ Run `npm test` separately to diagnose
→ Fix issues then re-run orchestrator

### "Coverage is too low"

→ Check Phase 2 report for specific gaps
→ Write recommended tests
→ Re-run to validate coverage

### "Documentation didn't update"

→ Verify CHANGELOG.md is accessible
→ Check component-tree-map.md format
→ Run documentation agent directly

### "Pipeline seems stuck"

→ Check if test suite is running slowly
→ Try running individual agents
→ Contact support if persistent

---

## 🤝 Integration Examples

### With Git Pre-Commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running orchestrator pipeline..."
@orchestrator --auto

if [ $? -ne 0 ]; then
    echo "Pipeline failed. Commit cancelled."
    exit 1
fi

git add .
exit 0
```

### With GitHub Actions

```yaml
name: Quality Pipeline
on: [pull_request]

jobs:
  orchestrator:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Cursor Orchestrator
        run: |
          @orchestrator
```

### Manual Workflow

```
1. Make code changes
2. Run: @orchestrator
3. Review findings
4. Address recommendations
5. Commit + Push
6. Create PR
```

---

## 📚 Related Documentation

- **Design Doc**: `Docs/Design-doc.md` - Architecture overview
- **Component Map**: `Docs/component-tree-map.md` - Component hierarchy
- **Changelog**: `Docs/CHANGELOG.md` - Change history
- **Agents Guide**: `Docs/agents.md` - Agent specifications
- **Testing Recommendations**: `Docs/testing-recommendations.md` - Test strategies

---

## 🎓 Learning Path

1. **Start Here**: Read this README
2. **Quick Guide**: See `orchestrator-usage.md`
3. **Deep Dive**: Review `orchestrator-implementation.md`
4. **Individual Agents**: Check `reviewer.xml`, `qa.xml`, `documentation.md`
5. **Project Config**: Study `.cursor/config.json` for standards

---

## 💡 Pro Tips

1. **Version Tracking**: Review final reports for team knowledge
2. **Pattern Recognition**: Notice recurring findings to improve code
3. **Test-Driven**: Use QA recommendations to guide development
4. **Documentation-First**: Let the agent keep specs current
5. **Feedback Loop**: Each pipeline run improves future runs

---

## 📞 Support

- Check troubleshooting section above
- Review individual command documentation
- Consult `Docs/agents.md` for agent specifications
- Review project configuration in `.cursor/config.json`

---

## 📝 Changelog

### Version 1.0 (October 2025)

- ✨ Initial release of Orchestrator system
- 🎯 Three-phase pipeline (Review → QA → Docs)
- 📚 Comprehensive documentation
- 🚀 Ready for production use

---

## 📄 Files in This Directory

| File                             | Purpose                       | Size | Format   |
| -------------------------------- | ----------------------------- | ---- | -------- |
| `README.md`                      | This file - commands overview | -    | Markdown |
| `orchestrator.md`                | Main orchestrator agent       | ~2KB | Markdown |
| `orchestrator-usage.md`          | Quick reference guide         | ~4KB | Markdown |
| `orchestrator-implementation.md` | Technical details             | ~6KB | Markdown |
| `reviewer.xml`                   | Code review specifications    | ~2KB | XML      |
| `qa.xml`                         | QA testing specifications     | ~2KB | XML      |
| `documentation.md`               | Documentation specifications  | ~2KB | Markdown |

---

## 🎯 Next Steps

Ready to use the orchestrator? Try:

```
@orchestrator

I've completed my code changes. Please run the full pipeline.
```

Then review the comprehensive report and recommendations!

---

**Created for**: PairUp Events Application  
**Version**: 1.0  
**Last Updated**: October 2025  
**Maintainer**: Development Team

For questions or improvements, please refer to the project's documentation in `Docs/`
