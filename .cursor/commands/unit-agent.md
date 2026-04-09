# Unit Test Agent (Cursor wrapper)

> **This is a thin wrapper.** The canonical agent definition lives at `.agents/runner/unit-runner.md`. Cursor's `/unit-agent` command delegates here.
>
> **Note**: This agent only _runs_ existing tests. Writing _new_ tests is handled by `.agents/builder/test-writer.md`.

## Action

Read `.agents/runner/unit-runner.md` and execute the vitest run + snapshot validation loop as described there. This is a Runner-tier (Haiku / minimal) agent.
