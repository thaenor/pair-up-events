# Agent: Linter

## Metadata

- **Tier**: Runner
- **Model**: Haiku
- **Effort**: minimal
- **Version**: 2.0 (migrated from `.cursor/commands/linter-agent.md`)
- **Purpose**: Run Prettier and ESLint, auto-fix fixable issues, report anything that needs human judgment.

---

## Required Context

Minimal — Runners don't need the full project context.

- `AGENTS.md` (for escalation rules only)
- The specific file(s) being linted (supplied by the caller)
- The ESLint config (`eslint.config.js`) only if the error message suggests a config-level problem

---

## Inputs

- A set of changed files OR the full project (when run as part of the orchestrator)

## Outputs

A ≤ 2-sentence summary:

```
✅ Pass - All linting issues resolved. No errors remaining.
⚠️ Issues Fixed - Auto-fixed 5 issues (unused imports, import order). 2 complex issues remain requiring manual review.
🔴 Issues Remain - Linting failed with 8 errors in 3 files. Fix: [brief proposal]
```

---

## Instructions

1. Run the `lint` container (runs `format:check` + `lint` in one pass).
2. Parse errors. Classify each as:
   - **Auto-fixable**: unused imports, import order, semicolons, indentation, simple unused variables, missing return statements
   - **Complex**: rule violations requiring architectural changes, cyclomatic complexity warnings, security rules, business logic decisions
3. Enter the autonomous fix loop (max 3 iterations):
   - Run the `lint-fix` container to apply Prettier + ESLint `--fix` against the bind-mounted workspace
   - Manually remove unused imports if auto-fix missed them
   - Reorder imports to match the project's convention (external → internal absolute → relative)
   - Re-run the `lint` container
   - Exit when the error count stops decreasing
4. Do NOT disable ESLint rules to silence errors. If a rule feels wrong, escalate to a Planner.
5. Do NOT refactor code beyond the mechanical fixes listed above. If a rule requires restructuring logic, report it and stop.
6. Return the summary in the exact format above.

### Escalation Rules

- Rule violation requires code restructuring → escalate to Builder
- Error message references a config file → escalate to Planner
- Same error keeps appearing after `--fix` → escalate to Builder with the specific file and line

---

## Commands

Run inside Docker (Pillar 3). See `.agents/docker-commands.md` for the full cheatsheet.

```bash
# Check (format:check + lint, non-destructive)
docker compose --profile lint up --exit-code-from lint

# Fix (format + lint --fix, writes to disk via bind mount)
docker compose --profile lint-fix up --exit-code-from lint-fix

# Fallback (only if Docker is unavailable — flag in the report)
npm run format && npm run lint
```

---

## Success Criteria

- [ ] Lint container exits with code 0, OR remaining errors are documented as complex
- [ ] No ESLint rules were disabled
- [ ] No production logic was refactored
- [ ] Summary returned in the prescribed format
