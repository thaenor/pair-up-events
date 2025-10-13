# PairUp Events – Firestore Data Model

> Version: 1.0  
> Purpose: Provide a clear, maintainable, and cost-optimized Firestore data architecture for the PairUp Events app.

---

## 🔧 Overview

This model is designed for **low-cost, scalable Firebase usage**:
- Minimize document reads/writes.
- Favor projection collections (listings, geo) for cheap list views.
- Separate public vs private data for privacy and caching.
- Avoid fan-out updates by linking data through subcollections and snapshots.

---

## 🧱 Top-Level Collections

### `/users/{userId}`
**Private user profiles** — only visible to the authenticated user.

| Field | Type | Description |
|--------|------|-------------|
| `email` | string | User’s private email |
| `displayName` | string | User’s display name (from OAuth or custom) |
| `photoUrl` | string | Profile photo URL (from Firebase Auth) |
| `timezone` | string | Optional timezone |
| `createdAt` | Timestamp | Account creation date |
| `settings` | object | `{ emailNotifications: boolean, pushNotifications: boolean }` |
| `stats` | object | `{ eventsCreated: number, eventsJoined: number }` |

**Subcollections:**
- `/devices/{deviceId}` → stores push tokens and platform info.
- `/notifications/{notificationId}` → ephemeral alerts, TTL-enabled.
- `/memberships/{eventId}` → references to events the user created/joined.

---

### `/public_profiles/{userId}`
**Public-facing profile**, accessible by all users.

| Field | Type | Description |
|--------|------|-------------|
| `displayName` | string | Public name |
| `photoUrl` | string | Public photo |
| `city` | string | Optional city |
| `bio` | string | Optional bio or tagline |
| `handles` | object | Optional social handles |

---

### `/events/{eventId}`
**Main event documents** — source of truth.

| Field | Type | Description |
|--------|------|-------------|
| `title` | string | Event title |
| `description` | string | Full description |
| `creatorId` | string | UID of the creator |
| `visibility` | string | `"public" | "private" | "friends"` |
| `timeStart` | Timestamp | Start time |
| `timeEnd` | Timestamp | End time (optional) |
| `location` | object | `{ address, city, country, geoPoint, geohash }` |
| `tags` | string[] | Searchable labels |
| `capacity` | number | Max participants |
| `approvalRequired` | boolean | If true, joins need approval |
| `counts` | object | `{ confirmed, applicants, messages }` |
| `coverThumbUrl` | string | Small thumbnail for listings |
| `createdAt` | Timestamp | Creation time |
| `updatedAt` | Timestamp | Last update |
| `lastActivityAt` | Timestamp | Used for sorting listings |

**Subcollections:**
- `/participants/{userId}` → participant info and snapshot.
- `/messages/{messageId}` → chat messages.
- `/attachments/{attachmentId}` → uploaded images/files.
- `/activity/{activityId}` → logs (e.g., user joined, left, etc.).

---

### `/users/{userId}/memberships/{eventId}`
User–Event relationship documents.

| Field | Type | Description |
|--------|------|-------------|
| `eventId` | string | Event reference |
| `role` | string | `"organizer" | "participant" | "invited"` |
| `status` | string | `"confirmed" | "pending" | "declined"` |
| `joinedAt` | Timestamp | When user joined |
| `lastMessageAt` | Timestamp | Last message in event |
| `lastSeenMessageAt` | Timestamp | Last read timestamp |
| `eventSnap` | object | `{ title, timeStart, city, coverThumbUrl }` |

---

### `/events_listings/{eventId}`
**Lightweight projection** for public discovery feeds.

| Field | Type | Description |
|--------|------|-------------|
| `title` | string | Event title |
| `city` | string | Location summary |
| `timeStart` | Timestamp | For sorting |
| `visibility` | string | `"public" | "private"` |
| `confirmedCount` | number | Cached participant count |
| `creatorSnap` | object | `{ displayName, photoUrl }` |
| `coverThumbUrl` | string | Thumbnail |
| `tags` | string[] | Search keywords |
| `lastActivityAt` | Timestamp | Recent activity time |

> **Updated by Cloud Function** on event create/update.  
> Used for: home feed, search, “upcoming” lists.

---

### `/events_geo/{eventId}`
**Spatial projection** for geo-based queries.

| Field | Type | Description |
|--------|------|-------------|
| `lat` | number | Latitude |
| `lng` | number | Longitude |
| `geohash` | string | Precomputed hash for range queries |
| `timeStart` | Timestamp | For sorting/upcoming filter |
| `visibility` | string | Public/private flag |

> **Updated by Cloud Function** for nearby event lookups.

---

### `/autocomplete_events/{token}`
Autocomplete token store for title/tag search.

| Field | Type | Description |
|--------|------|-------------|
| `token` | string | Tokenized prefix |
| `topResults` | object[] | Array of `{ eventId, title, city }` |
| `updatedAt` | Timestamp | Last updated |

---

### `/system/{doc}`
Internal control and operations.

Examples:
- `/feature_flags/{flag}` → `{ enabled, rolloutPercent }`
- `/jobs/{name}` → last run checkpoints
- `/counters/{name}` → distributed counter shards

---

### `/audit_logs/{logId}`
Admin-only logs for moderation and analytics.

| Field | Type | Description |
|--------|------|-------------|
| `actorId` | string | Who performed the action |
| `action` | string | What was done |
| `target` | object | `{ type, id }` |
| `meta` | object | Extra metadata |
| `createdAt` | Timestamp | When it happened |

> **TTL rule** auto-deletes old logs for cost efficiency.

---

## ⚙️ Derived Data Flow

```mermaid
graph LR
  A[events] --> B[events_listings]
  A --> C[events_geo]
  A --> D[autocomplete_events]
  E[users] --> F[memberships]
  E --> G[public_profiles]
  A --> F
````

**All derived collections** (`listings`, `geo`, `autocomplete`) are written by **Cloud Functions**,
keeping client writes minimal and reads cheap.

---

## 💸 Cost Optimization Summary

| Feature       | Optimization                           |
| ------------- | -------------------------------------- |
| Event feed    | Small projection (`events_listings`)   |
| Nearby search | Minimal `events_geo` index             |
| My events     | Localized `memberships` subcollection  |
| Public search | Tokenized autocomplete cache           |
| Notifications | TTL-enabled subcollection              |
| Audits/logs   | TTL pruning and small doc size         |
| Writes        | Trigger-based projections (no fan-out) |

---

## 🔒 Access Control Summary

| Collection            | Read                   | Write                   |
| --------------------- | ---------------------- | ----------------------- |
| `users`               | Owner only             | Owner only              |
| `public_profiles`     | Public                 | Owner only              |
| `events`              | Public or participants | Organizer               |
| `events_listings`     | Public                 | Cloud Function only     |
| `events_geo`          | Public                 | Cloud Function only     |
| `autocomplete_events` | Public                 | Cloud Function only     |
| `memberships`         | Owner                  | Cloud Function / System |
| `system`              | Admin                  | Admin                   |
| `audit_logs`          | Admin                  | System only             |

