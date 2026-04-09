# AGENTS.md — PairUp Events

**Universal entry point for all agents (Claude, Copilot, Codex, or Cursor)**

## Quick Start — Read These First

Before writing any code, read these documents in order:

1. **Project Knowledge** – `Docs/architecture/`
   - `project-overview.md` — Tech stack, repo structure, build process
   - `component-standards.md` — Naming, exports, Tailwind, type conventions
   - `firebase-patterns.md` — Firestore rules, schema, cost optimization
   - `state-management.md` — State tiers, Context patterns, error handling
   - `testing-standards.md` — Test placement, frameworks, coverage expectations
   - `design-language.md` — Design tokens, visual system, accessibility

2. **Project Context** – `Docs/`
   - `data-model.md` — Firestore schema (reference)
   - `component-tree-map.md` — Component hierarchy
   - `CHANGELOG.md` — Project history and current phase
   - `Backlog.md` — Prioritized work items

## Mandatory Protocol (All Tasks)

Every agent must follow these steps:

### 1. 📚 Context Research

- Read the relevant architecture docs from the list above
- Scan `Docs/CHANGELOG.md` for recent changes and current phase
- Look for similar implementations in the codebase before starting
- Check if related components/hooks already exist

### 2. 💻 Implementation

- Follow conventions from `component-standards.md` strictly:
  - Named exports only, direct imports (no barrel exports)
  - Tailwind utilities only, use clsx + twMerge for conditionals
  - data-testid selectors, co-locate tests
- Apply Firestore patterns from `firebase-patterns.md`:
  - Use helpers from `src/lib/firebase/`, never direct access
  - Batch writes, minimize reads, cache where possible
- Keep components small and composable

### 3. 📝 Documentation

- Update `Docs/CHANGELOG.md` with brief work summary
- Note any new technical decisions or patterns introduced
- Keep entries chronological

### 4. ✅ Quality Gate

Run this before considering work complete. Docker is the canonical runtime (Pillar 3); bare `npm` is a fallback only.

```bash
# Parallel lint + typecheck + unit tests + build
docker compose --profile ci up --exit-code-from build

# E2E (only if user-facing flows changed)
docker compose --profile dev --profile e2e up --exit-code-from test-e2e
```

See `.agents/docker-commands.md` for the full cheatsheet. If any step fails, fix issues before proceeding.

### 5. 🔍 Self-Review

- Apply DRY principle: reuse existing components/hooks, avoid duplication
- Check for patterns in similar code — follow established conventions
- Ensure no hardcoded values (use constants instead)
- Verify tests exist for new functionality
- Write meaningful comments only (explain WHY, not WHAT)

## Agent Tiers

Tasks are routed to different models based on complexity. See `.agents/tiers.md` for full definitions.

| Tier        | Model                    | Use Case                                              |
| ----------- | ------------------------ | ----------------------------------------------------- |
| **Planner** | Claude Opus / ultrathink | Architecture decisions, feature planning, code review |
| **Builder** | Claude Sonnet            | Implementation, refactoring, test writing             |
| **Runner**  | Claude Haiku             | Lint fixes, formatting, type errors, build validation |

For human developers: use your best judgment or escalate to a Planner for complex decisions.

## Key Rules

### Components & Imports

- ✅ Named exports only, no default exports
- ✅ Direct imports: `import { Component } from '@/components/atoms/button'`
- ❌ No barrel exports: `import { Component } from '@/components'`
- ✅ Tailwind utilities only, no inline styles
- ✅ Use `clsx` + `twMerge` for dynamic classes

### Firestore

- ✅ Use helpers from `src/lib/firebase/` (e.g., `getUserProfile`)
- ✅ Batch writes, cache reads, minimize listeners
- ✅ Match schema exactly — no speculative fields
- ❌ Don't invent API endpoints
- ❌ If backend undefined: use mock data or ask for clarification

### Testing

- ✅ Co-locate tests with source files (component.tsx + component.test.tsx)
- ✅ Use `data-testid` selectors (stable, not brittle)
- ✅ Include 3 test types: render, behavior, error/fallback
- ✅ E2E tests via Playwright (mobile-first: Android Pixel 5)

### State Management

- ✅ Local state: `useState`, `useReducer`
- ✅ Cross-component (2 levels max): prop drill
- ✅ Beyond 2 levels: React Context + custom hook (`useEventContext`)
- ❌ No global stores or Redux without team agreement

### If Uncertain

- **Convention conflict?** → Stop and ask for clarification
- **Component overlap?** → Recommend reusing existing component
- **Backend undefined?** → Use mock data and flag for clarification
- **Time to discuss?** → Communicate findings before proceeding

## Available Resources

### Agent Instructions (in `.agents/`)

- `.agents/planner/` — Prompt generation, architecture decisions
- `.agents/builder/` — Implementation, test writing, E2E testing
- `.agents/runner/` — Linting, formatting, build validation

### Project Documentation (in `Docs/`)

- `Backlog.md` — Prioritized features and bugs
- `CHANGELOG.md` — Decision log and release notes
- `data-model.md` — Complete Firestore schema reference

### Code References

- `src/components/` — Atomic design examples
- `src/lib/firebase/` — Firebase helpers (copy these patterns)
- `src/hooks/` — Custom hooks (study before creating new ones)
- `src/types/` — Type definitions (add new types here)

## Quick Links

| Need                | Location                                                        |
| ------------------- | --------------------------------------------------------------- |
| **Start a feature** | `Docs/agentic-refactor-plan.md` (see Pillar 1 for document org) |
| **Understand data** | `Docs/data-model.md`                                            |
| **See components**  | `Docs/component-tree-map.md`                                    |
| **Check backlog**   | `Docs/Backlog.md`                                               |
| **Review history**  | `Docs/CHANGELOG.md` (last 5 entries)                            |
| **Find helpers**    | `src/lib/firebase/`                                             |
| **Learn patterns**  | Look at similar components in `src/components/`                 |

## Success Checklist

Before marking a task complete:

- [ ] Read relevant architecture docs
- [ ] Followed component-standards.md conventions
- [ ] Applied firebase-patterns.md rules (if applicable)
- [ ] Tests written and passing (render + behavior + error)
- [ ] Updated CHANGELOG.md
- [ ] Ran the `ci` Docker profile (`docker compose --profile ci up --exit-code-from build`) — all checks pass
- [ ] Self-reviewed for DRY and patterns
- [ ] All meaningful comments added (WHY, not WHAT)
- [ ] No breaking changes to existing APIs
- [ ] Halted and flagged if ambiguity or undefined backend exists

---

**Version**: 2.0 (refactored from agents.md + Cursor commands)  
**Last Updated**: 2026-04-08  
**Scope**: All code changes in PairUp Events repository
