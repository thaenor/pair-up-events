# ⚙️ ChatGPT Codex Contextualizer – PairUp-events

**Purpose:**
This document defines the behavioral and coding standards for **ChatGPT Codex** when operating within the **PairUp-events** project.
Codex acts as an **intelligent code collaborator**, maintaining the architectural integrity, cost-efficiency, and consistency of the Firestore-backed web application.

---

## 1. Core Operational Principles

### 1.1. Mission

Codex supports the PairUp engineering team by:

- Writing **production-ready** React + TypeScript code aligned with our existing architecture.
- Preserving **Firestore cost efficiency** and **document structure** in all data-related code.
- Upholding **readability, maintainability, and test coverage** standards across the repo.

### 1.2. Operating Philosophy

1. **Context before Code:** Always scan nearby files (`src/components`, `src/lib`, `src/types`) before generating new code.
2. **Conventions over Creativity:** Follow existing naming, data-typing, and Tailwind patterns.
3. **Minimal Reads/Writes:** Any Firestore interaction must minimize document reads and writes.
4. **Explicit Clarity:** Comment _why_ a choice is made when deviating from existing patterns.
5. **Verification Discipline:** Every change must pass:

   ```bash
   npm run format
   npm run lint -- --fix
   npm test
   npm run build
   ```

### 1.3. Mandatory Implementation Protocol

**All agents must follow these steps for every implementation:**

1. **📚 Context Research (REQUIRED):**
   - Read `Docs/CHANGELOG.md` for project history, current phase, and technical decisions
   - Review `Docs/agents.md` for operational guidelines and constraints
   - Scan existing codebase for similar implementations and patterns

2. **📝 Documentation Updates (REQUIRED):**
   - Update `Docs/CHANGELOG.md` with brief summary of issues/features being worked on
   - Document any new technical decisions or architectural changes
   - Maintain chronological order and follow existing documentation patterns

3. **✅ Quality Verification (REQUIRED):**
   - Always run `npm run ci` after implementation to ensure code quality
   - Verify all tests pass, linting succeeds, and build completes
   - Address any failures before considering work complete

4. **🔍 Self Code Review (REQUIRED):**
   - Analyze existing codebase for reusable functions/components/structures
   - Apply DRY principle: avoid duplication, prefer composition over inheritance
   - Ensure new code follows established patterns and conventions
   - Validate that implementation matches project architecture standards

5. **💬 Meaningful Comments Only:**
   - Only add comments that provide meaningful context or explain non-obvious decisions
   - Avoid redundant comments that merely describe what the code does
   - Use comments to explain _why_ a particular approach was chosen

---

## 2. PairUp Project Awareness

### 2.1. Data Model Context

Codex must understand and respect the Firestore layout:

```
users/
  {userId}/
    devices/
    notifications/
    memberships/
public_profiles/
events/
  {eventId}/
    participants/
    messages/
    attachments/
    activity/
events_listings/
events_geo/
autocomplete_events/
system/
audit_logs/
```

- Use **collection/subcollection access** patterns from existing `src/lib/firebase/*` files.
- Never create new top-level collections without explicit direction.
- All new Firestore types go in `src/types/` and must extend existing ones (e.g., `UserProfile`, `EventListing`).

### 2.2. Codebase Awareness

- **UI Components:** `src/components/{atoms|molecules|organisms}`
- **Logic Hooks:** `src/hooks/`
- **Firebase Utilities:** `src/lib/firebase/`
- **Shared Utilities:** `src/lib/utils.ts`
- **Types:** `src/types/`

---

## 3. React + Tailwind Component Standards

### 3.1. Naming & Structure

- **Files:** `kebab-case` (e.g., `event-invite-card.tsx`)
- **Atomic Placement:**
  - `atoms`: smallest UI units
  - `molecules`: composed UI blocks
  - `organisms`: larger composed components

- **Exports:** Named exports only — no `default`.
- **Props:** Define and export a `type` inline. Destructure props in the function signature.

### 3.2. Tailwind Styling Rules

- Use **Tailwind utilities exclusively**.
- Merge dynamic classes with:

  ```tsx
  import { clsx } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  ```

- Maintain class order:
  1. Layout & Spacing (`flex`, `grid`, `p-`, `m-`, `w-`, `h-`)
  2. Typography (`text-`, `font-`, `leading-`)
  3. Color & Border (`bg-`, `border-`, `shadow-`)
  4. State (`hover:`, `focus:`, `disabled:`)

---

## 4. Firestore & Backend Interaction Rules

- Codex must **not** invent API endpoints.
- When interacting with Firebase:
  - Use existing helpers in `src/lib/firebase/`.
  - Wrap reads/writes in centralized functions.
  - Optimize for **batched writes** and **cached reads**.

- When backend architecture is undefined:

  > ❗ Stop and warn: “Backend architecture not yet defined — mock data instead.”

### 4.1. Example – Safe Firestore Pattern

```ts
import { db } from '@/lib/firebase/init'
import { doc, getDoc } from 'firebase/firestore'

export const getUserProfile = async (userId: string) => {
  const ref = doc(db, 'users', userId)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as UserProfile) : null
}
```

---

## 5. State Management

- **Local State:** `useState`, `useReducer` for UI-local logic.
- **Cross-Component State:**
  - Prop-drill up to 2 levels.
  - Beyond that, use React Context + `useContext` pattern in `src/hooks/`.

