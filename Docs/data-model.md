# PairUp Events – Firestore Data Model

> Version: 2.0  
> Purpose: Provide a clear, maintainable, and cost-optimized Firestore data architecture for the PairUp Events app that enforces the 2-meets-2 pair-based social model.

---

## 🔧 Overview

This model is designed for **low-cost, scalable Firebase usage** with **pair-based event constraints**:
- Minimize document reads/writes.
- Favor projection collections (listings, geo) for cheap list views.
- Separate public vs private data for privacy and caching.
- Avoid fan-out updates by linking data through subcollections and snapshots.
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
| `displayName` | string | User's display name (from OAuth or custom) |
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
| `displayName` | string | Public display name |
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
| `status` | string | `"pending" | "live" | "confirmed" | "completed" | "cancelled"` |
| `visibility` | string | `"public" | "private" | "friends"` |
| `timeStart` | Timestamp | Start time |
| `timeEnd` | Timestamp | End time (optional) |
| `location` | object | `{ address, city, country, geoPoint, geohash }` |
| `tags` | string[] | Searchable labels |
| `capacity` | number | **Fixed at 4** (2 pairs of 2) |
| `pairs` | object | `{ pair1: { userA: string, userB: string }, pair2: { userC: string, userD: string } }` |
| `preferences` | object | Event matching preferences (see Event Preferences below) |
| `counts` | object | `{ confirmed, applicants, messages }` |
| `coverThumbUrl` | string | Small thumbnail for listings |
| `createdAt` | Timestamp | Creation time |
| `updatedAt` | Timestamp | Last update |
| `lastActivityAt` | Timestamp | Used for sorting listings |
| `chatCreated` | boolean | Whether group chat has been created |
| `chatArchived` | boolean | Whether chat has been archived |

**Event Preferences Object:**
```json
{
  "duoType": "friends|couples|family|roommates|colleagues",
  "preferredAgeRange": { "min": number, "max": number },
  "preferredGender": string[],
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
- **Display Name** (public, stored in both `/users/{userId}` and `/public_profiles/{userId}`)
- **Birthdate** (private, stored in `/users/{userId}` only)
- **Gender** (public, stored in both `/users/{userId}` and `/public_profiles/{userId}`)
- **Password** (handled by Firebase Auth, not stored in Firestore)

### Data Privacy Strategy
- **Private Data** (`/users/{userId}`): Email, birthdate, settings, preferences, stats
- **Public Data** (`/public_profiles/{userId}`): First name, display name, photo, bio, city, age, gender
- **Age Verification**: Birthdate is used to ensure users are at least 13 years old
- **First Name**: Serves as the primary public identifier across the platform

### Validation Rules
- **First Name**: 2-50 characters, letters/spaces/hyphens/apostrophes/periods only
- **Display Name**: 2-50 characters, letters/spaces/hyphens/apostrophes/periods only
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
  E -.->|displayName| G
````

**All derived collections** (`listings`, `geo`, `autocomplete`) are written by **Cloud Functions**,
keeping client writes minimal and reads cheap.

---

## 🎨 Brand Theming & User Preferences

### User Theme Preferences
Users can customize their experience with brand-aligned theming:

| Setting | Options | Default |
|---------|---------|---------|
| `theme` | `"light" | "dark" | "auto"` | `"light"` |
| `colorScheme` | `"default" | "high_contrast" | "colorblind_friendly"` | `"default"` |
| `language` | `"en" | "es" | "fr" | "de"` | `"en"` |

### Brand Color Tokens (from Design Doc)
```json
{
  "primary_create": "#27E9F3",
  "primary_join": "#FECC08", 
  "background": "#F5E6C8",
  "accent_dark": "#1A2A33",
  "success": "#16A34A",
  "error": "#DC2626"
}
```

---

## 💸 Cost Optimization Summary

| Feature       | Optimization                           | Cost Impact |
| ------------- | -------------------------------------- | ----------- |
| Event feed    | Small projection (`events_listings`)   | ✅ Low cost |
| Nearby search | Minimal `events_geo` index             | ✅ Low cost |
| My events     | Localized `memberships` subcollection  | ✅ Low cost |
| Public search | Tokenized autocomplete cache           | ✅ Low cost |
| Notifications | **Batched notifications + summary**    | ⚠️ **-40% cost** |
| Chat messages | **Sharded messages + summary**         | ⚠️ **-50% cost** |
| User reports  | TTL pruning and small doc size         | ✅ Low cost |
| Audits/logs   | TTL pruning and small doc size         | ✅ Low cost |
| Writes        | Trigger-based projections (no fan-out) | ✅ Low cost |
| Account creation | Single write to `/users`, optional `/public_profiles` | ✅ Low cost |
| Pair validation | Client-side validation before writes   | ✅ Low cost |

### **Estimated Monthly Costs (10K DAU)**
- **Before Optimization**: ~$153/month
- **After Optimization**: ~$92/month (**40% reduction**)

### **Key Optimizations Applied**
1. **Message Sharding**: Prevents hot-spotting, reduces read costs
2. **Notification Batching**: Groups notifications to reduce read operations
3. **Summary Fields**: Cache frequently accessed data in parent documents
4. **Composite Indexes**: Enable efficient queries without full collection scans
5. **TTL Policies**: Auto-cleanup of old data to reduce storage costs

---

## 🔒 Access Control Summary

| Collection            | Read                   | Write                   |
| --------------------- | ---------------------- | ----------------------- |
| `users`               | Owner only             | Owner only              |
| `public_profiles`     | Public                 | Owner only              |
| `events`              | Public or participants | Creator only            |
| `events_listings`     | Public                 | Cloud Function only     |
| `events_geo`          | Public                 | Cloud Function only     |
| `autocomplete_events` | Public                 | Cloud Function only     |
| `memberships`         | Owner                  | Cloud Function / System |
| `join_requests`       | Event participants     | Any user (for requests) |
| `notifications`       | Owner only             | System only             |
| `messages`            | Event participants     | Event participants      |
| `user_reports`        | Reporter + Admin       | Any user (for reports)  |
| `system`              | Admin                  | Admin                   |
| `audit_logs`          | Admin                  | System only             |

---

## 📊 **Required Composite Indexes**

**Critical**: These indexes must be created before deployment to prevent query failures.

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

---

## 🚨 Business Rules & Validation

### Pair-Based Event Constraints
1. **Fixed Capacity**: All events must have exactly 4 participants (2 pairs of 2)
2. **Pair Formation**: Users must join as pairs, not individuals
3. **State Progression**: Events must follow: `pending` → `live` → `confirmed`
4. **Chat Creation**: Group chats are automatically created when event reaches `confirmed` status
5. **Join Requests**: Only one pair can join a live event (first approved request wins)

### Event State Transitions
```
pending (User A created, waiting for User B)
    ↓ (User B accepts)
