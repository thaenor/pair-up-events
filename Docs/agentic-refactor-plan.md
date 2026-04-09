# Agentic Refactor Plan — PairUp Events

**Created**: 2026-04-08
**Status**: Planning
**Scope**: Reorganize documentation, establish multi-tier agent architecture, containerize all development tasks

---

## Executive Summary

The project currently has strong documentation and a working agentic pipeline, but it's tightly coupled to Cursor + OpenAI Codex. This plan refactors the setup into three layers: an agent-agnostic **knowledge layer** (project facts), a model-routed **agent layer** (behavioral instructions per role), and a **container layer** (Docker-based task isolation). The result is a portable, multi-model agentic setup where Opus plans, Sonnet builds, and Haiku runs mechanical tasks — all inside containers.

---

## Pillar 1: Reorganize Documentation (Knowledge Layer)

### Goal

Separate "what the project is" from "how agents should behave." The architecture docs become a single source of truth that any agent — Claude, Codex, Copilot, or Cursor — can consume without behavioral assumptions baked in.

### Step 1.1: Create `Docs/architecture/` directory

Create the following files by extracting content from existing sources. Each file should be purely factual — no agent behavioral instructions, no "you must" directives.

#### `Docs/architecture/project-overview.md`

**Sources**: `README.md` (§Product Overview, §Tech Stack, §Project Structure), `agents.md` §2.2

**Content outline**:

```
# Project Overview

## Product
- What PairUp is (2-meets-2 social platform)
- Marketing site + auth portal scope
- Key user flows: landing → early-access signup → auth → events

## Tech Stack
- React 18 + TypeScript 5.5 + Vite 7
- Tailwind CSS 3.4 + shadcn/ui + lucide-react
- Firebase (Auth, Firestore, Storage, App Check)
- Vitest + React Testing Library + Playwright
- Sentry for error tracking
- Brevo for email capture

## Repository Structure
- src/components/ — Atomic design (atoms/molecules/organisms/templates/pages)
- src/hooks/ — Custom React hooks
- src/lib/ — Firebase config, utilities, AI integration
- src/entities/ — Data models with Zod validation
- src/contexts/ — React Context providers
- src/pages/ — Route-level components
- tests/ — E2E tests (Playwright)
- Docs/ — All documentation

## Build & Deploy
- Dev: npm run dev (Vite on :5173)
- CI: npm run ci (format → lint → typecheck → test → build)
- Deploy: GitHub Pages via GitHub Actions on main branch
- Node.js 20.x required
```

#### `Docs/architecture/component-standards.md`

**Sources**: `agents.md` §3 (React + Tailwind standards), §8 (Type & Import conventions)

**Content outline**:

```
# Component Standards

## Atomic Design Hierarchy
- atoms: smallest UI units (Button, Modal, Tabs, Logo)
- molecules: composed UI blocks (Auth forms, Event cards)
- organisms: large composed components (Landing, Navigation, Chat)
- templates: page layouts
- pages: route-level components

## Naming Conventions
- Files: kebab-case (event-invite-card.tsx)
- Components: PascalCase
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Booleans: is/has/should prefix
- Event handlers: handle* or on* prefix

## Export Rules
- Named exports only — no default exports
- Props: define and export a `type` inline, destructure in function signature
- CRITICAL: Direct imports only — no barrel exports (index.ts)
  - Rationale: barrel exports prevent tree-shaking in Vite's ESM bundler

## Import Grouping Order
1. External libraries
2. Internal absolute imports (@/components, @/lib, @/hooks)
3. Relative imports

## Tailwind Styling Rules
- Tailwind utilities exclusively — no inline styles
- Use clsx + twMerge for dynamic class merging
- Class ordering: Layout & Spacing → Typography → Color & Border → State

## Type Conventions
- Component-specific: inline `export type Props`
- Shared: under src/types/
- Firestore models: must mirror document schema exactly
```

#### `Docs/architecture/firebase-patterns.md`

**Sources**: `agents.md` §4 (Firestore & Backend), §9 (Guardrails), `data-model.md` (reference)

**Content outline**:

