> Why did the developer go broke? Because he used up all his cache.

# Pair Up Events

Vite + React + TypeScript web app backed by Firebase (Auth, Firestore, Storage). Social platform where two pairs (4 people total) meet through shared activities. Deployed to GitHub Pages from `main`.

## Dev Container

ALWAYS run all the commands inside a dev container!

> (already installed) Requires Docker Desktop running and the Dev Containers CLI installed:
> `npm install -g @devcontainers/cli`

```bash
# Build & start (first time or after config changes)
devcontainer up --workspace-folder .

# Enter a shell inside the container
devcontainer exec --workspace-folder . bash

# Run agents inside the container
devcontainer exec --workspace-folder . claude
devcontainer exec --workspace-folder . qwen

# Stop the container
devcontainer down --workspace-folder .
```

All dependencies (`node_modules`, Firebase emulators, Playwright browsers, Java) live inside the container and do not affect the host machine.

## Commands

Note: make sure we are inside a dev container.

```bash
npm run dev                 # local dev server — uses Firebase emulators by default
npm run dev:live            # dev server against live Firebase (VITE_USE_EMULATOR=false)
npm run emulator:start      # start auth + firestore + storage emulators
npm run typecheck           # tsc --noEmit
npm run lint                # eslint
npm run test                # vitest run
npm run test:e2e            # playwright
npm run ci                  # format + lint + typecheck — run before every PR
```

Node **24.x**. Pre-commit runs `npm run ci` (format + lint + typecheck) via Husky — E2E is not run on commit.

## Code Layout

- `src/components/` — atomic design: `atoms` / `molecules` / `organisms`
- `src/contexts/` — React contexts (auth, etc.)
- `src/hooks/` — reusable hooks, incl. Firebase auth helpers
- `src/lib/firebase/` — Firebase config + emulator wiring
- `src/entities/` — domain entities with Zod validation
- `src/pages/` — route components
- `tests/e2e/` — Playwright specs; see `tests/e2e/README.md`
- `firebase/` — emulator rules and indexes

## Docs

| File                                          | Load when…                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `Docs/data-model.md`                          | **Any Firestore work** — collections, shapes, query patterns, privacy rules |
| `Docs/design/visual-design.md`                | Tokens, colours, typography, animations, voice & tone                       |
| `Docs/design/component-system.md`             | Component variants, tokens, states, behaviour                               |
| `Docs/design/accessibility-and-responsive.md` | WCAG rules, touch targets, focus states, responsive rules                   |
| `Docs/product/product-overview.md`            | User roles (A/B/C/D), use cases, platform characteristics                   |
| `Docs/product/user-flows.md`                  | Event lifecycle diagram, page-by-page flows                                 |
| `Docs/product/principles-and-personas.md`     | Design principles, user personas                                            |
| `Docs/component-tree-map.md`                  | Existing component locations — may drift; verify against `src/`             |
| `Docs/testing.md`                             | Testing strategy, emulator setup                                            |

Config files that matter: `tailwind.config.ts` · `firestore.rules` · `storage.rules` · `firebase.json`

## Conventions

- **Zod** for all validation at system boundaries (forms, Firestore reads) — never trust raw input
- **Firestore** — minimise reads/writes; follow patterns in `Docs/data-model.md` before writing any query
- **Tailwind-first** — check `tailwind.config.ts` for existing tokens before adding new ones; no raw hex in components
- **Tests** — co-locate under `__tests__/` next to the source file
- **Always run `npm run ci`** before declaring any task done
- **Business logic** — keep in hooks/services; components are for rendering only
- **Firestore hooks** — never call `getDoc`/`setDoc`/`onSnapshot` directly in component bodies; always go through a hook

### Component rules

- File names: `kebab-case` — e.g. `event-invite-card.tsx`
- Named exports only — no `default` exports
- No barrel exports — import directly from the source file; `index.ts` re-exports break Vite tree-shaking
  ```ts
  import { useAuth } from '@/hooks/useAuth' // ✅
  import { useAuth } from '@/hooks' // ❌
  ```
- Tailwind class order: Layout & Spacing → Typography → Colour & Border → State variants

## Gotchas

- **Firestore schema changes** — always cross-reference `Docs/data-model.md` and `firebase/` rules; wrong rules silently break security
- **Auth emulator** — E2E tests depend on the Firebase Auth emulator; changes to auth flows must keep the emulator path working
- **`.env*` files** — never commit them
- **Firestore listener leaks** — `onSnapshot` must return its unsubscribe function from `useEffect` cleanup; forgetting this leaks listeners on unmount
- **Firestore read patterns** — never read an entire collection; always apply `where`/`limit`; batch parallel reads with `Promise.all` instead of sequential `await` loops; use `transaction` for atomic multi-document writes
- **Bundle size** — gzipped target < 150 KB (good) / > 200 KB (investigate code splitting or dep removal)
