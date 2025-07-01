# Gemini AI: Project Operations Playbook

This document is the primary directive for the Gemini AI assistant. Its purpose is to ensure that all generated code, refactoring, and project interactions align perfectly with this project's architecture, conventions, and quality standards. The AI must adhere to these rules on every task.

---

## 1. General Principles

- **Readability First:** Code should be written for humans first, machines second. Prioritize clarity and simplicity.
- **Adhere to Existing Patterns:** Before writing new code, analyze the surrounding files and directories to understand and replicate the established conventions. Consider the component tree, the parents and children and other files that import the file you are editing aswell.
- **Verify Your Work:** After any code modification, run `npm run lint -- --fix` and `npm run build` to ensure changes are error-free and conform to project standards. Double check your own code and act as a code reviewer, criticising and improving your own work.
- **conversational:** Act as an intellectual sparring partner by challenging assumptions, providing counterpoints, testing logic, offering alternative perspectives, and prioritizing truth over agreement. As a rule of thumb, unless obvious or stated otherwise, avoid assumptions and instead ask for clarifications. Be pragmatic, grounded and direct.

---

## 2. React & Component Architecture

### 2.1. Component Design

- **File Naming:** Component files MUST be named in `kebab-case`.
  - **DO:** `user-profile-card.tsx`
  - **DON'T:** `UserProfileCard.tsx`, `user_profile_card.tsx`
- **File Structure:** Create components as a single file within the appropriate Atomic Design directory (`atoms`, `molecules`, `organisms`).
  - **Example:** A request for a "Submit Button" results in `src/components/atoms/submit-button.tsx`.
  - **Example:** A request for a "User Profile Card" results in `src/components/molecules/user-profile-card.tsx`.
- **Props:**
  - Use `React.FC` and define a `type` for props. Export the type.
  - Destructure props in the function signature.
- **Children:** Use the `children` prop for component composition. Do not pass components as other props.
- **Scaffolding:** All new components MUST be functional components using TypeScript and arrow functions.

**Template: New Component**
```tsx
import React, 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Export the type for external use
export type MyComponentProps = {
  className?: string;
  children?: React.ReactNode;
};

export const MyComponent: React.FC<MyComponentProps> = ({ className, children }) => {
  const classes = twMerge(
    'flex flex-col', // Base classes
    className,      // Props-based classes
  );

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
```

### 2.2. Styling (Tailwind CSS)

- **Utility-First:** All styling MUST be done with Tailwind CSS utility classes.
- **No Other CSS:** Do NOT use inline styles (`style={{}}`) or write in `.css` files for component-specific styles.
- **Dynamic Classes:** ALWAYS use `clsx` and `tailwind-merge` (via `src/lib/utils.ts`) for conditional or combined classes.
- **Class Ordering:** Strictly follow this order to maintain consistency:
  1.  **Layout & Grid:** `display`, `position`, `flex`, `grid`, `p-`, `m-`, `w-`, `h-`
  2.  **Typography:** `font-`, `text-`, `leading-`, `tracking-`
  3.  **Colors & Backgrounds:** `bg-`, `text-`, `border-`, `shadow-`
  4.  **States:** `hover:`, `focus:`, `disabled:`

---

## 3. State Management

- **Local State:** Use the `useState` hook for all component-local state.
- **Shared State:**
  - **Prop Drilling (Max 2 Levels):** If state needs to be passed down 2 levels or fewer, use prop-drilling.
  - **React Context (> 2 Levels):** If state needs to be passed down more than 2 levels, create a new, dedicated React Context.

**Template: New Context Provider**
```tsx
// src/hooks/use-my-context.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';

type MyContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);

  const value = useMemo(() => ({ isOpen, toggle }), [isOpen]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
};
```

---

## 4. API & Data Fetching (TanStack Query)

*(This section is a placeholder for a future, more detailed convention. For now, the AI will ask for clarification if new data-fetching logic is required. The proposed standard below can be adopted.)*

**Proposed Standard:**
- **Custom Hooks:** Encapsulate all queries in custom hooks (e.g., `useGetUserProfile`).
- **Query Keys:** Use structured, serializable query keys.
- **Location:** Place custom query hooks in `src/hooks/queries/`.

**Template: New Query Hook**
```tsx
// src/hooks/queries/use-user-profile.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Assuming a central API client

const fetchUserProfile = async (userId: string) => {
  // const response = await api.get(`/users/${userId}`);
  // return response.data;
  // Placeholder:
  return { id: userId, name: 'John Doe' };
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId, // Only run if userId is available
  });
};
```

---

## 5. Error Handling

- **UI Errors:** Use the existing `ErrorBoundary` component (`src/components/atoms/ErrorBoundary.tsx`) to wrap features that could fail and disrupt the user experience.
- **Async/API Errors:** In TanStack Query hooks, rely on the `isError` and `error` properties returned by the hook. In the UI, use these to show an appropriate error message (e.g., using the `sonner` or `toast` component).
- **Graceful Degradation:** Always design for the unhappy path. If a component fails to fetch data, it should display a clear error state, not crash the application.

---

## 6. Testing (Vitest & React Testing Library)

- **Coverage:** All new features (hooks, components, utilities) SHOULD be accompanied by meaningful tests.
- **Test Files:** Test files MUST be co-located with the source file, using the `.test.tsx` suffix (e.g., `user-profile-card.test.tsx`).
- **Queries:** Use `data-testid` attributes for selecting elements in tests to decouple tests from implementation details like class names.

**Template: New Component Test**
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders its children correctly', () => {
    render(
      <MyComponent>
        <span data-testid="child">Hello World</span>
      </MyComponent>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

---

## 7. Code Style & Formatting

- **Imports:** Organize imports in three groups, separated by newlines:
  1.  External libraries (`react`, `clsx`).
  2.  Internal absolute paths (`@/components`, `src/lib`).
  3.  Relative paths (`./helpers`, `../`).
- **Types:**
  - For component-specific props, define the `type` in the component file.
  - For shared types used across the application, add them to the appropriate file in `src/types/`.
- **Comments:** Write comments to explain the *why*, not the *what*.
  - **DO:** `// We use a Set for faster lookups`
  - **DON'T:** `// Loop over the array`