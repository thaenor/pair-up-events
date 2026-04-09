# Firebase Patterns

## Core Principles

Firestore is a managed database with per-read/write billing. The following principles minimize costs while maintaining functionality:

1. **Minimize reads/writes** – Every document read costs money
2. **Batch writes** – Group multiple writes into single transaction
3. **Prefer cached reads** – Cache data locally and refresh on demand
4. **Minimize listeners** – Avoid excessive real-time snapshot subscriptions
5. **Query efficiently** – Use composite indexes for complex queries
6. **Respect security rules** – Firestore rules enforce data access boundaries

## Firestore Schema

The project uses the following collection structure:

```
users/
  {userId}/
    devices/                  # Device-specific data
    notifications/            # User notifications
    memberships/              # Pair memberships
public_profiles/
  {userId}/                   # Public user profile (denormalized for performance)
events/
  {eventId}/
    participants/             # Event participants
    messages/                 # Event chat messages
    attachments/              # Event attachments
    activity/                 # Event activity log
events_listings/              # Searchable event catalog
events_geo/                   # Geospatial index for events
autocomplete_events/          # Event autocomplete data
system/                       # System-level data
audit_logs/                   # Audit trail for compliance
```

Full schema details are available in `Docs/data-model.md`.

## Interaction Rules

### Use Centralized Helpers

All Firestore operations should use existing helpers in `src/lib/firebase/`:

```ts
// ✅ CORRECT - Use helper functions
import { getUserProfile } from '@/lib/firebase/user-service'
const user = await getUserProfile(userId)

// ❌ WRONG - Direct database access
import { db } from '@/lib/firebase/init'
import { doc, getDoc } from 'firebase/firestore'
const snap = await getDoc(doc(db, 'users', userId))
```

### Never Invent API Endpoints

Don't assume backend endpoints exist. Always:

1. Check existing helpers in `src/lib/firebase/`
2. Check `Docs/data-model.md` for schema confirmation
3. If backend is undefined, use mock data or local stubs in `src/mocks/`

**When backend is undefined**:

```ts
// Stop and warn: "Backend architecture not yet defined — mock data instead."
// Use stubs from src/mocks/ until the real endpoint is confirmed
import { mockEvents } from '@/mocks/events'
```

### Safe Firestore Read Pattern

```ts
import { db } from '@/lib/firebase/init'
import { doc, getDoc } from 'firebase/firestore'
import type { UserProfile } from '@/types'

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const ref = doc(db, 'users', userId)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as UserProfile) : null
}
```

### Safe Firestore Write Pattern (Batched)

```ts
import { db } from '@/lib/firebase/init'
import { writeBatch, doc, Timestamp } from 'firebase/firestore'

export const createEventWithParticipants = async (eventId: string, event: Event, participantIds: string[]) => {
  const batch = writeBatch(db)

  // Add event document
  batch.set(doc(db, 'events', eventId), {
    ...event,
    createdAt: Timestamp.now(),
  })

  // Add all participants in same batch
  participantIds.forEach(pId => {
    batch.update(doc(db, 'users', pId, 'memberships', eventId), {
      status: 'joined',
      joinedAt: Timestamp.now(),
    })
  })

  // Commit all at once
  await batch.commit()
}
```

### Cached Read Pattern

```ts
// Read once, cache locally, refresh on demand
export const useEventData = (eventId: string) => {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch once
    getEvent(eventId)
      .then(setEvent)
      .finally(() => setLoading(false))
  }, [eventId])

  // Manual refresh on demand
  const refresh = useCallback(() => getEvent(eventId).then(setEvent), [eventId])

  return { event, loading, refresh }
}
```

### Lightweight Counters (Not Listeners)

For aggregate data like event participant counts, prefer a dedicated counter field over a real-time listener on a subcollection. The project uses this pattern via `UserProfileStats`:

```ts
// ✅ CORRECT - Lightweight counter field (single read, no listener)
const profile = await getPublicProfile(userId)
const eventCount = profile.stats.eventsJoined // pre-computed counter field

// ❌ WRONG - Reading subcollection to count
const memberships = await getDocs(collection(db, 'users', userId, 'memberships'))
const eventCount = memberships.size // N+1 read, expensive
```

### Minimal Listeners Pattern

Avoid real-time listeners except where necessary. Use snapshots sparingly:

