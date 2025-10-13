# ⚙️ ChatGPT Codex Contextualizer – PairUp-events

**Purpose:**
This document defines the behavioral and coding standards for **ChatGPT Codex** when operating within the **PairUp-events** project.
Codex acts as an **intelligent code collaborator**, maintaining the architectural integrity, cost-efficiency, and consistency of the Firestore-backed web application.

---

## 1. Core Operational Principles

### 1.1. Mission

Codex supports the PairUp engineering team by:

* Writing **production-ready** React + TypeScript code aligned with our existing architecture.
* Preserving **Firestore cost efficiency** and **document structure** in all data-related code.
* Upholding **readability, maintainability, and test coverage** standards across the repo.

### 1.2. Operating Philosophy

1. **Context before Code:** Always scan nearby files (`src/components`, `src/lib`, `src/types`) before generating new code.
2. **Conventions over Creativity:** Follow existing naming, data-typing, and Tailwind patterns.
3. **Minimal Reads/Writes:** Any Firestore interaction must minimize document reads and writes.
4. **Explicit Clarity:** Comment *why* a choice is made when deviating from existing patterns.
5. **Verification Discipline:** Every change must pass:

   ```bash
   npm run lint -- --fix
   npm test
   npm run build
   ```

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

* Use **collection/subcollection access** patterns from existing `src/lib/firebase/*` files.
* Never create new top-level collections without explicit direction.
* All new Firestore types go in `src/types/` and must extend existing ones (e.g., `UserProfile`, `EventListing`).

### 2.2. Codebase Awareness

* **UI Components:** `src/components/{atoms|molecules|organisms}`
* **Logic Hooks:** `src/hooks/`
* **Firebase Utilities:** `src/lib/firebase/`
* **Shared Utilities:** `src/lib/utils.ts`
* **Types:** `src/types/`

---

## 3. React + Tailwind Component Standards

### 3.1. Naming & Structure

* **Files:** `kebab-case` (e.g., `event-invite-card.tsx`)
* **Atomic Placement:**

  * `atoms`: smallest UI units
  * `molecules`: composed UI blocks
  * `organisms`: larger composed components
* **Exports:** Named exports only — no `default`.
* **Props:** Define and export a `type` inline. Destructure props in the function signature.

### 3.2. Tailwind Styling Rules

* Use **Tailwind utilities exclusively**.
* Merge dynamic classes with:

  ```tsx
  import { clsx } from 'clsx';
  import { twMerge } from 'tailwind-merge';
  ```
* Maintain class order:

  1. Layout & Spacing (`flex`, `grid`, `p-`, `m-`, `w-`, `h-`)
  2. Typography (`text-`, `font-`, `leading-`)
  3. Color & Border (`bg-`, `border-`, `shadow-`)
  4. State (`hover:`, `focus:`, `disabled:`)

---

## 4. Firestore & Backend Interaction Rules

* Codex must **not** invent API endpoints.
* When interacting with Firebase:

  * Use existing helpers in `src/lib/firebase/`.
  * Wrap reads/writes in centralized functions.
  * Optimize for **batched writes** and **cached reads**.
* When backend architecture is undefined:

  > ❗ Stop and warn: “Backend architecture not yet defined — mock data instead.”

### 4.1. Example – Safe Firestore Pattern

```ts
import { db } from '@/lib/firebase/init';
import { doc, getDoc } from 'firebase/firestore';

export const getUserProfile = async (userId: string) => {
  const ref = doc(db, 'users', userId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as UserProfile) : null;
};
```

---

## 5. State Management

* **Local State:** `useState`, `useReducer` for UI-local logic.
* **Cross-Component State:**

  * Prop-drill up to 2 levels.
  * Beyond that, use React Context + `useContext` pattern in `src/hooks/`.

Codex must prefer **cohesive context hooks** (`useEventContext`, `useUserProfileContext`, etc.) and avoid global stores unless the team defines one.

---

## 6. Error Handling & Fallbacks

* Wrap error-prone features in `<ErrorBoundary>` from `src/components/atoms/error-boundary.tsx`.
* For async operations:

  * Respect `isError` and `error` from TanStack Query.
  * Use toast or inline message components for user feedback (`sonner` preferred).
* Always show graceful fallback UI (never crash or hang silently).

---

## 7. Testing Guidelines

* **Frameworks:** Vitest + React Testing Library.
* **Placement:** Co-locate test files (`.test.tsx`) next to their components.
* **Naming:** Match source file (e.g., `event-invite-card.test.tsx`).
* **Selection:** Use `data-testid` for querying.
* **Minimum Coverage:**

  * Render test
  * Behavior test
  * Error/fallback test (if applicable)

---

## 8. Type & Import Conventions

### 8.1. Imports Grouping

1. External libraries
2. Internal absolute imports (`@/components`, `@/lib`, `@/hooks`)
3. Relative imports

### 8.2. Types

* Component-specific: inline `export type Props`.
* Shared: under `src/types/`.
* Firestore models: Must mirror document schema fields exactly (no speculative additions).

---

## 9. PairUp-Specific Guardrails

1. **Firestore Efficiency:**
   Minimize `onSnapshot` listeners. Prefer cached reads + lightweight counters (e.g., `UserProfileStats`).
2. **Privacy Rules:**
   Respect Firestore security rules (only current user may read/write `users/{userId}` doc).
3. **Consistency:**
   When adding new schema fields, update:

   * Type in `src/types/`
   * Creation logic in `src/lib/firebase/`
   * Tests under `__tests__/firebase/`
4. **Mock Mode:**
   Until backend endpoints are confirmed, use mock data or local stubs in `src/mocks/`.

---

## 10. Behavior Protocol

* If a directive conflicts with observed code patterns: **stop, report, and request clarification.**
* If a new component’s purpose overlaps an existing one: **recommend reuse** instead of duplication.
* Codex must prefer **lightweight, composable UI blocks** over monolithic pages.
* After every iteration: run `lint → test → build` before finalizing.

---

## 11. Quick Reference Checklist

| Step | Action                                  |
| ---- | --------------------------------------- |
| 🧩 1 | Scan context & similar files            |
| 🧠 2 | Follow atomic placement & naming rules  |
| 💬 3 | Respect Firestore schema & efficiency   |
| 🧱 4 | Use Tailwind utilities only             |
| 🔍 5 | Add tests with `data-testid`            |
| 🧰 6 | Lint, test, build, self-review          |
| ⚠️ 7 | Halt if ambiguity or backend gap exists |

---

### Document Version: `PairUp-events Codex Contextualizer v1.0`

**Maintained by:** PairUp Engineering
**Last Updated:** 2025-10-13
**Scope:** Applies to all automated or AI-assisted code operations within the PairUp-events repository.

---

In your responses, be succint, direct, short and to the point. Match my tone and always review your own work.