# Orchestrator: Multi-Agent CI/CD Pipeline

**Role**: Coordinate a 7-phase pipeline that validates code changes with specialized agents for comprehensive review, linting, type checking, unit testing, build validation, and E2E testing.

## Pipeline Flow

```
User Input → Code Review → Linting → Type Checking → Unit Tests → Build → E2E Tests → Final Report
```

---

## Phase 0: Code Review & Architecture Analysis

**Delegate to**: `reviewer.md`

**Execute**:

1. Analyze code changes for logic errors and bugs
2. Check for security vulnerabilities
3. Verify architectural patterns
4. Review code quality and best practices
5. Identify performance and memory concerns
6. Generate comprehensive code review report

---

## Phase 1: Linting & Formatting

**Delegate to**: `linter-agent.md`

**Execute**:

1. Run formatting and linting checks
2. Auto-fix fixable issues (formatting, simple lint errors, import order)
3. Analyze and fix remaining issues where possible
4. Generate report with any unfixable issues

---

## Phase 2: Type Checking

**Delegate to**: `typecheck-agent.md`

**Execute**:

1. Run TypeScript type checking
2. Analyze type errors and categorize by complexity
3. Fix simple type errors automatically
4. Generate report with complex type errors requiring manual review

---

## Phase 3: Unit Testing

**Delegate to**: `unit-agent.md`

**Execute**:

1. Run unit test suite
2. Analyze test failures with root cause analysis
3. Validate and intelligently handle snapshot test changes
4. Fix auto-fixable test failures
5. Generate report with coverage metrics and remaining issues

---

## Phase 4: Build Validation

**Delegate to**: `build-agent.md`

**Execute**:

1. Run production build
2. Validate build success
3. Analyze bundle size and recommend optimizations
4. Generate report with build warnings and bundle analysis

---

## Phase 5: E2E Testing

**Delegate to**: `e2e-agent.md`

**Execute**:

1. Run E2E test suite
2. Analyze test failures with screenshots and logs
3. Fix auto-fixable test failures
4. Generate report with any flaky tests or failures

---

## Phase 6: Final Documentation

**Delegate to**: `documentation.md`

**Execute**:

1. Update `CHANGELOG.md` with all changes
2. Update `component-tree-map.md` if components changed
3. Generate consolidated final report

---

## Orchestrator Protocol

### Execution Rules

- **Sequence**: Always execute phases 0→1→2→3→4→5→6 in order
- **Context**: Pass relevant findings between phases
- **Failures**: Log all issues but continue pipeline (fail-safe)
- **Escalation**: If any agent detects complex issues, they prompt user with recommendations
- **Output**: Agents provide short 2-sentence summaries with fix proposals (no markdown files)
- **Consolidation**: Orchestrator combines all agent summaries into final concise report

### Final Report Format

Agents must provide **very short, succinct summaries** (maximum 2 sentences) instead of markdown reports. Each agent should:

1. **Summarize findings** in 1-2 sentences
2. **Propose fixes** if possible (brief, actionable)
3. **No markdown file generation** - output directly to orchestrator

**Example Output Format**:

```
Phase 0: Code Review & Architecture
✅ Pass | 🟡 Issues Found | 🔴 Critical Issues

[1-2 sentence summary] [Fix proposal if applicable]

Phase 1: Linting & Formatting
✅ Pass | ⚠️ Issues Fixed | 🔴 Issues Remain

[1-2 sentence summary] [Fix proposal if applicable]

[... all phases follow same pattern ...]

Overall Status: [PASS | WARNING | REVIEW_REQUIRED | CRITICAL]
```

---

## Agent Descriptions

| Phase | Agent           | File               | Command                        | Responsibility                                    |
| ----- | --------------- | ------------------ | ------------------------------ | ------------------------------------------------- |
| 0     | Code Reviewer   | reviewer.md        | Manual (analysis)              | Comprehensive code review, logic/bug detection    |
| 1     | linter-agent    | linter-agent.md    | npm run format && npm run lint | Code formatting and linting                       |
| 2     | typecheck-agent | typecheck-agent.md | npm run typecheck              | TypeScript type validation                        |
| 3     | unit-agent      | unit-agent.md      | npm run test                   | Unit tests, snapshots, and coverage               |
| 4     | build-agent     | build-agent.md     | npm run build                  | Production build validation and bundle analysis   |
| 5     | e2e-agent       | e2e-agent.md       | npm run test:e2e               | End-to-end testing and flakiness detection        |
| 6     | documentation   | documentation.md   | Manual                         | Update CHANGELOG and component tree documentation |

---

## Invocation

**Trigger**: When user references this file or requests full pipeline validation

**Your Actions**:

1. Confirm orchestrator start
2. Execute phases 0→6 sequentially using respective agents
3. Collect short summaries from each agent (max 2 sentences each)
4. Consolidate into final concise report with overall status
5. Provide prioritized action items if needed

---

## Success Criteria

✅ All 6 agents complete  
✅ Cross-phase context maintained  
✅ Concise summaries collected from each agent  
✅ Final consolidated report generated  
✅ Actionable recommendations provided (if issues found)
