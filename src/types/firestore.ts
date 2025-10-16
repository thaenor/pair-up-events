import { Timestamp } from 'firebase/firestore';

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export const EVENT_STATUS = {
  PENDING: 'pending',
  LIVE: 'live', 
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const EVENT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  FRIENDS: 'friends'
} as const;

export const DUO_TYPE = {
  FRIENDS: 'friends',
  COUPLES: 'couples',
  FAMILY: 'family',
  ROOMMATES: 'roommates',
  COLLEAGUES: 'colleagues'
} as const;

export const CONNECTION_INTENTION = {
  FRIENDS: 'friends',
  EXPERIENCE: 'experience',
  NETWORKING: 'networking',
  ROMANTIC: 'romantic',
  CURIOUS: 'curious'
} as const;

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  NON_BINARY: 'non-binary',
  PREFER_NOT_TO_SAY: 'prefer-not-to-say'
} as const;

export const VIBES = {
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

export const NOTIFICATION_TYPE = {
  EVENT_INVITE: 'event_invite',
  JOIN_REQUEST: 'join_request',
  EVENT_CONFIRMED: 'event_confirmed',
  EVENT_REMINDER: 'event_reminder',
  CHAT_MESSAGE: 'chat_message',
  FEEDBACK_PROMPT: 'feedback_prompt',
  SYSTEM_UPDATE: 'system_update'
} as const;

export const REPORT_CATEGORY = {
  HARASSMENT: 'harassment',
  SPAM: 'spam',
  INAPPROPRIATE_CONTENT: 'inappropriate_content',
  FAKE_PROFILE: 'fake_profile',
  SAFETY_CONCERN: 'safety_concern',
  OTHER: 'other'
} as const;

export const REPORT_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
  DISMISSED: 'dismissed'
} as const;

export const MESSAGE_TYPE = {
  TEXT: 'text',
  SYSTEM: 'system',
  FEEDBACK_PROMPT: 'feedback_prompt'
} as const;

export const SYSTEM_MESSAGE_TYPE = {
  WELCOME: 'welcome',
  EVENT_COMPLETED: 'event_completed',
  ARCHIVE_PROMPT: 'archive_prompt'
} as const;

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
} as const;

export const COLOR_SCHEME = {
  DEFAULT: 'default',
  HIGH_CONTRAST: 'high_contrast',
  COLORBLIND_FRIENDLY: 'colorblind_friendly'
} as const;

export const LANGUAGE = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de'
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type EventStatus = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];
export type EventVisibility = typeof EVENT_VISIBILITY[keyof typeof EVENT_VISIBILITY];
export type DuoType = typeof DUO_TYPE[keyof typeof DUO_TYPE];
export type ConnectionIntention = typeof CONNECTION_INTENTION[keyof typeof CONNECTION_INTENTION];
export type Gender = typeof GENDER[keyof typeof GENDER];
export type Vibe = typeof VIBES[keyof typeof VIBES];
export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
export type ReportCategory = typeof REPORT_CATEGORY[keyof typeof REPORT_CATEGORY];
export type ReportStatus = typeof REPORT_STATUS[keyof typeof REPORT_STATUS];
export type MessageType = typeof MESSAGE_TYPE[keyof typeof MESSAGE_TYPE];
export type SystemMessageType = typeof SYSTEM_MESSAGE_TYPE[keyof typeof SYSTEM_MESSAGE_TYPE];
export type Theme = typeof THEME[keyof typeof THEME];
export type ColorScheme = typeof COLOR_SCHEME[keyof typeof COLOR_SCHEME];
export type Language = typeof LANGUAGE[keyof typeof LANGUAGE];

// ============================================================================
// USER TYPES
// ============================================================================

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: Language;
  theme: Theme;
  colorScheme: ColorScheme;
}

export interface UserPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  preferredGenders: Gender[];
  preferredVibes: Vibe[];
}

export interface UserProfile {
  // Core fields
  email: string;
  firstName: string;
  displayName: string;
  birthDate: string;
  gender: Gender;
  photoUrl?: string;
  createdAt: Timestamp;
  