```
# Firebase Patterns

## Core Principles
- Minimize Firestore reads/writes (cost efficiency)
- Batch writes preferred
- Cached reads preferred
- Minimize onSnapshot listeners
- Respect Firestore security rules (only current user reads/writes own data)

## Interaction Rules
- Use existing helpers in src/lib/firebase/
- Wrap reads/writes in centralized functions
- Never create new top-level collections without explicit direction
- All new Firestore types go in src/types/ and extend existing ones

## When Backend Is Undefined
- Stop and warn: "Backend architecture not yet defined — mock data instead."
- Use mock data or local stubs in src/mocks/

## Safe Pattern Example
[Include the getUserProfile example from agents.md §4.1]

## Schema Consistency
- When adding new fields, update:
  1. Type in src/types/
  2. Creation logic in src/lib/firebase/
  3. Tests under __tests__/firebase/

## Data Model Reference
- See Docs/data-model.md for full Firestore schema
- Key collections: users, public_profiles, events, events_listings, events_geo
```

#### `Docs/architecture/state-management.md`

**Sources**: `agents.md` §5 (State Management), §6 (Error Handling)

**Content outline**:

```
# State Management & Error Handling

## State Strategy
- Local: useState, useReducer for UI-local logic
- Cross-component: prop drill up to 2 levels
- Beyond 2 levels: React Context + useContext in src/hooks/
- Prefer cohesive context hooks (useEventContext, useUserProfileContext)
- No global stores unless team explicitly defines one

## Error Handling
- Wrap error-prone features in <ErrorBoundary>
- For async: respect isError/error from TanStack Query
- User feedback: toast (sonner) or inline messages
- Always show graceful fallback UI — never crash silently

## Behavioral Rules
- If a directive conflicts with observed code: stop, report, request clarification
- If new component overlaps existing: recommend reuse
- Prefer lightweight, composable UI blocks over monolithic pages
```

#### `Docs/architecture/testing-standards.md`

**Sources**: `agents.md` §7, `testing-recommendations.md`, `tests/unit/README.md`, `tests/e2e/README.md`

**Content outline**:

```
# Testing Standards

## Frameworks
- Unit: Vitest + React Testing Library (jsdom environment)
- E2E: Playwright (Android Pixel 5 mobile-first)
- Validation: npm run ci (format → lint → typecheck → test → build)

## Test Placement
- Co-locate test files next to source (*.test.tsx or __tests__/ subdir)
- Match source filename (event-invite-card.test.tsx)

## Test Selectors
- Use data-testid attributes for querying

## Minimum Test Coverage Per Component
1. Render test (renders without crashing)
2. Behavior test (interactions work)
3. Error/fallback test (if applicable)

## E2E Strategy
- Run locally via Husky pre-commit hooks
- Excluded from CI (keeps deployment fast)
- Manual: npm run test:e2e
- Firebase Auth Emulator for isolated auth testing

## Configuration Notes
- Memory-optimized for CI: 2 threads max, CSS processing enabled, 10s timeout
- Coverage disabled in config to reduce memory usage
- NODE_OPTIONS: --max-old-space-size=4096

## Test Quality Principles
- Test behavior, not implementation
- Ensure test isolation (no shared state)
- Use deterministic data
- Mock timers for timing-dependent tests
- data-testid for stable selectors
```

### Step 1.2: Create root-level `AGENTS.md`

This replaces the behavioral role of `agents.md`, `.cursorrules`, and `codex.config.json`. It's the single entry point any agent reads first. Keep it under 80 lines.

**Content outline**:

```
# AGENTS.md — PairUp Events

## Quick Start
Read these docs before writing any code:
1. Docs/architecture/project-overview.md — tech stack, repo structure
2. Docs/architecture/component-standards.md — naming, imports, Tailwind
3. Docs/architecture/firebase-patterns.md — Firestore rules
4. Docs/architecture/testing-standards.md — test conventions
5. Docs/data-model.md — Firestore schema
6. Docs/CHANGELOG.md — recent history and current phase

## Mandatory Protocol (All Agents)
1. Context Research: read the docs above + scan similar implementations
2. Implementation: follow conventions strictly
3. Documentation: update CHANGELOG.md with work summary
4. Quality Gate: run `npm run ci` (format → lint → typecheck → test → build)
5. Self-Review: check DRY compliance, reuse existing components
6. Comments: meaningful only — explain WHY, not WHAT

## Agent Tiers (see .agents/tiers.md for full definitions)
| Tier    | Model             | Tasks                                    |
|---------|-------------------|------------------------------------------|
| Planner | Opus / ultrathink | Architecture, feature planning, review   |
| Builder | Sonnet            | Implementation, refactoring, test writing|
| Runner  | Haiku             | Lint, typecheck, build, snapshot fixes   |

## Key Rules
- Named exports only, no barrel exports
- Direct imports from source files
- Tailwind utilities only, no inline styles
- data-testid for test selectors
- Firestore: minimize reads/writes, batch when possible
- If backend undefined: mock data, don't invent endpoints
- If convention conflict: stop and ask

## Available Commands
See .agents/ directory for per-agent instructions.
See Docs/Backlog.md for prioritized work items.
```

