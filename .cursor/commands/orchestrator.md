# Orchestrator: Multi-Agent CI/CD Pipeline

**Role**: Coordinate a 3-phase pipeline that validates code changes, ensures test coverage, and updates documentation.

## Pipeline Flow

```
User Input → Code Review → QA & Testing → Documentation → Final Report
```

---

## Phase 1: Code Review

**Delegate to**: `reviewer.md`

**Execute**:

1. Analyze all staged/unstaged changes
2. Generate markdown report with:
   - Logic issues (efficiency, edge cases, control flow)
   - Style violations (naming, formatting, complexity)
   - Potential bugs (memory, exceptions, type safety)
   - Severity: Critical / High / Medium / Low
   - Solutions for each issue
3. Pass findings to Phase 2

---

## Phase 2: QA & Testing

**Delegate to**: `qa.md`

**Execute**:

1. Run full test suite (unit + Playwright)
2. Analyze failures with root causes
3. Assess coverage gaps for modified code (cross-reference Phase 1)
4. Generate report with:
   - Test pass rate and failure details
   - Coverage % (unit and E2E)
   - Prioritized list of missing tests
5. Pass coverage data to Phase 3

---

## Phase 3: Documentation

**Delegate to**: `documentation.md`

**Execute**:

1. Update `CHANGELOG.md`:
   - Code changes summary (from Phase 1)
   - Test coverage improvements (from Phase 2)
   - Breaking changes, new features
2. Update `component-tree-map.md`:
   - New/modified components
   - Structure changes, updated counts
3. Validate and update JSDoc comments
4. Generate documentation report

---

## Orchestrator Protocol

### Execution Rules

- **Sequence**: Always execute phases 1→2→3 in order
- **Context**: Pass relevant findings between phases
- **Failures**: Log all issues but continue pipeline (fail-safe)
- **Output**: Consolidate all reports into final summary

### Final Report Format

```markdown
## ORCHESTRATOR PIPELINE REPORT

### Phase 1: Code Review

Critical: X | High: X | Medium: X | Low: X

### Phase 2: QA & Testing

Test Pass Rate: X% | Coverage Δ: ±X% | Tests Needed: X

### Phase 3: Documentation

Files Updated: X | Components Changed: X | Breaking Changes: X

### Status: [PASS | WARNING | REVIEW_REQUIRED]

### Recommendations

1. [Priority action items]
2. [Blockers or critical issues]
```

---

## Invocation

**Trigger**: When user references this file or requests full pipeline validation

**Your Actions**:

1. Confirm orchestrator start
2. Execute phases 1→2→3 sequentially
3. Generate consolidated final report
4. Provide prioritized action items

---

## Success Criteria

✅ All phases complete  
✅ Cross-phase context maintained  
✅ Final report generated  
✅ Actionable recommendations provided