  // Settings and preferences
  settings: UserSettings;
  preferences: UserPreferences;
  
  // Optional profile fields
  funFact?: string;
  likes?: string;
  dislikes?: string;
  hobbies?: string;
}

export interface PublicProfile {
  firstName: string;
  displayName: string;
  photoUrl?: string;
  city?: string;
  bio?: string;
  handles?: Record<string, string>;
  age: number;
  gender: Gender;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface EventLocation {
  address: string;
  city: string;
  country: string;
  geoPoint: {
    latitude: number;
    longitude: number;
  };
  geohash: string;
}

export interface EventPairs {
  pair1: {
    userA: string;
    userB: string;
  };
  pair2: {
    userC: string;
    userD: string;
  };
}

export interface EventPreferences {
  duoType: DuoType;
  preferredAgeRange: {
    min: number;
    max: number;
  };
  preferredGender: Gender[];
  desiredVibes: Vibe[];
  relationshipType: string;
  comfortableLanguages: string[];
  duoVibe: Vibe[];
  connectionIntention: ConnectionIntention;
}

export interface EventCounts {
  confirmed: number;
  applicants: number;
  messages: number;
}

export interface ChatSummary {
  lastMessage: string;
  lastMessageAt: Timestamp;
  unreadCount: Record<string, number>;
  messageCount: number;
  isActive: boolean;
}

export interface Event {
  // Core event fields
  title: string;
  description: string;
  creatorId: string;
  status: EventStatus;
  visibility: EventVisibility;
  timeStart: Timestamp;
  timeEnd?: Timestamp;
  location: EventLocation;
  tags: string[];
  capacity: 4; // Fixed at 4 for 2-meets-2 model
  pairs: EventPairs;
  preferences: EventPreferences;
  counts: EventCounts;
  coverThumbUrl?: string;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivityAt: Timestamp;
  
