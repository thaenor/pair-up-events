# PairUp Events – Firestore Data Model

> Version: 2.0  
> Purpose: Firestore data architecture for the PairUp Events app that enforces the 2-meets-2 pair-based social model.

---

## 🔧 Overview

This model enforces **pair-based event constraints**:
- **Enforce 2-meets-2 model**: All events must have exactly 4 participants (2 pairs of 2).
- **State-driven event lifecycle**: Events progress through pending → live → confirmed states.

---

## 🧱 Top-Level Collections

### `/users/{userId}`
**Private user profiles** — only visible to the authenticated user.

| Field | Type | Description |
|--------|------|-------------|
| `email` | string | User's private email |
| `firstName` | string | User's first name (public identifier) |
| `birthDate` | string | User's birthdate (private, used for age verification) |
| `gender` | string | User's gender identity (male, female, non-binary, prefer-not-to-say) |
| `photoUrl` | string | User's profile photo URL (private) |
| `createdAt` | Timestamp | Account creation date |
| `settings` | object | `{ emailNotifications: boolean, pushNotifications: boolean, language: string, theme: string }` |
| `funFact` | string | Optional fun fact about the user |
| `likes` | string | Optional list of things the user likes |
| `dislikes` | string | Optional list of things the user dislikes |
| `hobbies` | string | Optional list of user's hobbies |
| `preferences` | object | `{ ageRange: { min: number, max: number }, preferredGenders: string[], preferredVibes: string[] }` |

**Subcollections:**
- `/devices/{deviceId}` → stores push tokens and platform info.
- `/notifications/{notificationId}` → structured notifications (see Notification System below).
- `/memberships/{eventId}` → references to events the user created/joined.

---

### `/public_profiles/{userId}`
**Public-facing profile**, accessible by all users.

| Field | Type | Description |
|--------|------|-------------|
| `firstName` | string | Public first name |
| `photoUrl` | string | Public photo |
| `city` | string | Optional city |
| `bio` | string | Optional bio or tagline |
| `handles` | object | Optional social handles |
| `age` | number | Calculated age from birthDate (for matching) |
| `gender` | string | Public gender (for matching) |

---

### `/events/{eventId}`
**Main event documents** — source of truth. **Enforces 2-meets-2 model (exactly 4 participants)**.

| Field | Type | Description |
|--------|------|-------------|
| `title` | string | Event title |
| `description` | string | Full description |
| `creatorId` | string | UID of the creator (User A) |
| `status` | string | "pending" | "live" | "confirmed" | "completed" | "cancelled"` |
| `visibility` | string | `"public" | "private" |
| `timeStart` | Timestamp | Start time |
| `timeEnd` | Timestamp | End time (optional) |
| `location` | object | `{ address, city, country, geoPoint, geohash }` |
| `tags` | string[] | Searchable labels |
| `pairs` | object[] | `[ pair1: { userA: string, userB: string }, pair2: { userC: string, userD: string } ]` |
| `preferences` | object | Event matching preferences (see Event Preferences below) |
| `counts` | object | `{ confirmed, applicants, messages }` |
| `coverThumbUrl` | string | Small thumbnail for listings |
| `createdAt` | Timestamp | Creation time |
| `updatedAt` | Timestamp | Last update |
| `lastActivityAt` | Timestamp | Used for sorting listings |
| `chatCreated` | boolean | Whether group chat has been created |

**Event Preferences Object:**
```json
{
  "duoType": "friends|couples|family|roommates|colleagues",
  "preferredAgeRange": { "min": number, "max": number },
  "preferredGender": string[], //male, female, non-binary, prefer-not-to-say
  "desiredVibes": string[], // From design doc: adventurous, chill, funny, curious, outgoing, creative, foodies, active, culture, family-friendly, organizers, nightlife, mindful
  "relationshipType": string,
  "comfortableLanguages": string[],
  "duoVibe": string[],
  "connectionIntention": "friends|experience|networking|romantic|curious"
}
```

**Subcollections:**
- `/participants/{userId}` → participant info and snapshot.
- `/messages/{messageId}` → chat messages.
- `/attachments/{attachmentId}` → uploaded images/files.
- `/activity/{activityId}` → logs (e.g., user joined, left, etc.).
- `/join_requests/{requestId}` → pending join requests from other pairs.

---

### `/events/{eventId}/join_requests/{requestId}`
**Join requests from pairs wanting to join live events.**

| Field | Type | Description |
|--------|------|-------------|
| `requestingPair` | object | `{ userC: string, userD: string }` |
| `status` | string | `"pending" | "approved" | "declined"` |
| `requestedAt` | Timestamp | When request was made |
| `respondedAt` | Timestamp | When A+B responded |
| `respondedBy` | string | User ID who responded |
| `message` | string | Optional message from requesting pair |

---

### `/users/{userId}/memberships/{eventId}`
User–Event relationship documents.

| Field | Type | Description |
|--------|------|-------------|
| `eventId` | string | Event reference |
| `role` | string | `"creator" | "pair_member" | "invited"` |
| `status` | string | `"confirmed" | "pending" | "declined"` |
| `pairRole` | string | `"userA" | "userB" | "userC" | "userD"` |
| `joinedAt` | Timestamp | When user joined |
| `lastMessageAt` | Timestamp | Last message in event |
| `lastSeenMessageAt` | Timestamp | Last read timestamp |
| `eventSnap` | object | `{ title, timeStart, city, coverThumbUrl, status }` |

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
| `creatorSnap` | object | `{ firstName, photoUrl }` |
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

### `/users/{userId}/notifications/{batchId}/{notificationId}`
**Structured notification system** with batching for cost optimization.

**Batching Strategy**: Group notifications in batches of 50-100 for reduced read costs.