live (A+B confirmed, visible to C+D)
    ↓ (User C+D join request approved)
confirmed (A+B+C+D all confirmed, chat created)
    ↓ (Event date passes)
completed (Event finished, feedback prompts sent)
```

### Data Validation Rules
- **Event Capacity**: Must always be 4
- **Pair Structure**: Must have exactly 2 pairs with 2 users each
- **Age Verification**: Users must be 13+ years old
- **Event Preferences**: All preference fields must be valid enum values
- **Chat Lifecycle**: Chats auto-archive after 30 days of inactivity

---

## 📋 Summary of Changes (v2.0)

### ✅ **Major Updates to Align with Design Document**

1. **Pair-Based Event Model**
   - Fixed event capacity to exactly 4 participants (2 pairs of 2)
   - Added `pairs` object to track User A+B and User C+D
   - Added `join_requests` subcollection for pair-based joining

2. **Event State Management**
   - Added `status` field: `pending` → `live` → `confirmed` → `completed`
   - Added `chatCreated` and `chatArchived` flags
   - Defined clear state transition rules

3. **Event Creation Preferences**
   - Added comprehensive `preferences` object with all design doc requirements
   - Includes duo types, age ranges, vibes, languages, connection intentions
   - Supports the detailed event creation flow from design doc

4. **User Profile Updates**
   - Added `firstName` field (matches design doc requirement)
   - Added `photoUrl` to private profile
   - Added `preferences` object for user matching criteria
   - Updated public profile with age and gender for matching

5. **Structured Notification System**
   - Added typed notifications: `event_invite`, `join_request`, `event_confirmed`, etc.
   - Added TTL and action URLs for better UX
   - Supports all notification types from design doc

6. **Chat System Lifecycle**
   - Added automatic chat creation when events are confirmed
   - Added system messages for welcome, feedback prompts, archiving
   - Added read tracking and auto-archiving after 30 days

7. **User Reporting System**
   - Added `/user_reports` collection with categories
   - Supports reporting events and users with admin workflow
   - Includes context and resolution tracking

8. **Brand Theming Support**
   - Added theme preferences (light/dark/auto)
   - Added accessibility options (high contrast, colorblind friendly)
   - Included brand color tokens from design doc

### 🔄 **Backward Compatibility**
- All existing fields maintained where possible
- New fields are optional to support gradual migration
- Cloud Functions handle data migration and validation

### 🚀 **Implementation Priority**
1. **High Priority**: Event state management, pair constraints, join requests
2. **Medium Priority**: Chat lifecycle, notifications, user preferences  
3. **Low Priority**: Brand theming, advanced reporting features

---

## ⚠️ **Critical Implementation Notes**

### **🚨 Must Implement Before Production**

1. **Composite Indexes**: Create all required indexes in Firebase Console before deployment
2. **Message Sharding**: Implement daily sharding for chat messages to prevent hot-spotting
3. **Notification Batching**: Group notifications in batches of 50-100 for cost optimization
4. **Security Rules**: Implement optimized security rules using membership checks
5. **TTL Policies**: Set up automatic cleanup for notifications, audit logs, and old messages

### **📊 Performance Monitoring Setup**
- Monitor read/write costs daily
- Set up alerts for costs >$150/month
- Track query performance and slow queries
- Monitor index usage and remove unused indexes

### **🔄 Migration Strategy**
1. **Phase 1**: Deploy with new structure, maintain backward compatibility
2. **Phase 2**: Migrate existing data using Cloud Functions
3. **Phase 3**: Remove deprecated fields after migration complete

### **💰 Cost Control Measures**
- Implement client-side caching for frequently accessed data
- Use pagination for all list queries
- Batch operations where possible
- Monitor and optimize based on real usage patterns

