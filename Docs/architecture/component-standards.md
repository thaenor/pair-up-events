# Component Standards

## Atomic Design Hierarchy

Components are organized by complexity level:

### Atoms

Smallest, indivisible UI units with no component dependencies:

- Button, Modal, Tabs, Logo, Badge, Card
- Form inputs (text input, checkbox, select)
- Icons via lucide-react
- Text elements (headings, paragraphs)

### Molecules

Composed groups of atoms with light behavior:

- Auth forms (EmailLoginForm, EmailSignupForm)
- Event cards (EventInviteCard)
- Profile blocks
- Form groups (label + input + validation)

### Organisms

Large, feature-complete components combining multiple molecules:

- Landing page sections
- Navigation/Header
- Chat interface
- Event creation flow
- Event list with filtering

### Templates

Page layouts without route logic:

- Two-column layout
- Full-width layout
- Sidebar layout

### Pages

Route-level components at `src/pages/`:

- Index.tsx (home/landing)
- login.tsx
- events.tsx
- settings.tsx
- 404.tsx

## Naming Conventions

| Entity                   | Case                  | Example                                  |
| ------------------------ | --------------------- | ---------------------------------------- |
| **Files**                | kebab-case            | `event-invite-card.tsx`                  |
| **Components (exports)** | PascalCase            | `EventInviteCard`                        |
| **Variables/Functions**  | camelCase             | `getUserProfile`, `eventCount`           |
| **Constants**            | UPPER_SNAKE_CASE      | `MAX_EVENT_SIZE`, `API_TIMEOUT`          |
| **Booleans**             | is/has/should prefix  | `isLoading`, `hasError`, `shouldDisplay` |
| **Event Handlers**       | handle* or on* prefix | `handleClick`, `onSubmit`                |

## Export Rules

### Named Exports Only

Always use named exports. Never use default exports.

```tsx
// ✅ CORRECT
export type EventCardProps = {
  eventId: string
  title: string
}

export const EventCard = ({ eventId, title }: EventCardProps) => {
  return <div>{title}</div>
}

// ❌ WRONG
const EventCard = ...
export default EventCard
```

### Props Definition

Define props as an inline type and destructure in the function signature:

```tsx
// ✅ CORRECT
export type ButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

export const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
  // ...
}

// ❌ WRONG
export const Button = (props: any) => {
  // ...
}
```

### Direct Imports Required (No Barrel Exports)

**CRITICAL RULE**: Always import components, hooks, and utilities directly from their source files. Do NOT use barrel exports (`index.ts` files).

**Rationale**:

- Barrel exports prevent effective tree-shaking in Vite's ESM bundler
- Direct imports ensure only imported code is included in the final bundle
- Improves bundle size and build performance

```tsx
// ✅ CORRECT - Import directly from source
import { useAuth } from '@/hooks/useAuth'
import { EmailLoginForm } from '@/components/molecules/Auth/email-login-form'
import { Navigation } from '@/components/organisms/Navigation/Navigation'

// ❌ WRONG - Barrel exports
import { useAuth } from '@/hooks'
import { EmailLoginForm } from '@/components/molecules'
import { Navigation } from '@/components/organisms'
```

**Exceptions**:

- If an `index.ts` file contains actual logic or functionality (not just re-exports), it can be imported normally
- Top-level entry points (e.g., `src/main.tsx`) may use barrel exports for project initialization only
- Do NOT create or maintain `index.ts` files solely for the purpose of re-exporting other modules

## Import Grouping Order

Always group imports in this order:

1. **External libraries** (react, firebase, third-party packages)
2. **Internal absolute imports** (@/components, @/lib, @/hooks, @/types)
3. **Relative imports** (../sibling, ./same-directory)

```tsx
// External
import React, { useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { clsx } from 'clsx'

// Internal absolute
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/atoms/button'
import { getUserProfile } from '@/lib/firebase/user-service'
import type { UserProfile } from '@/types'

// Relative
import { helpers } from '../utils'
import { CONSTANTS } from './constants'
```

## Tailwind CSS Styling Rules

