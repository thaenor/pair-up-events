# 🔥 TypeScript Types for PairUp Events

This directory contains comprehensive TypeScript types that match the updated Firestore data model for the PairUp Events application.

## 📁 File Structure

```
src/types/
├── firestore.ts      # Core Firestore types and enums
├── validation.ts     # Validation functions and types
├── helpers.ts        # Helper functions and utilities
├── services.ts       # Service layer interfaces
├── user-profile.ts   # Legacy user profile types (backward compatibility)
├── index.ts          # Main exports
└── README.md         # This file
```

## 🚀 Quick Start

```typescript
import {
  UserProfile,
  Event,
  EventStatus,
  validateUserProfile,
  validateEvent,
  isEventLive,
  canUserJoinEvent
} from '@/types';
```

## 📋 Core Types

### User Types
- `UserProfile` - Private user profile data
- `PublicProfile` - Public user profile data
- `UserSettings` - User preferences and settings
- `UserPreferences` - Matching preferences

### Event Types
- `Event` - Main event document with pair-based constraints
- `EventListing` - Lightweight projection for discovery
- `EventGeo` - Spatial projection for location queries
- `EventPairs` - Pair structure (User A+B, User C+D)
- `EventPreferences` - Event matching criteria

### Communication Types
- `Notification` - Structured notification system
- `ChatMessage` - Chat messages with sharding
- `SystemMessage` - System-generated messages

### System Types
- `UserReport` - User-generated reports
- `EventMembership` - User-event relationships
- `JoinRequest` - Pair join requests

## 🎯 Key Features

### 1. **Pair-Based Event Model**
```typescript
interface Event {
  capacity: 4; // Fixed at 4 (2 pairs of 2)
  pairs: {
    pair1: { userA: string; userB: string };
    pair2: { userC: string; userD: string };
  };
  status: 'pending' | 'live' | 'confirmed' | 'completed' | 'cancelled';
}
```

### 2. **Comprehensive Validation**
```typescript
import { validateEvent, validateUserProfile } from '@/types';

const eventValidation = validateEvent(eventData);
if (!eventValidation.isValid) {
  console.error('Validation errors:', eventValidation.errors);
}
```

### 3. **Helper Functions**
```typescript
import { isUserInEvent, canUserJoinEvent, getPairMembers } from '@/types';

// Check if user can join an event
if (canUserJoinEvent(userId, event)) {
  // Allow join
}

// Get other users in the same pair
const pairMembers = getPairMembers(userId, event);
```

### 4. **Type Guards**
```typescript
import { isEventLive, isEventConfirmed } from '@/types';

if (isEventLive(event)) {
  // Event is live and accepting join requests
}
```

## 🔧 Enums and Constants

### Event Status
```typescript
const EVENT_STATUS = {
  PENDING: 'pending',     // User A created, waiting for User B
  LIVE: 'live',          // A+B confirmed, visible to C+D
  CONFIRMED: 'confirmed', // A+B+C+D all confirmed
  COMPLETED: 'completed', // Event finished
  CANCELLED: 'cancelled'  // Event cancelled
} as const;
```

### User Vibes
```typescript
const VIBES = {
  ADVENTUROUS: 'adventurous',
  CHILL: 'chill',
  FUNNY: 'funny',
  CURIOUS: 'curious',
  OUTGOING: 'outgoing',
  CREATIVE: 'creative',
  FOODIES: 'foodies',
  ACTIVE: 'active',
  CULTURE: 'culture',
  FAMILY_FRIENDLY: 'family-friendly',
  ORGANIZERS: 'organizers',
  NIGHTLIFE: 'nightlife',
  MINDFUL: 'mindful'
} as const;
```

### Notification Types
```typescript
const NOTIFICATION_TYPE = {
  EVENT_INVITE: 'event_invite',
  JOIN_REQUEST: 'join_request',
  EVENT_CONFIRMED: 'event_confirmed',
  EVENT_REMINDER: 'event_reminder',
  CHAT_MESSAGE: 'chat_message',
  FEEDBACK_PROMPT: 'feedback_prompt',
  SYSTEM_UPDATE: 'system_update'
} as const;
```

## 🛡️ Validation

### User Profile Validation
```typescript
import { validateUserProfile } from '@/types';

const profile = {
  firstName: 'John',
  displayName: 'John Doe',
  email: 'john@example.com',
  birthDate: '1990-01-01',
  gender: 'male'
};

const result = validateUserProfile(profile);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

### Event Validation
```typescript
import { validateEvent } from '@/types';

const event = {
  title: 'Coffee Meetup',
  description: 'Let\'s grab coffee and chat!',
  capacity: 4,
  pairs: {
    pair1: { userA: 'user1', userB: 'user2' },
    pair2: { userC: 'user3', userD: 'user4' }
  }
};

const result = validateEvent(event);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
  console.log('Capacity valid:', result.capacityValid);
  console.log('Pairs valid:', result.pairsValid);
}
```

## 🔍 Query Types

### Event Queries
```typescript
import { EventQuery } from '@/types';

