# Gemini – AI Coding Assistant Protocol for Pair Up Events

Operational reference for any AI coding assistant (Gemini, Copilot, Codex, Claude, Cursor, etc.) working in this repository.

---

## 1. Project Overview

**Pair Up Events** is a marketing site and authentication experience for a social platform that helps pairs of friends meet other pairs for shared activities.

- Landing page at `/` – story-driven sections (hero, how it works, benefits, testimonials, FAQs) with an early-access capture form powered by Brevo.
- Auth flow at `/login` – Google, Facebook, and email/password sign-in via Firebase Authentication.
- No backend beyond Firebase; all server-side logic lives in Firestore security rules and Firebase Auth.

---

## 2. Tech Stack

- **Bundler / dev server:** Vite
- **UI:** React 18 + TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn-inspired primitives + lucide-react
- **Auth & database:** Firebase Authentication + Firestore
- **Validation:** Zod
- **Unit tests:** Vitest + React Testing Library
- **E2E tests:** Playwright (local only via Husky pre-commit)
- **Linting / formatting:** ESLint + Prettier
- **Error tracking:** Sentry

---

## 3. Project Structure

```
src/
├── components/
│   ├── atoms/          # Smallest UI units (buttons, inputs, icons)
│   ├── molecules/      # Composed UI blocks (forms, cards)
│   ├── organisms/      # Larger composed sections (nav, hero, footer)
│   └── templates/      # Page-level layout shells
├── contexts/           # React contexts – e.g. UserContext.tsx (AuthProvider)
├── entities/           # Domain models, services, validation (user/, event/, invite/)
├── hooks/              # Custom hooks including Firebase auth helpers
├── lib/                # Firebase init, config, utilities
│   ├── firebase.ts     # Firebase app initialisation and exported instances
│   ├── config.ts       # Brevo embed URL and other runtime config
│   └── utils.ts        # Shared helpers
├── pages/              # Route-level components (home, login, 404)
└── tests/              # Vitest test suites
```

---

## 4. Key Conventions

### Component design
- Follow **atomic design**: atoms → molecules → organisms → templates.
- **Named exports only** – no `default` exports from component files.
- **No barrel exports** (`index.ts` re-exports): always import directly from the source file to preserve tree-shaking.
- File names use `kebab-case` (e.g. `email-login-form.tsx`).
- Props are defined and exported as an inline `type`, destructured in the function signature.

### TypeScript
- Strict mode is enabled – no `any`, no implicit returns, no loose types.
- Shared Firestore-mirroring types live in `src/types/`.
- Entity-specific types live alongside the entity in `src/entities/`.

### Validation
- Use **Zod** for all runtime validation (form inputs, Firestore reads).

### Styling
- **Tailwind utilities only** – no custom CSS files.
- Merge dynamic classes with `clsx` + `twMerge`.
- Class order: layout/spacing → typography → colour/border → state variants.

### Imports
```typescript
// Correct – import directly from source
import { useAuth } from '@/hooks/useAuth'
import { EmailLoginForm } from '@/components/molecules/Auth/email-login-form'

// Wrong – do not use barrel re-exports
import { useAuth } from '@/hooks'
```

### State management
- `useState` / `useReducer` for component-local state; prop-drill up to 2 levels.
- Beyond 2 levels use a React Context in `src/contexts/` consumed via a hook.
- No global state library – do not add one without discussion.

---

## 5. Quality Gates

Run this before every commit:

```bash
npm run ci
```

Runs in order: `format` → `lint` → `typecheck` → `test` → `build`. All five must pass.

### E2E tests
- Run **locally** only via Husky pre-commit hook. Manual run: `npm run test:e2e`.
- CI runs unit tests, linting, and build only – E2E excluded to keep deploys fast.

---

## 6. Firestore Rules

- `users/{userId}` – readable/writable only by the authenticated owner.
- Follow existing security rule structure for all other collections; never bypass it.
- Minimise `onSnapshot` listeners; prefer cached reads and lightweight counters.
- Do not create new top-level collections without explicit direction.

---

## 7. What NOT to Do

- **Do not add new auth providers** (e.g. Apple, Twitter) without first configuring them in the Firebase console and updating `FIREBASE_SETUP.md`.
- **Do not commit `.env.local`** – it contains live Firebase credentials and is gitignored.
- **Do not create barrel `index.ts` files** for re-exporting.
- **Do not invent API endpoints or new Firestore collections** without explicit direction.
- **Do not add a global state library** (Redux, Zustand, etc.) without team sign-off.
- **Do not push directly to `main`** – open a pull request and let CI pass first.

---

## 8. Mandatory Implementation Steps

1. Read `Docs/CHANGELOG.md` for current phase and recent decisions.
2. Scan nearby files before generating new code (`src/components`, `src/lib`, `src/types`).
3. Update `Docs/CHANGELOG.md` with a brief summary of what you changed.
4. Run `npm run ci` – all checks green before work is done.
5. Self-review: DRY compliance, correct atomic placement, naming consistency.

---

## 9. Testing Standards

- Framework: Vitest + React Testing Library.
- Co-locate test files next to their component: `<component>.test.tsx`.
- Query elements via `data-testid`. Minimum: render test, behaviour test, error/fallback test.

---

*Keep this document in sync with `Docs/agents.md`.*