### Use Tailwind Utilities Only

Never use inline styles or CSS modules. All styling must use Tailwind classes.

```tsx
// ✅ CORRECT
<div className="flex items-center justify-between p-4 bg-blue-500">
  <h1 className="text-2xl font-bold text-white">Title</h1>
</div>

// ❌ WRONG
<div style={{ display: 'flex', padding: '16px' }}>
  <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Title</h1>
</div>
```

### Dynamic Class Merging

Use `clsx` + `twMerge` for conditional classes:

```tsx
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const Button = ({ disabled, variant = 'primary' }: ButtonProps) => {
  const classes = twMerge(
    clsx(
      'px-4 py-2 rounded transition',
      variant === 'primary' && 'bg-blue-500 text-white',
      variant === 'secondary' && 'bg-gray-200 text-gray-800',
      disabled && 'opacity-50 cursor-not-allowed'
    )
  )

  return <button className={classes}>{children}</button>
}
```

### Class Ordering Convention

When writing Tailwind classes, follow this order:

1. **Layout & Spacing** – `flex`, `grid`, `p-*`, `m-*`, `w-*`, `h-*`
2. **Typography** – `text-*`, `font-*`, `leading-*`
3. **Color & Border** – `bg-*`, `border-*`, `shadow-*`
4. **State** – `hover:*`, `focus:*`, `disabled:*`, `dark:*`

```tsx
// ✅ CORRECT ORDER
className =
  'flex items-center gap-4 p-6 text-lg font-semibold bg-white border rounded shadow-md hover:shadow-lg focus:outline-none disabled:opacity-50'
```

## Type Conventions

### Component-Specific Types

Define types inline and export them:

```tsx
export type NavLinkProps = {
  href: string
  label: string
  active?: boolean
}

export const NavLink = ({ href, label, active = false }: NavLinkProps) => {
  // ...
}
```

### Shared Types

Place reusable types in `src/types/`:

```tsx
// src/types/user.ts
export type User = {
  id: string
  email: string
  displayName: string
  createdAt: Date
}

// Usage in components
import type { User } from '@/types'
```

### Firestore Models

Types representing Firestore documents must match the schema exactly. No speculative additions.

```tsx
// ✅ Matches Firestore schema exactly
export type EventDocument = {
  id: string
  title: string
  description: string
  participants: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ❌ Adding fields that don't exist in Firestore
export type EventDocument = {
  id: string
  title: string
  participants: string[]
  estimatedCost?: number // ← Not in schema
}
```

## Component Testing Expectations

Each component should have a minimal test file (`.test.tsx`) with:

1. **Render test** – Component renders without crashing with required props
2. **Behavior test** – Key interactions work (click, submit, etc.)
3. **Error/fallback test** – Graceful handling of edge cases (if applicable)

```tsx
// event-card.test.tsx
import { render, screen } from '@testing-library/react'
import { EventCard } from './event-card'

describe('EventCard', () => {
  it('renders with event title', () => {
    render(<EventCard eventId="123" title="Game Night" />)
    expect(screen.getByText('Game Night')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<EventCard eventId="123" title="Game Night" onClick={onClick} />)
    screen.getByRole('button').click()
    expect(onClick).toHaveBeenCalled()
  })
})
```

## Accessibility Standards

Components must support:

- Keyboard navigation (Tab, Enter, Escape)
- ARIA attributes where appropriate
- Sufficient color contrast (WCAG AA)
- Semantic HTML (button, input, label, etc.)
- alt text for images

## Common Patterns

### Error Boundary Wrapper

Wrap error-prone features in `<ErrorBoundary>`:

```tsx
import { ErrorBoundary } from '@/components/atoms/error-boundary'
;<ErrorBoundary>
  <ChatInterface />
</ErrorBoundary>
```

### Loading States

Show loading spinners from `@/components/atoms/loading-spinner`:

```tsx
if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
return <Content data={data} />
```

### Toast Notifications

Use `sonner` for user feedback:

```tsx
import { toast } from 'sonner'

toast.success('Event created successfully')
toast.error('Failed to create event')
```
