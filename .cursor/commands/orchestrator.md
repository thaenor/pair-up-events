# Orchestrator (Cursor wrapper)

> **This is a thin wrapper.** The canonical agent definition lives at `.agents/orchestrator.md`. Cursor's `/orchestrator` command delegates here; the actual behavior — DAG-based pipeline, tier routing, phase dependencies — is defined in the canonical file.

## Action

Read `.agents/orchestrator.md` and execute the multi-agent pipeline as described there.

## Quick Summary (for context)

- **Phase 0**: Code Review (Planner, Opus)
- **Phase 1a/1b/1c**: Lint + Type-check + Unit tests (Runner, Haiku — run in parallel)
- **Phase 2**: Build (Runner, Haiku)
- **Phase 3**: E2E (Builder, Sonnet — conditional, skipped for docs-only changes)
- **Phase 4**: Documentation (Runner, Haiku)
- **Final**: consolidated report

See `.agents/tiers.md` for tier definitions.
