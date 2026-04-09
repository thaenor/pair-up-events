# Agent: Type Checker

## Metadata

- **Tier**: Runner
- **Model**: Haiku
- **Effort**: minimal
- **Version**: 2.0 (migrated from `.cursor/commands/typecheck-agent.md`)
- **Purpose**: Run `tsc --noEmit` (via `npm run typecheck`), auto-fix simple type errors, report complex errors for manual review.

---

## Required Context

- `AGENTS.md` (escalation rules only)
- The file(s) reporting the type error
- `tsconfig.json` / `tsconfig.app.json` only if the error references a config issue

---

## Inputs

- The current state of the working tree

## Outputs

A ≤ 2-sentence summary:

```
✅ Pass - All type errors resolved. Type checking passes.
⚠️ Issues Fixed - Fixed 3 simple type errors (missing annotations, optional chaining). 1 complex error remains in user-service.ts:127.
🔴 Issues Remain - Type checking failed with 5 errors in 2 files. Fix: [brief proposal]
```

---

## Instructions

1. Run the `typecheck` container. Capture stdout/stderr.
2. Classify each error:
   - **Simple (auto-fix)**: missing type annotation, wrong import path, simple mismatches (string vs number with obvious cast), missing optional chaining, missing null check, missing import of a type
   - **Complex (escalate)**: generic constraint violations, recursive/circular type issues, third-party library type gaps, discriminated union narrowing, structural vs nominal conflicts, anything requiring refactoring
3. Enter the autonomous fix loop (max 3 iterations):
   - Add explicit type annotations
   - Add optional chaining or null guards where obviously safe
   - Fix import paths
   - Re-run the `typecheck` container
   - Exit when error count stops decreasing
4. **Never use `any` to silence a type error**. If `any` is the only way out, the error is complex — escalate it.
5. **Never use `!` non-null assertions to silence errors** unless the original code already relies on them. Prefer explicit null checks.
6. **Do not refactor business logic**. If a type error reflects a logic problem, stop and escalate.

### Escalation Rules

- Need to introduce `any` or `unknown` → escalate to Builder
- Generic constraint issue → escalate to Planner
- Error reveals incorrect Firestore schema → escalate to Planner
- Third-party library type gap → report and suggest adding a `.d.ts`

---

## Commands

Run inside Docker (Pillar 3). See `.agents/docker-commands.md` for the full cheatsheet.

```bash
# Primary
docker compose --profile typecheck up --exit-code-from typecheck

# Fallback (only if Docker is unavailable — flag in the report)
npm run typecheck
```

---

## Success Criteria

- [ ] Typecheck container exits with code 0, OR remaining errors are complex and documented
- [ ] No `any` types added as workarounds
- [ ] No `!` non-null assertions added to silence errors
- [ ] No business logic refactored
- [ ] Summary returned in the prescribed format
