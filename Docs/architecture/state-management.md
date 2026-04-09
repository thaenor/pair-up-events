# State Management & Error Handling

## State Strategy

React state management follows a tiered approach based on scope and complexity.

### Local State (UI-Specific)

Use `useState` and `useReducer` for UI-local logic that doesn't need to cross component boundaries:

```tsx
// ✅ Form state in a single component
export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: FormEvent) => {
    // Validate and submit
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

### Cross-Component State via Props (Shallow)

Prop-drill up to 2 levels for shared state:

```tsx
// Level 0: Parent component
export const EventPage = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  return <EventList selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
}

// Level 1: First child
export const EventList = ({ selectedEventId, onSelectEvent }: Props) => {
  return (
    <ul>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          selected={event.id === selectedEventId}
          onClick={() => onSelectEvent(event.id)}
        />
      ))}
    </ul>
  )
}

// Level 2: Grandchild (last level for drilling)
export const EventCard = ({ event, selected, onClick }: Props) => {
  return <li onClick={onClick}>{event.title}</li>
}
```

### Cross-Component State via Context (Beyond 2 Levels)

Use React Context for state that needs to cross more than 2 component levels:

```tsx
// src/contexts/UserContext.tsx
import { createContext, useContext, ReactNode } from 'react'
import type { User } from '@/types'

type UserContextType = {
  user: User | null
  loading: boolean
  error: Error | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch user on mount
  useEffect(() => {
    // ...
  }, [])

  return <UserContext.Provider value={{ user, loading, error }}>{children}</UserContext.Provider>
}

// src/hooks/useUser.ts
export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
```

### Cohesive Context Hooks

Create context hooks for related functionality:

```tsx
// ✅ Good: Cohesive context for event-related state
export const useEventContext = () => {
  const { event, loading, error } = useContext(EventContext)
  return { event, loading, error }
}

// ❌ Avoid: Global catch-all store
export const useAppState = () => {
  const { user, event, ui, theme, notifications, ... } = useContext(AppContext)
  // Too many concerns mixed together
}
```

### No Global Stores (Unless Defined by Team)

Unless the team explicitly defines a global store pattern, avoid:

- Redux, Zustand, or other state managers
- Global variables or window properties
- Singleton services with mutable state

The project uses React Context + custom hooks as the standard approach.

## Error Handling

### Error Boundaries

Wrap error-prone features in `<ErrorBoundary>` from `src/components/atoms/error-boundary.tsx`:

```tsx
// Wrap components that might throw
<ErrorBoundary>
  <ChatInterface />
</ErrorBoundary>

// Wrapped component can throw safely
export const ChatInterface = () => {
  // If this throws, ErrorBoundary catches it
  const { messages } = useChatMessages()
  return <div>{messages.map(m => ...)}</div>
}
```

### Async Operations Error Handling

Respect the `isError` and `error` states from TanStack Query — never silently ignore them:

```tsx
export const EventDetails = ({ eventId }: Props) => {
  // React Query example
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEvent(eventId),
  })

  // Handle states explicitly
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return <EventCard event={event} />
}
```

### User Feedback

Provide user-facing feedback for errors:

```tsx
import { toast } from 'sonner'

const handleSubmit = async () => {
  try {
    await createEvent(formData)
    toast.success('Event created successfully!')
  } catch (error) {
    toast.error(`Failed to create event: ${error.message}`)
  }
}
```

### Graceful Fallbacks

Never crash silently or leave UI in a broken state:

```tsx
// ✅ Always provide fallback UI
export const EventList = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(setError)
  }, [])

  if (error) return <div>Failed to load events. Please try again.</div>
  if (events.length === 0) return <div>No events yet.</div>

  return <ul>{events.map(e => <EventCard key={e.id} event={e} />)}</ul>
}

// ❌ WRONG - Silent failure or crash
export const EventList = () => {
  const events = getEvents()  // Synchronous, might throw
  return <ul>{events.map(...)}</ul>  // Crashes if getEvents fails
}
```

## Common Patterns

### Loading States

Show clear feedback during async operations:

```tsx
import { LoadingSpinner } from '@/components/atoms/loading-spinner'

export const DataView = () => {
  const { data, isLoading, error } = useQuery(...)

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && <Content data={data} />}
    </>
  )
}
```

### Optimistic Updates

Update UI before confirming with server:

```tsx
const handleLike = async (eventId: string) => {
  // Optimistically update UI
  setLiked(!liked)

  try {
    // Then confirm with server
    await toggleEventLike(eventId)
  } catch (error) {
    // Revert on error
    setLiked(!liked)
    toast.error('Failed to like event')
  }
}
```

### Dependent Queries

Fetch data based on other async data:

```tsx
export const UserEvents = () => {
  // First query
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })

  // Second query depends on first
  const { data: events } = useQuery({
    queryKey: ['events', user?.id],
    queryFn: () => getUserEvents(user!.id),
    enabled: !!user,  // Only run when user exists
  })

  return <div>{events?.map(e => ...)}</div>
}
```

### Clearing State

Reset state when navigating or when data changes:

```tsx
useEffect(() => {
  return () => {
    // Cleanup: Clear form state when component unmounts
    setFormData({})
    setErrors({})
  }
}, [])
```

## Anti-Patterns to Avoid

| Anti-Pattern                                | Why It's Bad               | Alternative                         |
| ------------------------------------------- | -------------------------- | ----------------------------------- |
| **useState in loops**                       | Breaks React hooks rules   | Move state to parent, pass as props |
| **Setting state in useEffect without deps** | Causes infinite loops      | Always include dependency array     |
| **Direct state mutation**                   | React can't detect changes | Use setState or context setters     |
| **useCallback with missing deps**           | Stale closures, bugs       | Include all dependencies            |
| **Prop drilling > 2 levels**                | Makes code hard to follow  | Use Context API for deep props      |
| **Multiple useState for related data**      | Hard to keep in sync       | Use useReducer for related state    |
| **Error swallowing**                        | Silent failures            | Always handle and report errors     |

## Behavioral Rules

**Conflict Resolution**: If a directive conflicts with observed code patterns in the codebase:

- Stop and report the discrepancy
- Request clarification before proceeding

**Reuse Over Duplication**: If a new component's purpose overlaps with an existing one:

- Recommend reusing the existing component
- Only create new if genuinely different needs exist

**Composable Over Monolithic**: Prefer lightweight, composable UI blocks:

- Small, focused components are easier to test and reuse
- Large monolithic pages are harder to maintain

**Composition Over Inheritance**: When sharing behaviour between components:

- Use component composition (passing children or render props) rather than class inheritance
- Extract shared logic into custom hooks — not into a common parent class
- Apply the DRY principle by composing small units, not by extending base components