const query: EventQuery = {
  city: 'San Francisco',
  tags: ['coffee', 'social'],
  timeStart: {
    from: Timestamp.fromDate(new Date()),
    to: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  },
  visibility: 'public',
  limit: 20,
  orderBy: 'timeStart',
  orderDirection: 'asc'
};
```

### Notification Queries
```typescript
import { NotificationQuery } from '@/types';

const query: NotificationQuery = {
  userId: 'user123',
  type: 'event_invite',
  read: false,
  limit: 10,
  orderBy: 'createdAt',
  orderDirection: 'desc'
};
```

## 🏗️ Service Layer Types

### Firestore Service
```typescript
import { FirestoreService } from '@/types';

class FirestoreServiceImpl implements FirestoreService {
  async createEvent(eventData: Omit<Event, 'createdAt' | 'updatedAt'>): Promise<string> {
    // Implementation
  }
  
  async getUser(userId: string): Promise<UserProfile | null> {
    // Implementation
  }
  
  // ... other methods
}
```

### Validation Service
```typescript
import { ValidationService } from '@/types';

class ValidationServiceImpl implements ValidationService {
  validateUserProfile(profile: Partial<UserProfile>): ValidationResult {
    // Implementation
  }
  
  validateEvent(event: Partial<Event>): EventValidationResult {
    // Implementation
  }
  
  // ... other methods
}
```

## 🎨 Brand Theming

### Brand Colors
```typescript
import { BRAND_COLORS } from '@/types';

const colors = {
  primaryCreate: BRAND_COLORS.primary_create,  // #27E9F3
  primaryJoin: BRAND_COLORS.primary_join,      // #FECC08
  background: BRAND_COLORS.background,         // #F5E6C8
  accentDark: BRAND_COLORS.accent_dark,        // #1A2A33
  success: BRAND_COLORS.success,               // #16A34A
  error: BRAND_COLORS.error                    // #DC2626
};
```

### Theme Support
```typescript
import { Theme, ColorScheme } from '@/types';

const userSettings = {
  theme: 'light' as Theme,
  colorScheme: 'default' as ColorScheme,
  language: 'en' as Language
};
```

## 🔄 Migration from Legacy Types

### Before (Legacy)
```typescript
import { UserProfile } from '@/types/user-profile';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  // ... limited fields
}
```

### After (New)
```typescript
import { UserProfile } from '@/types';

interface UserProfile {
  email: string;
  firstName: string;        // New field
  displayName: string;
  birthDate: string;        // New field
  gender: Gender;          // New field with enum
  photoUrl?: string;       // New field
  settings: UserSettings;  // New structured settings
  preferences: UserPreferences; // New matching preferences
  // ... more fields
}
```

## 📊 Performance Optimizations

### Message Sharding
```typescript
import { generateShardId } from '@/types';

const shardId = generateShardId(Timestamp.now());
// Result: "2024-01-15" (daily shards)
```

### Notification Batching
```typescript
import { generateBatchId } from '@/types';

const batchId = generateBatchId(Timestamp.now());
// Result: "2024-01-15-14" (hourly batches)
```

## 🧪 Testing

### Type Testing
```typescript
import { isEventStatus, isEventVisibility } from '@/types';

// Type guards for runtime validation
if (isEventStatus(status)) {
  // status is now typed as EventStatus
}

if (isEventVisibility(visibility)) {
  // visibility is now typed as EventVisibility
}
```

### Validation Testing
```typescript
import { validateEventTitle, validateEventDescription } from '@/types';

describe('Event Validation', () => {
  it('should validate event title', () => {
    const result = validateEventTitle('Coffee Meetup');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  it('should reject empty event title', () => {
    const result = validateEventTitle('');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Event title is required');
  });
});
```

## 🚨 Important Notes

1. **Backward Compatibility**: Legacy types are maintained in `user-profile.ts`
2. **Validation**: All types include comprehensive validation functions
3. **Performance**: Types support Firebase optimizations (sharding, batching)
4. **Type Safety**: Full TypeScript support with strict typing
5. **Documentation**: All types are well-documented with JSDoc comments

## 📚 Additional Resources

- [Firebase Data Model Documentation](../Docs/data-model.md)
- [Firebase Optimization Analysis](../Docs/FIREBASE_OPTIMIZATION_ANALYSIS.md)
- [Design Document](../Docs/Design-doc.md)

## 🤝 Contributing

When adding new types:

1. Add the type to the appropriate file
2. Add validation functions if needed
3. Add helper functions for common operations
4. Update the index.ts exports
5. Add tests for validation functions
6. Update this README

## 📝 Changelog

### v2.0.0
- ✅ Complete rewrite to match updated data model
- ✅ Added pair-based event constraints
- ✅ Added comprehensive validation system
- ✅ Added helper functions and utilities
- ✅ Added service layer interfaces
- ✅ Added brand theming support
- ✅ Added performance optimizations
- ✅ Maintained backward compatibility
