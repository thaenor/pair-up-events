# `.agents/scratch/` — Ephemeral Agent Outputs

## Purpose

This directory contains **temporary outputs** from Planner- and Builder-tier agents. The Prompt Generator writes implementation specs here; the Architect writes design notes here. It replaces the old `Docs/agents-temp/` directory as part of the Pillar 2 refactor.

## What Gets Stored Here

When an agent produces a document that isn't ready to become permanent project documentation, it lands here. Typical contents:

- Implementation specs from `.agents/planner/prompt-generator.md`
- Architecture design notes from `.agents/planner/architect.md`
- Draft release notes
- Temporary research outputs

## File Naming Convention

```
prompt-YYYY-MM-DD-[task-slug].md
architecture-YYYY-MM-DD-[topic-slug].md
```

**Examples**:

- `prompt-2026-04-09-add-event-filtering.md`
- `architecture-2026-04-09-state-management-revisit.md`

## File Lifecycle

These files are **ephemeral**:

- Use as reference during implementation
- Delete after the task is complete
- Commit if you want to preserve the planning record
- Clean up periodically — this is not core documentation

## When to Use Backlog Instead

If the task is not ready for immediate implementation, prefer:

```
/prompt-generator --backlog [description]
```

This appends to `Docs/Backlog.md` for long-term tracking instead of creating a scratch file.

## Gitignore Status

This directory is tracked by git. Individual scratch files can be gitignored if you want them local-only:

```
.agents/scratch/*.md
!.agents/scratch/README.md
!.agents/scratch/QUICKSTART.md
```

---

**Related**

- Root `AGENTS.md` — universal protocol
- `.agents/README.md` — overview of the behavioral layer
- `.agents/planner/prompt-generator.md` — canonical agent definition
- `Docs/Backlog.md` — permanent task tracking
- `Docs/architecture/` — factual project knowledge
