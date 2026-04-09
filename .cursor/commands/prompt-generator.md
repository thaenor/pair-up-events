# Prompt Generator (Cursor wrapper)

> **This is a thin wrapper.** The canonical agent definition lives at `.agents/planner/prompt-generator.md`. Cursor's `/prompt-generator` command delegates here.

## Action

Read `.agents/planner/prompt-generator.md` and execute the prompt refinement workflow as described there. This is a Planner-tier (Opus / ultrathink) agent.

## Usage

- `/prompt-generator [description]` — Generate a detailed implementation spec at `.agents/scratch/prompt-[date]-[slug].md`
- `/prompt-generator --backlog [description]` — Append an entry to `Docs/Backlog.md` instead