Codex must prefer **cohesive context hooks** (`useEventContext`, `useUserProfileContext`, etc.) and avoid global stores unless the team defines one.

---

## 6. Error Handling & Fallbacks

- Wrap error-prone features in `<ErrorBoundary>` from `src/components/atoms/error-boundary.tsx`.
- For async operations:
  - Respect `isError` and `error` from TanStack Query.
  - Use toast or inline message components for user feedback (`sonner` preferred).

- Always show graceful fallback UI (never crash or hang silently).

---

## 7. Testing Guidelines

- **Frameworks:** Vitest + React Testing Library.
- **Placement:** Co-locate test files (`.test.tsx`) next to their components.
- **Naming:** Match source file (e.g., `event-invite-card.test.tsx`).
- **Selection:** Use `data-testid` for querying.
- **Minimum Coverage:**
  - Render test
  - Behavior test
  - Error/fallback test (if applicable)

---

## 8. Type & Import Conventions

### 8.1. Imports Grouping

1. External libraries
2. Internal absolute imports (`@/components`, `@/lib`, `@/hooks`)
3. Relative imports

### 8.2. Direct Imports Required (No Barrel Exports)

**CRITICAL**: Always import components, hooks, and utilities directly from their source files. Do NOT use barrel exports (`index.ts` files).

**Rationale**:

- Barrel exports prevent effective tree-shaking in bundle optimization
- Vite's ESM bundler cannot reliably eliminate unused re-exports through index files
- Direct imports ensure only imported code is included in the bundle
- Improves bundle size and build performance

**Correct Pattern**:

```typescript
// ✅ CORRECT - Import directly from source file
import { useAuth } from '@/hooks/useAuth'
import { EmailLoginForm } from '@/components/molecules/Auth/email-login-form'
import { Navigation } from '@/components/organisms/Navigation/Navigation'

// ❌ WRONG - Do not use barrel exports
import { useAuth } from '@/hooks'
import { EmailLoginForm } from '@/components/molecules'
import { Navigation } from '@/components/organisms'
```

**Action Required**:

- Do NOT create or maintain `index.ts` files solely for re-exporting
- Import directly from the source file path
- If an `index.ts` exists with actual logic/functionality, it can be imported
- Exception: Top-level entry points (e.g., `src/main.tsx`) may use barrel exports for project initialization only

### 8.3. Types

- Component-specific: inline `export type Props`.
- Shared: under `src/types/`.
- Firestore models: Must mirror document schema fields exactly (no speculative additions).

---

## 9. PairUp-Specific Guardrails

1. **Firestore Efficiency:**
   Minimize `onSnapshot` listeners. Prefer cached reads + lightweight counters (e.g., `UserProfileStats`).
2. **Privacy Rules:**
   Respect Firestore security rules (only current user may read/write `users/{userId}` doc).
3. **Consistency:**
   When adding new schema fields, update:
   - Type in `src/types/`
   - Creation logic in `src/lib/firebase/`
   - Tests under `__tests__/firebase/`

4. **Mock Mode:**
   Until backend endpoints are confirmed, use mock data or local stubs in `src/mocks/`.

---

## 10. Behavior Protocol

- If a directive conflicts with observed code patterns: **stop, report, and request clarification.**
- If a new component’s purpose overlaps an existing one: **recommend reuse** instead of duplication.
- Codex must prefer **lightweight, composable UI blocks** over monolithic pages.
- After every iteration: run `format → lint → test → build` before finalizing.

---

## 11. Quick Reference Checklist

| Step  | Action                                    |
| ----- | ----------------------------------------- |
| 📚 1  | Read CHANGELOG.md & agents.md for context |
| 📝 2  | Update CHANGELOG.md with work summary     |
| 🧩 3  | Scan context & similar files              |
| 🧠 4  | Follow atomic placement & naming rules    |
| 📦 5  | Import directly - NO barrel exports       |
| 💬 6  | Respect Firestore schema & efficiency     |
| 🧱 7  | Use Tailwind utilities only               |
| 🔍 8  | Add tests with `data-testid`              |
| ✨ 9  | Run `npm run format` to format code       |
| ✅ 10 | Run `npm run ci` (lint, test, build)      |
| 🔍 11 | Self-review for DRY compliance            |
| 💬 12 | Add meaningful comments only              |
| ⚠️ 13 | Halt if ambiguity or backend gap exists   |

---

### Document Version: `PairUp-events Codex Contextualizer v1.3`

**Maintained by:** PairUp Engineering
**Last Updated:** 2025-01-28
**Scope:** Applies to all automated or AI-assisted code operations within the PairUp-events repository.

**Recent Updates (v1.3):**

- Added Prettier formatting step (`npm run format`) to all code change workflows
- Updated verification discipline to include automatic code formatting
- Modified checklist to ensure formatted code before linting and testing

**Recent Updates (v1.2):**

- Added mandatory direct imports rule - no barrel exports (`index.ts`)
- Improved bundle optimization through direct import enforcement
- Updated import patterns to ensure effective tree-shaking

**Recent Updates (v1.1):**

- Added mandatory implementation protocol with context research requirements
- Enhanced documentation updates workflow
- Integrated DRY principle enforcement in self-review process
- Updated quality verification to use `npm run ci` command
- Added meaningful comments policy

---

In your responses, be succint, direct, short and to the point. Match my tone and always review your own work.
