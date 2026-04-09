# Orchestrator — Multi-Tier CI/CD Pipeline (DAG)

**Role**: Coordinate the multi-agent pipeline that validates code changes. Replaces the previous 7-phase linear pipeline with a dependency graph that parallelizes independent work and skips E2E runs for irrelevant changes.

## Metadata

- **Tier**: Orchestrator (coordinator, not an LLM role itself — runs as a lightweight wrapper around tiered agents)
- **Model**: The orchestrator can be driven by any tier; Builder (Sonnet) is the default because it needs to reason about dependencies but not architect them.
- **Effort**: standard

---

## Pipeline DAG

```
                    ┌─────────────────────────────┐
                    │ Phase 0: Code Review        │
                    │ reviewer/code-reviewer.md   │
                    │ Tier: Planner (Opus)        │
                    └──────────────┬──────────────┘
                                   │ findings passed to downstream
                                   ▼
        ┌──────────────────┬──────────────────┬──────────────────┐
        │ Phase 1a: Lint   │ Phase 1b: Types  │ Phase 1c: Unit   │
        │ runner/linter.md │ runner/          │ runner/          │
        │                  │  typechecker.md  │  unit-runner.md  │
        │ Tier: Runner     │ Tier: Runner     │ Tier: Runner     │
        └────────┬─────────┴────────┬─────────┴────────┬─────────┘
                 │                  │                  │
                 └──────────────────┼──────────────────┘
                                    │ (all three must pass)
                                    ▼
                    ┌─────────────────────────────┐
                    │ Phase 2: Build              │
                    │ runner/build-validator.md   │
                    │ Tier: Runner                │
                    └──────────────┬──────────────┘
                                   │ needs successful build
                                   ▼
                    ┌─────────────────────────────┐
                    │ Phase 3: E2E (conditional)  │
                    │ builder/e2e-agent.md        │
                    │ Tier: Builder               │
                    │ Skipped if:                 │
                    │  - docs-only changes        │
                    │  - style-only changes       │
                    │  - no src/ files touched    │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │ Phase 4: Documentation      │
                    │ runner/doc-updater.md       │
                    │ Tier: Runner                │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │ Final Report (Orchestrator) │
                    └─────────────────────────────┘
```

### Why DAG instead of linear

Phases 1a/1b/1c have no dependency on each other. Running them in parallel saves roughly 60% of pipeline wall time compared to the sequential 7-phase pipeline it replaces. Phase 3 (E2E) is the slowest step and is skipped entirely for changes that cannot affect runtime behavior.

---

## Required Context

The orchestrator needs only enough context to route findings between phases. It does NOT read the architecture docs itself — the individual agents do.

- `AGENTS.md` — for the mandatory protocol reference
- `.agents/tiers.md` — for tier assignments
- Git diff of the current change (passed through to all downstream agents)

---

## Inputs

- A set of changed files (from `git diff --name-only HEAD~1` or the user's current working tree)
- Optional: user-supplied context ("this change only affects the login flow")

## Outputs

- A consolidated status report (Pass / Warning / Review Required / Critical)
- Per-phase summaries (≤ 2 sentences each)
- Prioritized action items if any phase fails

---

## Execution Rules

### Phase 0 — Code Review (Planner)

Runs first. Its findings (architecture concerns, subtle bugs, suggested patterns) are passed as context to every downstream phase so Runners can correlate their mechanical findings with the Planner's semantic findings.

### Phase 1 — Parallel Runners

Phases 1a/1b/1c run concurrently. Each Runner reports independently. The orchestrator waits for all three before advancing to Phase 2. If any Runner fails autonomously (max 3 fix iterations), the pipeline halts and reports the failing phase — do not proceed to Build.

### Phase 2 — Build

Runs only after all of Phase 1 passes. Build failures that aren't auto-fixable escalate to Planner for diagnosis.

### Phase 3 — E2E (conditional)

**Skip conditions** (orchestrator decides before invoking the agent):

- Changes touch only `Docs/`, `README.md`, or `.agents/`
- Changes touch only `*.md` files
- Changes touch only `*.css` / styling files that don't affect component logic
- No files under `src/` changed

**Run conditions**: any change to `src/components/`, `src/pages/`, `src/hooks/`, `src/lib/firebase/`, or `tests/e2e/`.

### Phase 4 — Documentation

Runs regardless of E2E outcome. Runner appends a CHANGELOG entry using a fixed template.

---

## Phase Output Format

Every agent returns a structured report of at most two sentences:

```
Phase N: [Name]
[status emoji] [status label]

[1–2 sentence summary] [Fix proposal if applicable]
```

Status labels: `Pass`, `Issues Fixed`, `Issues Remain`, `Skipped`, `Failed`, `Critical`.

---

## Final Report Format

```
Phase 0: Code Review
✅ Pass | 🟡 Issues Found | 🔴 Critical Issues
[summary]

Phase 1a: Lint
[status]
[summary]

Phase 1b: Type Check
[status]
[summary]

Phase 1c: Unit Tests
[status]
[summary]

Phase 2: Build
[status]
[summary]

Phase 3: E2E Tests
[status or ⏭️ Skipped — reason]
[summary]

Phase 4: Documentation
[status]
[summary]

Overall Status: [PASS | WARNING | REVIEW_REQUIRED | CRITICAL]
Action Items (if any):
1. [Prioritized fix]
2. [...]
```

---

## Invocation

**Trigger**: User requests a full pipeline validation, or a commit / PR touches code the orchestrator is configured to guard.

**Orchestrator actions**:

1. Collect the git diff and determine which files changed.
2. Decide whether Phase 3 (E2E) will run based on the skip conditions above.
3. Invoke Phase 0 (Planner) and wait for its report.
4. Invoke Phases 1a/1b/1c in parallel, passing Phase 0's findings as context.
5. If all of Phase 1 passes, invoke Phase 2.
6. If Phase 2 passes and Phase 3 is eligible, invoke Phase 3.
7. Always invoke Phase 4 at the end.
8. Consolidate all phase outputs into the Final Report.
9. Return the report directly — do not write markdown files to `Docs/agent-reports/` unless a phase specifically requires one.

---

## Success Criteria

- All eligible phases complete with a status line
- No phase exceeds its `max_iterations` fix loop
- Final report is concise and actionable
- Wall time is lower than the previous linear pipeline for changes that benefit from parallelization
- Skip conditions correctly bypass E2E for docs-only changes

---

## Commands

Runner and Builder agents specify their own commands. The orchestrator itself invokes other agents — it doesn't run build commands directly. All quality-gate commands execute inside Docker (Pillar 3); see `.agents/docker-commands.md`. The DAG's Phase 1a/1b/1c + Phase 2 map 1:1 to `docker compose --profile ci up --exit-code-from build`, which runs `lint`, `typecheck`, `test-unit`, and `build` in parallel.
