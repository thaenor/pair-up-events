# Orchestrator System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      CURSOR COMMAND SYSTEM                      │
│                   PairUp Events Application                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                   ┌───────────────────────┐
                   │   @orchestrator       │
                   │  (Main Entry Point)   │
                   └───────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
         ┌────────────┐ ┌────────────┐ ┌────────────┐
         │ REVIEWER   │ │    QA      │ │DOCUMENTER  │
         │            │ │            │ │            │
         │ @reviewer  │ │   @qa      │ │@documenter │
         └────────────┘ └────────────┘ └────────────┘
```

---

## Three-Phase Pipeline

```
USER PROMPT
    │
    ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: CODE REVIEW (Reviewer Agent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Input: Git diff (staged & unstaged changes)

    Processes:
    ├─ Logic Issues
    │  ├─ Algorithmic efficiency
    │  ├─ Edge case handling
    │  ├─ Control flow accuracy
    │  └─ Logical implementation integrity
    │
    ├─ Style Consistency
    │  ├─ Coding standards compliance
    │  ├─ Naming conventions
    │  ├─ Formatting uniformity
    │  └─ Code complexity
    │
    └─ Potential Bugs
       ├─ Memory management
       ├─ Exception handling
       ├─ Type safety
       └─ Boundary conditions

    Output: Markdown Report
    ├─ Issue Category | Location | Severity | Solution
    ├─ Severity Levels: Critical | High | Medium | Low
    └─ Summary Statistics

    ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: QA & TESTING (QA Agent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Input: Code changes + Review findings

    Processes:
    ├─ Existing Test Suite Validation
    │  ├─ Run: npm test
    │  ├─ Unit Tests (Vitest + React Testing Library)
    │  └─ E2E Tests (Playwright)
    │
    ├─ Coverage Analysis
    │  ├─ Unit test coverage %
    │  ├─ E2E coverage %
    │  └─ Coverage change calculation
    │
    └─ Gap Identification
       ├─ Missing unit tests
       ├─ Missing E2E tests
       └─ Edge case coverage gaps

    Output: Test Validation Report
    ├─ Test Results Table (Pass/Fail/Coverage)
    ├─ Failure Analysis (Root causes)
    ├─ Coverage Metrics (Before/After)
    └─ Recommended Tests

    ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3: DOCUMENTATION (Documentation Agent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Input: Code changes + Test improvements

    Processes:
    ├─ CHANGELOG.md Updates
    │  ├─ Document code changes
    │  ├─ Record test improvements
    │  ├─ Flag breaking changes
    │  └─ Add feature descriptions
    │
    ├─ component-tree-map.md Updates
    │  ├─ Add new components
    │  ├─ Update component counts
    │  ├─ Modify descriptions
    │  └─ Document structural changes
    │
    └─ JSDoc Validation
       ├─ Verify prop types
       ├─ Update examples
       ├─ Check feature lists
       └─ Validate parameters

    Output: Documentation Report
    ├─ Updated Files Confirmation
    ├─ Component Changes Summary
    ├─ Breaking Changes Alert
    └─ Validation Status

    ▼
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONSOLIDATION: Final Report Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Inputs: Phase 1, 2, 3 outputs

    Generates:
    ├─ Executive Summary
    ├─ Phase 1 Findings Summary
    ├─ Phase 2 Metrics Summary
    ├─ Phase 3 Changes Summary
    ├─ Overall Status (PASS/WARNING/REVIEW)
    └─ Actionable Recommendations

    Output: CONSOLIDATED PIPELINE REPORT
    ▼
```

---

## Data Flow Between Phases

```
Phase 1 (Review)
    │
    ├─→ Files Modified
    ├─→ Lines Added/Removed
    ├─→ Components Changed
    └─→ Review Findings
         │
         └──────────────────┐
                            │
                            ▼ (Context Passing)
                        Phase 2 (QA)
                            │
                            ├─→ Test Status
                            ├─→ Coverage Changes
                            ├─→ Failed Tests
                            └─→ New Tests Needed
                                 │
                                 └──────────────────┐
                                                    │
                                                    ▼ (Context Passing)
                                                Phase 3 (Docs)
                                                    │
                                                    ├─→ Updated CHANGELOG
                                                    ├─→ Updated Components Map
                                                    └─→ Updated JSDoc
                                                         │
                                                         └──────────────────┐
                                                                            │
                                                                            ▼
                                                            CONSOLIDATED FINAL REPORT
```

---

## Component Interactions

```
┌──────────────────────────────────────────────────────┐
│                 .cursor/commands/                     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │         orchestrator.md                      │   │
│  │  (Coordinator & Context Manager)            │   │
│  │                                              │   │
│  │  Responsibilities:                          │   │
│  │  ├─ Sequence execution (Phase 1→2→3)       │   │
│  │  ├─ Pass context between phases            │   │
│  │  ├─ Consolidate findings                   │   │
│  │  └─ Generate final report                  │   │
│  └──────────┬───────────────┬──────────────────┘   │
│             │               │                      │
│    ┌────────▼─────┐ ┌──────▼────────┐ ┌───────────▼────┐
│    │ reviewer.xml  │ │   qa.xml      │ │documentation.md│
│    │               │ │               │ │                │
│    │ Phase 1:      │ │ Phase 2:      │ │ Phase 3:       │
│    │ Code Review   │ │ QA & Testing  │ │ Documentation  │
│    └───────────────┘ └───────────────┘ └────────────────┘
│
└──────────────────────────────────────────────────────┘
         │                    │                 │
         ▼                    ▼                 ▼
    Markdown Report    Test Report         Updated Files
    (Issues Table)    (Metrics Table)    (CHANGELOG, etc.)
         │                    │                 │
         └────────────────────┴─────────────────┘
                              │
                              ▼
                    CONSOLIDATED REPORT
```

---

## Command Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                  @orchestrator                          │
│            (Full Pipeline - Recommended)                │
└────────────────┬──────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
    ▼            ▼            ▼              ▼
┌────────┐  ┌───────┐  ┌──────────┐  ┌────────────────┐
│@review │  │ @qa   │  │@document │  │ @orchestrator  │
│        │  │       │  │          │  │ --auto         │
│(Phase1)│  │(Phase2)│  │(Phase3)  │  │ (For CI/CD)    │
└────────┘  └───────┘  └──────────┘  └────────────────┘

Individual agents: Quick, focused checks
Full orchestrator: Comprehensive validation
Auto mode: CI/CD integration
```

---

## Output Report Structure

```
╔════════════════════════════════════════════════════════════════╗
║         ORCHESTRATOR PIPELINE FINAL REPORT                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ 📋 PHASE 1: CODE REVIEW                                        ║
║  Status: ✅ COMPLETED                                          ║
║  ├─ Critical Issues: 0                                         ║
║  ├─ High Priority: 1                                           ║
║  ├─ Medium: 2                                                  ║
║  ├─ Low: 0                                                     ║
║  └─ [Detailed Findings Table]                                  ║
║                                                                ║
║ 🧪 PHASE 2: QA & TESTING                                       ║
║  Status: ✅ COMPLETED                                          ║
║  ├─ Test Pass Rate: 100% (48/48)                              ║
║  ├─ Coverage Change: +2.3%                                     ║
║  ├─ New Tests: 4 added                                         ║
║  ├─ Failing Tests: 0                                           ║
║  └─ [Coverage Details Table]                                   ║
║                                                                ║
║ 📚 PHASE 3: DOCUMENTATION                                      ║
║  Status: ✅ COMPLETED                                          ║
║  ├─ Files Updated: 3                                           ║
║  │  ├─ CHANGELOG.md                                            ║
║  │  ├─ component-tree-map.md                                   ║
║  │  └─ Sidebar.tsx JSDoc                                       ║
║  ├─ Components Added: 1                                        ║
║  ├─ Breaking Changes: 0                                        ║
║  └─ [Components Summary]                                       ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║ OVERALL STATUS: ✅ PASS WITH RECOMMENDATIONS                  ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║ Actionable Recommendations:                                    ║
║ 1. ⚠️  Medium: Consider memoizing Sidebar component           ║
║ 2. 📝 Document new settings page in user guide                ║
║ 3. 🧪 Add 2 unit tests for edge cases                         ║
║                                                                ║
║ Next Steps:                                                    ║
║ → Address High/Medium priority issues                          ║
║ → Implement recommended tests                                  ║
║ → Review documentation updates                                 ║
║ → Commit changes with this report attached                     ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## Integration Points

```
┌─────────────────────────────────────────────────────┐
│              Development Workflow                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Write Code                                      │
│     │                                               │
│     ▼                                               │
│  2. @orchestrator ◀──── Entry Point               │
│     │                                               │
│     ├─ Phase 1: Code Review                        │
│     ├─ Phase 2: QA Testing                         │
│     ├─ Phase 3: Documentation                      │
│     │                                               │
│     ▼                                               │
│  3. Review Pipeline Report                         │
│     │                                               │
│     ▼                                               │
│  4. Address Recommendations                        │
│     │                                               │
│     ▼                                               │
│  5. Commit Changes                                 │
│     │                                               │
│     ▼                                               │
│  6. Create Pull Request                            │
│     │ (Include pipeline report in PR description)  │
│     │                                               │
│     ▼                                               │
│  7. Code Review & Merge                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Configuration Reference

```
.cursor/config.json
├─ preferences
│  ├─ architecture: atomic-design ────┐
│  ├─ typescriptStrict: true          │
│  ├─ tailwindOnly: true              ├─→ Used by Phase 1
│  ├─ dryPrinciple: true              │
│  └─ testingEnforcement: true ───────┘
│
├─ testing
│  ├─ framework: vitest ──────┐
│  ├─ library: react-testing-library ├─→ Used by Phase 2
│  └─ coLocate: true ─────────┘
│
├─ rules
│  ├─ requireTests: true ──────┐
│  ├─ propsMustBeTyped: true   ├─→ Used by Phase 1
│  └─ noInlineStyles: true ────┘
│
└─ reviewAgent
   ├─ focusAreas: [...]
   └─ suggestAutoFixes: true ───→ Used by Phase 1
```

---

## File Organization

```
.cursor/
├── config.json                 (Project configuration)
│
├── commands/
│   ├── README.md              ← START HERE
│   │
│   ├── orchestrator.md         (Main directive)
│   ├── orchestrator-usage.md   (Quick reference)
│   ├── orchestrator-implementation.md (Technical guide)
│   │
│   ├── reviewer.xml            (Phase 1 specs)
│   ├── qa.xml                  (Phase 2 specs)
│   ├── documentation.md        (Phase 3 specs)
│   │
│   ├── ARCHITECTURE.md         (This file)
│   └── ORCHESTRATOR_SUMMARY.md (Complete summary)
│
└── screenshots/               (Optional: Agent behavior examples)
```

---

## Success Metrics

```
Phase 1 (Code Review) ✅
├─ Issues categorized by severity
├─ All files analyzed
└─ Actionable recommendations provided

Phase 2 (QA & Testing) ✅
├─ Test suite runs successfully
├─ Coverage metrics calculated
└─ Test gaps identified

Phase 3 (Documentation) ✅
├─ CHANGELOG.md updated
├─ Component maps current
└─ JSDoc validated

Overall Status ✅
├─ Final report generated
├─ Recommendations provided
└─ Quality gates met
```

---

**Version**: 1.0  
**Architecture**: Three-Phase Pipeline with Context Passing  
**Status**: ✅ Production Ready