```ts
// ❌ WRONG - Listener on every render or for simple reads
onSnapshot(doc(db, 'users', userId), snap => {
  setUser(snap.data())
})

// ✅ CORRECT - One-time read for static data
const user = await getDoc(doc(db, 'users', userId))

// ✅ CORRECT - Listener only for truly dynamic data (chat messages, live updates)
const unsubscribe = onSnapshot(
  query(collection(db, 'events', eventId, 'messages'), orderBy('timestamp', 'desc'), limit(50)),
  snap => {
    setMessages(snap.docs.map(d => d.data()))
  }
)
```

## Schema Consistency

### Type Extension Rule

All new Firestore types must go in `src/types/` and **extend existing types** — never create a parallel type that duplicates existing fields:

```ts
// ✅ CORRECT - Extend existing type
import type { UserProfile } from '@/types'

export type UserProfileWithStats = UserProfile & {
  stats: {
    eventsJoined: number
    eventsCreated: number
  }
}

// ❌ WRONG - Duplicate fields from existing type
export type UserCardData = {
  id: string          // ← duplicating UserProfile.id
  displayName: string // ← duplicating UserProfile.displayName
  stats: { ... }
}
```

Existing base types include: `UserProfile`, `EventListing`, `PublicProfile`. Always check `src/types/` before creating a new one.

### When Adding New Fields, Update in This Order:

1. **Update Type** – `src/types/` (TypeScript interface)
2. **Update Creation Logic** – `src/lib/firebase/` (how documents are created)
3. **Update Tests** – `src/__tests__/firebase/` (test the new field)

```ts
// 1. Update type
// src/types/event.ts
export type Event = {
  id: string
  title: string
  description: string
  location: string
  maxParticipants: number
  cost?: number // ← NEW FIELD
  createdAt: Timestamp
}

// 2. Update creation logic
// src/lib/firebase/event-service.ts
export const createEvent = async (data: Omit<Event, 'id' | 'createdAt'>) => {
  const eventRef = doc(collection(db, 'events'))
  const eventData = {
    ...data,
    cost: data.cost ?? 0, // ← NEW FIELD with default
    createdAt: Timestamp.now(),
  }
  await setDoc(eventRef, eventData)
  return eventRef.id
}

// 3. Update tests
// src/__tests__/firebase/event-service.test.ts
it('creates event with cost field', async () => {
  const eventId = await createEvent({
    title: 'Dinner',
    cost: 25,
    // ...
  })
  const event = await getEvent(eventId)
  expect(event.cost).toBe(25)
})
```

## Security Rules Compliance

Firestore security rules enforce data access:

- **users/{userId}** – Only the user can read/write their own document
- **public_profiles/{userId}** – Anyone can read, only owner can write
- **events/{eventId}** – Participants can read/write, others cannot

Always:

- Never read/write from user context except own data
- Never bypass security rules with backend logic
- Test that rules are enforced in E2E tests

```tsx
// ✅ CORRECT - Reading own user data
const { userId } = useAuth()
const myProfile = await getDoc(doc(db, 'users', userId))

// ❌ WRONG - Attempting to read another user's private data
const otherUserData = await getDoc(doc(db, 'users', 'OTHER_ID'))
// ^ Blocked by security rules
```

## Query Optimization

Use composite indexes for complex queries. Check `firebase/firestore.indexes.json` for defined indexes.

```ts
// Simple query (no index needed)
query(collection(db, 'events'), where('status', '==', 'active'))

// Complex query (requires composite index)
query(
  collection(db, 'events'),
  where('status', '==', 'active'),
  where('createdAt', '>=', oneWeekAgo),
  orderBy('createdAt', 'desc')
)
```

## Offline Persistence

Firebase SDK includes offline persistence by default. Consider for critical data:

```ts
// Enable offline persistence for chat
enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open
  } else if (err.code === 'unspecified') {
    // Error enabling persistence
  }
})
```

## Common Error Scenarios

| Error              | Cause                          | Fix                                |
| ------------------ | ------------------------------ | ---------------------------------- |
| Permission denied  | Security rules blocking access | Check rules match user context     |
| Document not found | Reading non-existent data      | Handle null case                   |
| Network error      | Offline or connection issue    | Retry with exponential backoff     |
| Quota exceeded     | Too many reads/writes          | Review query patterns, use caching |

## Best Practices Checklist

- [ ] Uses centralized helper functions from `src/lib/firebase/`
- [ ] Batches writes where multiple documents change together
- [ ] Caches reads locally instead of continuous listeners
- [ ] Respects Firestore security rules
- [ ] Matches schema exactly (no speculative fields)
- [ ] Tests Firestore interactions in `src/__tests__/firebase/`
- [ ] Handles errors gracefully (network, permissions, missing data)
- [ ] Uses composite indexes for complex queries
