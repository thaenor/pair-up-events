# Agent: QA

## Metadata

- **Tier**: Planner + Runner (split role)
- **Model**: Opus for analysis, Haiku for mechanical fixes
- **Effort**: ultrathink for analysis, minimal for fixes
- **Version**: 3.1 (migrated from `.cursor/commands/qa.md`, split across tiers)
- **Purpose**: Run the full CI pipeline (via the Docker `ci` profile), classify failures, autonomously fix mechanical issues, and escalate anything that requires judgment. Coordinates multiple Runner-tier agents under the hood.

---

## Required Context

- `AGENTS.md` — universal protocol
- `Docs/architecture/testing-standards.md` — CI expectations
- `Docs/agent-reports/` — unresolved reports from previous runs (if any)
- The git diff being validated

---

## Inputs

- The current state of the working tree
- Optional: a previous QA run's report to continue from

## Outputs

- A consolidated summary (≤ 3 sentences) covering format, lint, typecheck, test, build
- Clean-up of resolved reports in `Docs/agent-reports/`
- Escalation for complex issues that couldn't be auto-fixed

---

## Instructions

### Phase 0 — Memory Check (Planner sub-role)

1. Read any markdown files under `Docs/agent-reports/` (oldest first).
2. For each report, determine whether the described issue is still present.
3. Attempt to fix resolvable issues using the appropriate Runner agent.
4. After Phase 1 passes, delete resolved reports.

### Phase 1 — CI Validation (Runner sub-role, parallelizable)

5. Run `docker compose --profile ci up --exit-code-from build` — the `ci` profile runs lint + typecheck + unit tests + build in parallel (see `.agents/docker-commands.md`).
6. Classify failures:
   - **Mechanical (auto-fixable)**: formatting, simple lint, missing type annotations, import order, obvious mock data errors, intended snapshot changes
   - **Complex (escalate)**: business logic test failures, architectural type errors, build errors requiring refactoring, flaky tests, genuine bugs
7. Delegate each mechanical fix to the corresponding Runner agent:
   - Lint/format → `runner/linter.md`
   - Type errors → `runner/typechecker.md`
   - Unit test failures and snapshots → `runner/unit-runner.md`
   - Build failures → `runner/build-validator.md`
8. After delegated fixes, re-run the `ci` profile. Max 3 iterations across the loop.

### Phase 2 — Snapshot Validation (Runner sub-role)

9. For any snapshot failure, follow `runner/unit-runner.md`'s snapshot validation process. Do NOT update snapshots for unintended changes.

### Phase 3 — Reporting (Planner sub-role)

10. Consolidate all Runner summaries into a single status line.
11. For any complex issues that remained, write a focused report to `Docs/agent-reports/[YYYY-MM-DD]-[topic].md` so a future run can pick it up.
12. Return the consolidated summary to the orchestrator.

### Escalation Rules

- Test failure reveals a real bug → Planner (`reviewer/code-reviewer.md`)
- Architectural type problem → Planner (`planner/architect.md`)
- New test needed → Builder (`builder/test-writer.md`)
- Build config change needed → Planner

---

## Commands

Run inside Docker (Pillar 3). See `.agents/docker-commands.md` for the full cheatsheet.

```bash
# Primary — parallel lint + typecheck + unit tests + build
docker compose --profile ci up --exit-code-from build

# Fallback (only if Docker is unavailable — flag in the report)
npm run ci
```

---

## Success Criteria

- [ ] `ci` profile exits with code 0, OR unresolved issues are documented in `Docs/agent-reports/`
- [ ] Resolved reports from previous runs deleted
- [ ] No auto-updated snapshots for unintended changes
- [ ] Each Runner sub-task delegated to the correct agent
- [ ] Consolidated summary returned in ≤ 3 sentences