### Step 1.3: Retire and redirect overlapping files

| Current File                      | Action                                                                                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Docs/agents.md`                  | Archive to `Docs/_archived/agents-v1.4.md`. All content now lives in `Docs/architecture/*.md` + `AGENTS.md`                                                       |
| `codex.config.json`               | Archive to `Docs/_archived/codex.config.json`. Rules now encoded in markdown. If Codex needs JSON, generate from markdown.                                        |
| `.cursorrules`                    | Rewrite to a 5-line pointer: "Read AGENTS.md. Agent commands in .agents/. Architecture docs in Docs/architecture/."                                               |
| `.cursor/config.json`             | Keep for Cursor IDE integration, but strip duplicated rules (architecture, firestore, testing). Keep only IDE-specific settings (commands, collaboration agents). |
| `Docs/Design-doc.md`              | Rename to `Docs/architecture/design-language.md` for consistency. No content changes.                                                                             |
| `Docs/testing-recommendations.md` | Merge relevant content into `Docs/architecture/testing-standards.md`, then archive.                                                                               |
| `Docs/agents-temp/`               | Move to `.agents/scratch/`. Update prompt-generator to use new path.                                                                                              |

### Step 1.4: Update cross-references

After moving files, grep the entire project for references to old paths and update:

```bash
# Paths to search and replace:
Docs/agents.md → AGENTS.md (for behavioral ref) or Docs/architecture/*.md (for facts)
Docs/Design-doc.md → Docs/architecture/design-language.md
codex.config.json → (remove references or point to AGENTS.md)
docs/agents.md → AGENTS.md (case variations in codex.config.json)
Docs/agents-temp/ → .agents/scratch/
```

Files likely affected: `README.md`, `.cursor/commands/*.md`, `codex.config.json` (if kept), `.cursorrules`, `Docs/CHANGELOG.md`.

### Step 1.5: Verify

- [ ] Every fact from `agents.md` exists in exactly one `Docs/architecture/` file
- [ ] No behavioral instructions ("you must", "always") in architecture docs
- [ ] `AGENTS.md` is under 80 lines and points to all architecture docs
- [ ] `npm run ci` still passes (no code changes in this pillar)
- [ ] All cross-references resolve correctly
- [ ] `Docs/component-tree-map.md` and `Docs/data-model.md` remain untouched

---

## Pillar 2: Multi-Tier Agent Architecture

### Goal

Replace the monolithic Cursor commands with a model-routed agent system where each agent has a clear tier, model assignment, and standard interface.

### Step 2.1: Create `.agents/` directory structure

```
.agents/
├── AGENTS.md                    # Symlink or copy of root AGENTS.md
├── tiers.md                     # Model tier definitions
├── orchestrator.md              # DAG-based pipeline (replaces .cursor/commands/orchestrator.md)
├── planner/
│   ├── prompt-generator.md      # From .cursor/commands/prompt-generator.md
│   └── architect.md             # Architecture review, feature planning (new)
├── builder/
│   ├── implementer.md           # Core coding agent (from .cursor/config.json "code" agent)
│   ├── test-writer.md           # Test creation agent (extracted from qa.md test recommendation phases)
│   └── e2e-agent.md             # From .cursor/commands/e2e-agent.md
├── runner/
│   ├── linter.md                # From .cursor/commands/linter-agent.md
│   ├── typechecker.md           # From .cursor/commands/typecheck-agent.md
│   ├── build-validator.md       # From .cursor/commands/build-agent.md
│   ├── unit-runner.md           # From .cursor/commands/unit-agent.md (run only, not write)
│   └── doc-updater.md           # From .cursor/commands/documentation.md
└── reviewer/
    ├── code-reviewer.md         # From .cursor/commands/reviewer.md
    └── qa.md                    # From .cursor/commands/qa.md (autonomous fixing parts)
```

### Step 2.2: Define tiers in `.agents/tiers.md`

```
# Agent Tiers

## Planner Tier
- Model: Claude Opus (or equivalent frontier model)
- Effort: ultrathink / maximum reasoning
- Temperature: 0.2-0.4 (precise, low variance)
- Use for: architecture decisions, feature planning, prompt refinement, complex code review
- Context window: full project docs + relevant source files
- Key property: deep reasoning, trade-off analysis, catches subtle issues

## Builder Tier
- Model: Claude Sonnet (or equivalent mid-tier model)
- Effort: standard
- Temperature: 0.3-0.5
- Use for: code implementation, refactoring, test writing, E2E scenarios
- Context window: relevant architecture docs + affected source files
- Key property: fast, competent code generation, follows patterns well

## Runner Tier
- Model: Claude Haiku
- Effort: minimal / fast
- Temperature: 0.1 (deterministic)
- Use for: lint fixing, formatting, type-check analysis, build validation, snapshot updates, CHANGELOG updates
- Context window: minimal — just the error output + affected file
- Key property: speed, low cost, mechanical accuracy

## Routing Rules
- If task requires understanding WHY → Planner
- If task requires writing new code → Builder
- If task is running a command and parsing output → Runner
- If task is reviewing existing code for bugs → Planner (code-reviewer)
- If task is fixing lint/type errors → Runner
- If task is writing new tests → Builder
- If task is running existing tests → Runner
```

### Step 2.3: Refactor orchestrator to DAG

The new `.agents/orchestrator.md` defines a dependency graph instead of a linear pipeline:

```
Phase 0: Code Review (Planner) — can run standalone
    ↓ (findings passed to all downstream)
Phase 1a: Lint + Format (Runner)     ─┐
Phase 1b: Type Check (Runner)         ├── parallel
Phase 1c: Unit Tests (Runner)        ─┘
    ↓ (all must pass)
Phase 2: Build (Runner)
    ↓ (needs successful build)
Phase 3: E2E Tests (Builder) — optional, only if E2E-relevant changes
    ↓
Phase 4: Documentation (Runner)
    ↓
Final Report (Orchestrator consolidates)
```

Key changes from current orchestrator:

- Phases 1a/1b/1c run in parallel (saves ~60% of pipeline time)
- E2E is conditional (skip for docs-only or style-only changes)
- Each phase specifies its tier and model
- Docker commands replace bare npm commands (Pillar 3)

### Step 2.4: Standard agent instruction template

Every agent file in `.agents/` follows this structure:

```markdown
# Agent: [Name]

## Metadata

- **Tier**: Planner | Builder | Runner
- **Model**: Opus | Sonnet | Haiku
- **Effort**: ultrathink | standard | minimal

## Required Context

[List of Docs/architecture/ files this agent must read before acting]

## Inputs

[What this agent receives — e.g., git diff, error output, upstream agent findings]

## Outputs

[What this agent produces — e.g., 2-sentence summary, fixed files, report]

## Instructions

[Behavioral rules specific to this agent's role — the "how to behave" part that was mixed into agents.md]

## Commands

[Exact commands to run, using Docker where applicable]

## Success Criteria

[How to determine if the agent completed successfully]
```

### Step 2.5: Migrate existing Cursor commands

| Current `.cursor/commands/` file | New `.agents/` location               | Tier           | Changes needed                                                           |
| -------------------------------- | ------------------------------------- | -------------- | ------------------------------------------------------------------------ |
| `orchestrator.md`                | `.agents/orchestrator.md`             | —              | Rewrite as DAG, add tier routing                                         |
| `reviewer.md`                    | `.agents/reviewer/code-reviewer.md`   | Planner        | Strip context sections (now in architecture docs), add standard template |
| `linter-agent.md`                | `.agents/runner/linter.md`            | Runner         | Simplify, add Docker command                                             |
| `typecheck-agent.md`             | `.agents/runner/typechecker.md`       | Runner         | Simplify, add Docker command                                             |
| `unit-agent.md`                  | `.agents/runner/unit-runner.md`       | Runner         | Split: running → Runner, writing → Builder                               |
| `build-agent.md`                 | `.agents/runner/build-validator.md`   | Runner         | Simplify, add Docker command                                             |
| `e2e-agent.md`                   | `.agents/builder/e2e-agent.md`        | Builder        | Keep complex, add Docker command                                         |
| `documentation.md`               | `.agents/runner/doc-updater.md`       | Runner         | Simplify                                                                 |
| `prompt-generator.md`            | `.agents/planner/prompt-generator.md` | Planner        | Update file paths, keep logic                                            |
| `qa.md`                          | `.agents/reviewer/qa.md`              | Planner/Runner | Split: analysis → Planner, auto-fix → Runner                             |

### Step 2.6: Keep `.cursor/commands/` as thin wrappers (optional)

If you still use Cursor IDE, keep the `/command` invocation working by replacing each `.cursor/commands/*.md` with a one-liner: "Execute the agent defined in `.agents/[path].md`." This way Cursor commands become aliases, not the source of truth.

### Step 2.7: Verify

- [ ] Every agent file follows the standard template
- [ ] Every agent has a clear tier and model assignment
- [ ] Orchestrator DAG correctly represents phase dependencies
- [ ] No behavioral instructions remain in `Docs/architecture/` (those belong in `.agents/`)
- [ ] Cursor commands still work (if keeping thin wrappers)
- [ ] `npm run ci` still passes

---

## Pillar 3: Docker-First Development

### Goal

Every command an agent runs should execute inside a container. Nothing except the editor/agent orchestrator runs on bare metal.

### Step 3.1: Expand Dockerfile.dev

The current `Dockerfile.dev` is minimal (node:lts-alpine, npm install, dev server). Keep it for the dev server but ensure it also works for CI tasks.

```dockerfile
FROM node:lts-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
# Source files come via bind mount at runtime
```

### Step 3.2: Create `Dockerfile.e2e`

Playwright requires specific browser binaries. Use Playwright's official Docker image:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.56.1-noble
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
# Install only Playwright deps (not all dev deps)
RUN npx playwright install --with-deps chromium
```

### Step 3.3: Create `Dockerfile.firebase` (optional, for emulator)

```dockerfile
FROM node:lts-alpine
RUN apk add --no-cache openjdk17-jre-headless
WORKDIR /app
RUN npm install -g firebase-tools
COPY firebase.json .firebaserc ./
EXPOSE 9099 8080 9199
CMD ["firebase", "emulators:start", "--only", "auth,firestore,storage"]
```

### Step 3.4: Refactor `docker-compose.yml` with profiles

```yaml
services:
  # === Development ===
  dev:
    build: { context: ., dockerfile: Dockerfile.dev }
    command: npm run dev -- --host 0.0.0.0
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    ports: ['5173:5173']
    environment: { NODE_ENV: development }
    profiles: ['dev']

  # === Runner Tier Tasks (parallel-safe) ===
  lint:
    build: { context: ., dockerfile: Dockerfile.dev }
    command: sh -c "npm run format:check && npm run lint"
    volumes: ['.:/app', 'node_modules:/app/node_modules']
    profiles: ['lint', 'ci']

  lint-fix:
    build: { context: ., dockerfile: Dockerfile.dev }
    command: sh -c "npm run format && npm run lint -- --fix"
    volumes: ['.:/app', 'node_modules:/app/node_modules']
    profiles: ['lint-fix']

  typecheck:
    build: { context: ., dockerfile: Dockerfile.dev }
    command: npm run typecheck
    volumes: ['.:/app', 'node_modules:/app/node_modules']
    profiles: ['typecheck', 'ci']

  test-unit:
    build: { context: ., dockerfile: Dockerfile.dev }
    command: npm test
    volumes: ['.:/app', 'node_modules:/app/node_modules']
    profiles: ['test', 'ci']

  build:
    build: { context: ., dockerfile: Dockerfile.dev }
    command: npm run build
    volumes: ['.:/app', 'node_modules:/app/node_modules']
    profiles: ['build', 'ci']

  # === Builder Tier Tasks ===
  test-e2e:
    build: { context: ., dockerfile: Dockerfile.e2e }
    command: npm run test:e2e
    volumes:
      - .:/app
      - node_modules:/app/node_modules
      - e2e-results:/app/test-results
    depends_on: [dev]
    profiles: ['e2e']

  # === Infrastructure ===
  firebase-emulator:
    build: { context: ., dockerfile: Dockerfile.firebase }
    ports: ['9099:9099', '8080:8080', '9199:9199']
    volumes: [firebase-data:/app/.firebase]
    profiles: ['emulator', 'dev']

volumes:
  node_modules:
  e2e-results:
  firebase-data:
```

### Step 3.5: Create agent-facing Docker commands cheatsheet

Add to `.agents/docker-commands.md`:

```
# Docker Commands for Agents

## Dev Server
docker compose --profile dev up

## Individual Tasks (Runner Tier)
docker compose --profile lint up --exit-code-from lint
docker compose --profile lint-fix up --exit-code-from lint-fix
docker compose --profile typecheck up --exit-code-from typecheck
docker compose --profile test up --exit-code-from test-unit
docker compose --profile build up --exit-code-from build

## Parallel CI (lint + typecheck + test simultaneously)
docker compose --profile ci up --exit-code-from build

## E2E Tests (Builder Tier)
docker compose --profile dev --profile e2e up --exit-code-from test-e2e

## Firebase Emulator
docker compose --profile emulator up

## Full Pipeline
docker compose --profile ci up && docker compose --profile e2e up --exit-code-from test-e2e
```

### Step 3.6: Create `.dockerignore`

```
node_modules/
dist/
.git/
.agents/scratch/
Docs/agent-reports/
*.log
.env*
!.env.example
```

### Step 3.7: Update agent instruction files

In every `.agents/` file, replace bare `npm run` commands with the Docker equivalents from the cheatsheet. Example for `.agents/runner/linter.md`:

```
## Commands
- Check: docker compose --profile lint up --exit-code-from lint
- Fix: docker compose --profile lint-fix up --exit-code-from lint-fix
```

### Step 3.8: Update GitHub Actions

The CI workflow (`.github/workflows/deploy.yml`) can optionally use Docker Compose instead of raw npm commands, ensuring dev/CI parity. This is optional — GitHub Actions already runs in ephemeral containers.

### Step 3.9: Verify

- [ ] `docker compose --profile dev up` starts dev server correctly
- [ ] `docker compose --profile ci up` runs all quality gates
- [ ] `docker compose --profile e2e up` runs E2E tests
- [ ] No npm commands run on bare metal during normal development
- [ ] Agent instruction files reference Docker commands
- [ ] `.dockerignore` excludes appropriate files
- [ ] Build context is lean (< 50MB excluding node_modules)

---

## Final Directory Structure (Target State)

```
pairup-events/
├── AGENTS.md                           # Root entry point for all agents
├── .agents/                            # Agent instructions (behavioral layer)
│   ├── tiers.md
│   ├── orchestrator.md
│   ├── docker-commands.md
│   ├── planner/
│   │   ├── prompt-generator.md
│   │   └── architect.md
│   ├── builder/
│   │   ├── implementer.md
│   │   ├── test-writer.md
│   │   └── e2e-agent.md
│   ├── runner/
│   │   ├── linter.md
│   │   ├── typechecker.md
│   │   ├── build-validator.md
│   │   ├── unit-runner.md
│   │   └── doc-updater.md
│   ├── reviewer/
│   │   ├── code-reviewer.md
│   │   └── qa.md
│   └── scratch/                        # Ephemeral agent outputs (formerly Docs/agents-temp/)
├── Docs/
│   ├── architecture/                   # Project knowledge (factual layer)
│   │   ├── project-overview.md
│   │   ├── component-standards.md
│   │   ├── firebase-patterns.md
│   │   ├── state-management.md
│   │   ├── testing-standards.md
│   │   └── design-language.md          # Renamed from Design-doc.md
│   ├── data-model.md                   # Unchanged
│   ├── component-tree-map.md           # Unchanged
│   ├── CHANGELOG.md                    # Unchanged
│   ├── Backlog.md                      # Unchanged
│   ├── _archived/                      # Retired files for reference
│   │   ├── agents-v1.4.md
│   │   ├── codex.config.json
│   │   └── testing-recommendations.md
│   └── agent-reports/                  # QA agent output (unchanged)
├── .cursor/
│   ├── config.json                     # Slimmed: IDE settings only
│   └── commands/                       # Thin wrappers pointing to .agents/
├── Dockerfile.dev                      # Node dev/CI image
├── Dockerfile.e2e                      # Playwright image (new)
├── Dockerfile.firebase                 # Firebase emulator image (new)
├── docker-compose.yml                  # Profile-based multi-service (refactored)
├── .dockerignore                       # New
└── src/                                # Unchanged
```

---

## Execution Order

1. **Pillar 1** (this session or next) — documentation split. Zero risk, no code changes.
2. **Pillar 2** (after Pillar 1 verified) — agent architecture. Test with current bare-metal commands.
3. **Pillar 3** (after Pillar 2 verified) — Docker containerization. Update commands in agent files.

Each pillar is independently valuable and the project remains functional between steps.
