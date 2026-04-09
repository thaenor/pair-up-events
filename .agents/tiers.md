# Agent Tiers

> **Scope**: Defines the three-tier model routing strategy for all agents in `.agents/`. Every agent file declares a tier in its metadata and inherits the defaults below. Tiers map to effort level, context window budget, and routing rules — not just to a specific model.

All tiers use Anthropic models exclusively. Claude Code does not support mixed-provider routing (e.g., local LLMs alongside Anthropic models in the same workflow).

---

## Tier Summary

| Tier        | Model         | Effort       | Temperature | Typical Latency | Cost   |
| ----------- | ------------- | ------------ | ----------- | --------------- | ------ |
| **Planner** | Claude Opus   | ultrathink   | 0.2–0.4     | Slow            | High   |
| **Builder** | Claude Sonnet | standard     | 0.3–0.5     | Medium          | Medium |
| **Runner**  | Claude Haiku  | minimal/fast | 0.1         | Fast            | Low    |

---

## Planner Tier

**Model**: Claude Opus (or the current frontier reasoning model)
**Effort**: `ultrathink` / maximum reasoning budget
**Temperature**: 0.2–0.4 — precise, low variance
**Context window**: Full project docs + all relevant source files. Planners benefit from seeing the whole system.

### What Planners Do

- Architecture decisions and trade-off analysis
- Feature planning, requirements clarification, scope definition
- Deep code review (logic, security, edge cases)
- Prompt refinement (turning vague user requests into precise implementation specs)
- Resolving design conflicts between existing code and new requirements
- Catching subtle bugs that require understanding multiple files at once

### Key Properties

- Deep reasoning over speed
- Catches non-obvious trade-offs
- Produces plans, not code
- Willing to stop and ask rather than guess

### When NOT to Use Planner

- Running a command and parsing its output → Runner
- Applying a well-understood pattern to new code → Builder
- Mechanical fixes (lint, format, type annotations) → Runner

---

## Builder Tier

**Model**: Claude Sonnet (or equivalent mid-tier model)
**Effort**: standard
**Temperature**: 0.3–0.5 — balanced
**Context window**: Architecture docs relevant to the task + affected source files. Builders don't need the whole project.

### What Builders Do

- Implement features from a Planner-produced spec
- Write new components following established patterns
- Write new unit and E2E tests
- Refactor code within a defined scope
- Apply schema changes, add Firestore helpers
- Compose existing atoms/molecules into organisms

### Key Properties

- Fast, competent code generation
- Follows existing patterns well
- Produces code that compiles and passes tests on the first or second try
- Asks for clarification on genuinely ambiguous requirements, not on well-documented conventions

### When NOT to Use Builder

- Architecture debates → Planner
- Running a command and reporting output → Runner
- Fixing an error it doesn't understand → escalate to Planner

---

## Runner Tier

**Model**: Claude Haiku
**Effort**: minimal / fast
**Temperature**: 0.1 — deterministic
**Context window**: Minimal. Just the error output + the single file being changed. Runners should never need the full project context.

### What Runners Do

- Fix lint errors and formatting issues (`eslint --fix`, Prettier)
- Fix simple TypeScript errors (missing annotations, `as` casts, import paths)
- Run the unit test suite and report results
- Run the production build and report results
- Update snapshot files when the change is obviously intended
- Append entries to `CHANGELOG.md` using a fixed template
- Parse command output into structured summaries

### Key Properties

- Speed and low cost
- Mechanical accuracy
- Never makes judgment calls — if the fix isn't obvious, escalates
- Deterministic (temperature 0.1 keeps output consistent)

### When NOT to Use Runner

- Writing new tests → Builder
- Deciding whether a failing test is a real bug → Planner
- Resolving a build error that requires design changes → Planner
- Anything requiring interpretation of intent → Builder or Planner

---

## Routing Quick Reference

Use this table to decide which tier owns a task before invoking any agent.

| Signal                                             | Tier    |
| -------------------------------------------------- | ------- |
| Task requires understanding WHY                    | Planner |
| Task requires writing new production code          | Builder |
| Task is running a command and parsing its output   | Runner  |
| Task is reviewing existing code for bugs           | Planner |
| Task is fixing lint / format / simple type errors  | Runner  |
| Task is writing new unit or E2E tests              | Builder |
| Task is running existing tests                     | Runner  |
| Task is refining a vague user prompt               | Planner |
| Task is applying an approved spec to new files     | Builder |
| Task is updating CHANGELOG.md with a one-liner     | Runner  |
| Task is choosing between two architectural options | Planner |

---

## Escalation Rules

Agents must escalate instead of guessing when they encounter work outside their tier.

- **Runner → Builder**: when a "simple" fix actually requires understanding component logic (e.g., a failing test that isn't obviously wrong data).
- **Runner → Planner**: when a lint or type error reveals a structural problem (e.g., a circular import).
- **Builder → Planner**: when the task requires inventing a new pattern instead of applying an existing one, or when a directive conflicts with observed code.
- **Planner → human**: when the task is genuinely ambiguous and requires a product decision.

Escalations are not failures — they keep expensive reasoning focused where it matters.

---

## Effort Keywords (for Claude Code)

When invoking agents, use these keywords in prompts to signal desired effort:

- **Planner prompts** should include `ultrathink` or explicit instructions to reason step-by-step and consider trade-offs.
- **Builder prompts** use standard effort — no special keyword.
- **Runner prompts** should be terse and task-focused (e.g., "Fix lint errors in `src/foo.ts` and report the diff.") — this discourages over-reasoning on mechanical work.