  // Chat management
  chatCreated: boolean;
  chatArchived: boolean;
  chatSummary?: ChatSummary;
}

// ============================================================================
// EVENT LISTING TYPES (Projection Collections)
// ============================================================================

export interface EventListing {
  title: string;
  city: string;
  timeStart: Timestamp;
  visibility: EventVisibility;
  confirmedCount: number;
  creatorSnap: {
    displayName: string;
    photoUrl?: string;
  };
  coverThumbUrl?: string;
  tags: string[];
  lastActivityAt: Timestamp;
}

export interface EventGeo {
  lat: number;
  lng: number;
  geohash: string;
  timeStart: Timestamp;
  visibility: EventVisibility;
}

export interface AutocompleteEvent {
  token: string;
  topResults: Array<{
    eventId: string;
    title: string;
    city: string;
  }>;
  updatedAt: Timestamp;
}

// ============================================================================
// MEMBERSHIP TYPES
// ============================================================================

export interface EventMembership {
  eventId: string;
  role: 'creator' | 'pair_member' | 'invited';
  status: 'confirmed' | 'pending' | 'declined';
  pairRole: 'userA' | 'userB' | 'userC' | 'userD';
  joinedAt: Timestamp;
  lastMessageAt?: Timestamp;
  lastSeenMessageAt?: Timestamp;
  eventSnap: {
    title: string;
    timeStart: Timestamp;
    city: string;
    coverThumbUrl?: string;
    status: EventStatus;
  };
}

// ============================================================================
// JOIN REQUEST TYPES
// ============================================================================

export interface JoinRequest {
  requestingPair: {
    userC: string;
    userD: string;
  };
  status: 'pending' | 'approved' | 'declined';
  requestedAt: Timestamp;
  respondedAt?: Timestamp;
  respondedBy?: string;
  message?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface NotificationSummary {
  unreadCount: number;
  lastBatchId: string;
  lastReadAt: Timestamp;
  lastNotificationAt: Timestamp;
}

export interface Notification {
  type: NotificationType;
  title: string;
  message: string;
  eventId?: string;
  senderId?: string;
  read: boolean;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

export interface SystemMessage {
  type: SystemMessageType;
  data: Record<string, unknown>;
}

export interface ChatMessage {
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: Timestamp;
  editedAt?: Timestamp;
  systemMessage?: SystemMessage;
  readBy: Record<string, Timestamp>;
}

// ============================================================================
// REPORT TYPES
// ============================================================================

export interface UserReport {
  reporterId: string;
  targetType: 'event' | 'user';
  targetId: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  resolution?: string;
  context?: Record<string, unknown>;
}

// ============================================================================
// SYSTEM TYPES
// ============================================================================

export interface FeatureFlag {
  enabled: boolean;
  rolloutPercent: number;
}

export interface AuditLog {
  actorId: string;
  action: string;
  target: {
    type: string;
    id: string;
  };
  meta: Record<string, unknown>;
  createdAt: Timestamp;
}

// ============================================================================
// DEVICE TYPES
// ============================================================================

export interface Device {
  token: string;
  platform: 'web' | 'ios' | 'android';
  userAgent?: string;
  createdAt: Timestamp;
  lastUsedAt: Timestamp;
}

// ============================================================================
// COLLECTION DOCUMENT TYPES
// ============================================================================

// Main collections
export type UserDocument = UserProfile;
export type PublicProfileDocument = PublicProfile;
export type EventDocument = Event;
export type EventListingDocument = EventListing;
export type EventGeoDocument = EventGeo;
export type AutocompleteEventDocument = AutocompleteEvent;
export type UserReportDocument = UserReport;
export type AuditLogDocument = AuditLog;

// Subcollections
export type MembershipDocument = EventMembership;
export type JoinRequestDocument = JoinRequest;
export type NotificationDocument = Notification;
export type ChatMessageDocument = ChatMessage;
export type DeviceDocument = Device;

// System collections
export type FeatureFlagDocument = FeatureFlag;

// ============================================================================
// UPDATE TYPES
// ============================================================================

export type UserProfileUpdate = Partial<Omit<UserProfile, 'email' | 'createdAt'>>;
export type PublicProfileUpdate = Partial<PublicProfile>;
export type EventUpdate = Partial<Omit<Event, 'creatorId' | 'createdAt'>>;
export type NotificationUpdate = Partial<Omit<Notification, 'createdAt'>>;
export type ChatMessageUpdate = Partial<Omit<ChatMessage, 'senderId' | 'createdAt'>>;

// ============================================================================
// QUERY TYPES
// ============================================================================

export interface EventQuery {
  city?: string;
  tags?: string[];
  timeStart?: {
    from?: Timestamp;
    to?: Timestamp;
  };
  visibility?: EventVisibility;
  status?: EventStatus;
  limit?: number;
  orderBy?: 'timeStart' | 'lastActivityAt' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface NotificationQuery {
  userId: string;
  type?: NotificationType;
  read?: boolean;
  limit?: number;
  orderBy?: 'createdAt';
  orderDirection?: 'desc';
}

export interface ChatMessageQuery {
  eventId: string;
  shardId?: string;
  limit?: number;
  orderBy?: 'createdAt';
  orderDirection?: 'desc';
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EventValidationResult extends ValidationResult {
  capacityValid: boolean;
  pairsValid: boolean;
  preferencesValid: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type WithId<T> = T & { id: string };
export type WithTimestamp<T> = T & { createdAt: Timestamp; updatedAt: Timestamp };
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ============================================================================
// BRAND THEMING TYPES
// ============================================================================

export interface BrandColors {
  primary_create: string;
  primary_join: string;
  background: string;
  accent_dark: string;
  success: string;
  error: string;
}

export const BRAND_COLORS: BrandColors = {
  primary_create: '#27E9F3',
  primary_join: '#FECC08',
  background: '#F5E6C8',
  accent_dark: '#1A2A33',
  success: '#16A34A',
  error: '#DC2626'
} as const;
