# PairUp Events – Firestore Data Model  
> Updated with Duo Feature  
> Version: 1.1  

---

## 🧱 Top-Level Collections

### `/users/{userId}`
**Private user profiles** — only visible to the authenticated user.  

| Field | Type | Description |
|--------|------|-------------|
| `email` | string | Private email |
| `displayName` | string | Display name (from OAuth or custom) |
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
| `coverThumbUrl` | string | Thumbnail for listings |
| `createdAt` | Timestamp | Creation time |
| `updatedAt` | Timestamp | Last update |
| `lastActivityAt` | Timestamp | Used for sorting listings |

**Subcollections:**  
- `/participants/{userId}` → participant info and snapshot.  
- `/messages/{messageId}` → chat messages.  
- `/attachments/{attachmentId}` → uploaded images/files.  
- `/activity/{activityId}` → event logs.

---

### `/duos/{duoId}`
**Represents a two-user partnership (duo).**

| Field | Type | Description |
|--------|------|-------------|
| `creatorId` | string | UID of the user who created the invite |
| `partnerId` | string or null | UID of the partner once accepted |
| `members` | string[] | Array of UIDs (1 or 2 members) |
| `status` | string | `"pending"` or `"approved"` |
| `token` | string | Optional unique token for invitation link |
| `createdAt` | Timestamp | When the invite was created |
| `acceptedAt` | Timestamp | When the partner accepted |

**Lifecycle:**  
1. User A creates a new doc with `status: "pending"`, `members: ["userA"]`.  
2. User B accepts the invite by updating the same document to include their UID and `status: "approved"`.  
3. Optional backend notification or push message informs User A.  

**Permissions:**  
- Only `members[]` users can read/write.  
- Clients never modify other users’ `/users/*` documents directly.  

---

### `/events_listings/{eventId}`
Lightweight projection for public discovery feeds.

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

> Updated by Cloud Function on event create/update.  
> Used for: home feed, search, “upcoming” lists.

---

### `/events_geo/{eventId}`
Spatial projection for geo-based queries.

| Field | Type | Description |
|--------|------|-------------|
| `lat` | number | Latitude |
| `lng` | number | Longitude |
| `geohash` | string | Precomputed hash for range queries |
| `timeStart` | Timestamp | For sorting/upcoming filter |
| `visibility` | string | Public/private flag |

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

> TTL rule auto-deletes old logs for cost efficiency.

---

## ⚙️ Duo Access & Lifecycle Summary

| Step | Action | Performed By | Effect |
|------|---------|--------------|---------|
| 1 | Create duo (pending) | User A | Writes new `/duos/{id}` with only A in members |
| 2 | Accept duo | User B | Updates same doc, adds self and sets status `"approved"` |
| 3 | Notify | Cloud Function or Client | Sends optional notification to A |
| 4 | Read | Either member | Real-time listener reflects current state |

---

## 💸 Cost Summary (Duo Flow)
| Operation | Document Writes | Notes |
|------------|----------------|-------|
| Create invite | 1 | `duos/{id}` created |
| Accept invite | 1 | Status update + partner added |
| Notification (optional) | 0–1 | Triggered by function |
| Read updates | Real-time | Both users subscribe to same doc |

---

**End of data-model.md v1.1 (with Duo feature)**
