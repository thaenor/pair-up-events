# `.agents/` — Behavioral Layer

This directory holds the **behavioral layer** of the agent architecture. Every file here describes HOW an agent should behave for a specific role — not WHAT the project knows about itself. Factual knowledge lives in `Docs/architecture/`, and the universal entry point is the root `AGENTS.md`.

## Structure

```
.agents/
├── README.md                  # You are here
├── AGENTS.md                  # Symlink to root AGENTS.md
├── tiers.md                   # Tier definitions (Planner/Builder/Runner)
├── orchestrator.md            # DAG-based pipeline coordinator
├── agent-template.md          # Standard template every agent file follows
├── planner/
│   ├── prompt-generator.md    # Refines vague user prompts into specs
│   └── architect.md           # Architecture decisions and feature planning
├── builder/
│   ├── implementer.md         # Writes new production code
│   ├── test-writer.md         # Writes new unit tests
│   └── e2e-agent.md           # Writes and runs Playwright E2E tests
├── runner/
│   ├── linter.md              # ESLint + Prettier, auto-fix loop
│   ├── typechecker.md         # TypeScript compiler, simple fixes
│   ├── unit-runner.md         # Runs vitest, reports failures
│   ├── build-validator.md     # Runs Vite build, reports bundle stats
│   └── doc-updater.md         # Appends CHANGELOG.md entries
├── reviewer/
│   ├── code-reviewer.md       # Deep code review (Planner tier)
│   └── qa.md                  # Autonomous QA + auto-fix
└── scratch/                   # Ephemeral agent outputs (formerly Docs/agents-temp/)
```

## How to Pick an Agent

1. Start from `AGENTS.md` in the repo root for the mandatory protocol.
2. Check `tiers.md` to understand which tier (Planner, Builder, Runner) owns the kind of work you're doing.
3. Pick the specific agent under `planner/`, `builder/`, `runner/`, or `reviewer/`.
4. Read that agent's `Required Context` section and read those docs before acting.
5. Follow the agent's `Instructions` and `Commands` exactly.
6. Produce the `Outputs` described in the agent file.

## Standard Template

Every agent file follows the template in `agent-template.md`. If you're adding a new agent, copy that template first. The template enforces a consistent shape:

- Metadata (Tier, Model, Effort)
- Required Context (which `Docs/architecture/` files to read)
- Inputs (what the agent receives)
- Outputs (what the agent produces)
- Instructions (behavioral rules)
- Commands (shell commands the agent runs)
- Success Criteria

## Relationship to `.cursor/commands/`

The files under `.cursor/commands/` are thin wrappers that delegate to `.agents/`. If you use Cursor, the `/command` invocation still works. If you use Claude Code or another agent, point at `.agents/` directly.