| Field | Type | Description |
|--------|------|-------------|
| `type` | string | `"event_invite" | "join_request" | "event_confirmed" | "event_reminder" | "chat_message" | "feedback_prompt" | "system_update"` |
| `title` | string | Notification title |
| `message` | string | Notification body |
| `eventId` | string | Related event (if applicable) |
| `senderId` | string | User who triggered notification |
| `read` | boolean | Whether user has read this notification |
| `createdAt` | Timestamp | When notification was created |
| `expiresAt` | Timestamp | TTL for auto-cleanup |
| `actionUrl` | string | Deep link to relevant page |
| `metadata` | object | Additional context data |

**Notification Summary (Added to users collection for performance):**
```json
{
  "notificationSummary": {
    "unreadCount": number,
    "lastBatchId": string,
    "lastReadAt": timestamp,
    "lastNotificationAt": timestamp
  }
}
```

---

### `/events/{eventId}/messages/{shardId}/{messageId}`
**Chat messages** with lifecycle management and sharding for scalability.

**Sharding Strategy**: `shardId = Math.floor(timestamp / (24 * 60 * 60 * 1000))` (daily shards)

| Field | Type | Description |
|--------|------|-------------|
| `senderId` | string | User who sent the message |
| `content` | string | Message text content |
| `type` | string | `"text" | "system" | "feedback_prompt"` |
| `createdAt` | Timestamp | When message was sent |
| `editedAt` | Timestamp | Last edit time (if applicable) |
| `systemMessage` | object | For system messages: `{ type: "welcome" | "event_completed" | "archive_prompt", data: object }` |
| `readBy` | object | `{ userId: timestamp }` - when each user read this message |

**Chat Summary (Added to events collection for performance):**
```json
{
  "chatSummary": {
    "lastMessage": "string",
    "lastMessageAt": "timestamp",
    "unreadCount": { "userId": number },
    "messageCount": number,
    "isActive": boolean
  }
}
```

**Chat Lifecycle Rules:**
- Chat created automatically when event status becomes "confirmed"
- System welcome message sent when chat is created
- After event completion, system prompts for feedback and archiving
- Chats auto-archive after 30 days of inactivity
- Archived chats can be reopened by any participant

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

### `/user_reports/{reportId}`
**User-generated reports** for events and users.

| Field | Type | Description |
|--------|------|-------------|
| `reporterId` | string | User who made the report |
| `targetType` | string | `"event" | "user"` |
| `targetId` | string | ID of reported event or user |
| `category` | string | `"harassment" | "spam" | "inappropriate_content" | "fake_profile" | "safety_concern" | "other"` |
| `description` | string | User's description of the issue |
| `status` | string | `"pending" | "reviewed" | "resolved" | "dismissed"` |
| `createdAt` | Timestamp | When report was submitted |
| `reviewedAt` | Timestamp | When admin reviewed |
| `reviewedBy` | string | Admin who reviewed |
| `resolution` | string | Admin's resolution notes |
| `context` | object | Additional context (event details, chat messages, etc.) |

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

## 👤 Account Creation & Data Privacy

### Required Fields During Registration
During account creation, users must provide:
- **Email** (private, stored in `/users/{userId}`)
- **First Name** (public, stored in both `/users/{userId}` and `/public_profiles/{userId}`)
- **Birthdate** (private, stored in `/users/{userId}` only)
- **Gender** (public, stored in both `/users/{userId}` and `/public_profiles/{userId}`)
- **Password** (handled by Firebase Auth, not stored in Firestore)

### Data Privacy Strategy
- **Private Data** (`/users/{userId}`): Email, birthdate, settings, preferences, stats
- **Public Data** (`/public_profiles/{userId}`): First name, photo, bio, city, age, gender
- **Age Verification**: Birthdate is used to ensure users are at least 13 years old
- **First Name**: Serves as the primary public identifier across the platform

### Validation Rules
- **First Name**: 2-50 characters, letters/spaces/hyphens/apostrophes/periods only
- **Birthdate**: Must be at least 13 years old, maximum 120 years old
- **Email**: Standard email validation with fake/disposable domain filtering
- **Gender**: Must be one of: male, female, non-binary, prefer-not-to-say

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
  E -.->|firstName| G
````

**All derived collections** (`listings`, `geo`, `autocomplete`) are written by **Cloud Functions**.

---

## 📊 **Required Composite Indexes**

### **events_listings Collection**
```javascript
// For city-based event discovery
- city (Ascending) + timeStart (Ascending) + visibility (Ascending)

// For tag-based search
- tags (Arrays) + timeStart (Ascending) + visibility (Ascending)

// For activity-based sorting
- lastActivityAt (Descending) + visibility (Ascending)

// For upcoming events
- timeStart (Ascending) + visibility (Ascending) + confirmedCount (Ascending)
```

### **events_geo Collection**
```javascript
// For nearby event queries
- geohash (Ascending) + timeStart (Ascending) + visibility (Ascending)

// For location-based upcoming events
- lat (Ascending) + lng (Ascending) + timeStart (Ascending)
```

### **user_reports Collection**
```javascript
// For admin moderation queue
- status (Ascending) + createdAt (Descending)

// For report analytics
- targetType (Ascending) + status (Ascending) + createdAt (Descending)
```

### **notifications Collection**
```javascript
// For user notification feeds
- userId (Ascending) + read (Ascending) + createdAt (Descending)

// For notification type filtering
- userId (Ascending) + type (Ascending) + createdAt (Descending)
```

### **events Collection**
```javascript
// For user's created events
- creatorId (Ascending) + status (Ascending) + createdAt (Descending)

// For event status queries
- status (Ascending) + timeStart (Ascending) + visibility (Ascending)
```
