# Documentation Agent (Cursor wrapper)

> **This is a thin wrapper.** The canonical agent definition lives at `.agents/runner/doc-updater.md`. Cursor's `/documentation` command delegates here.

## Action

Read `.agents/runner/doc-updater.md` and append a CHANGELOG entry (and optionally update `component-tree-map.md`) as described there. This is a Runner-tier (Haiku / minimal) agent — scoped to mechanical doc updates.

For deeper narrative documentation (new README sections, architecture docs, migration guides), escalate to a Builder- or Planner-tier agent.
