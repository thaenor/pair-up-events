import type {
  UserProfile,
  PublicProfile,
  Event,
  EventListing,
  EventGeo,
  Notification,
  ChatMessage,
  UserReport,
  EventMembership,
  JoinRequest,
  EventQuery,
  NotificationQuery,
  ChatMessageQuery,
  ValidationResult,
  EventValidationResult
} from './firestore';

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface FirestoreService {
  // User operations
  createUser: (userId: string, userData: UserProfile) => Promise<void>;
  getUser: (userId: string) => Promise<UserProfile | null>;
  updateUser: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Public profile operations
  createPublicProfile: (userId: string, profileData: PublicProfile) => Promise<void>;
  getPublicProfile: (userId: string) => Promise<PublicProfile | null>;
  updatePublicProfile: (userId: string, updates: Partial<PublicProfile>) => Promise<void>;
  deletePublicProfile: (userId: string) => Promise<void>;
  
  // Event operations
  createEvent: (eventData: Omit<Event, 'createdAt' | 'updatedAt'>) => Promise<string>;
  getEvent: (eventId: string) => Promise<Event | null>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  queryEvents: (query: EventQuery) => Promise<Event[]>;
  
  // Event listing operations
  getEventListings: (query: EventQuery) => Promise<EventListing[]>;
  getEventGeo: (query: { lat: number; lng: number; radius: number }) => Promise<EventGeo[]>;
  
  // Membership operations
  createMembership: (userId: string, eventId: string, membership: EventMembership) => Promise<void>;
  getMembership: (userId: string, eventId: string) => Promise<EventMembership | null>;
  updateMembership: (userId: string, eventId: string, updates: Partial<EventMembership>) => Promise<void>;
  deleteMembership: (userId: string, eventId: string) => Promise<void>;
  getUserMemberships: (userId: string) => Promise<EventMembership[]>;
  
  // Join request operations
  createJoinRequest: (eventId: string, request: JoinRequest) => Promise<string>;
  getJoinRequest: (eventId: string, requestId: string) => Promise<JoinRequest | null>;
  updateJoinRequest: (eventId: string, requestId: string, updates: Partial<JoinRequest>) => Promise<void>;
  deleteJoinRequest: (eventId: string, requestId: string) => Promise<void>;
  getEventJoinRequests: (eventId: string) => Promise<JoinRequest[]>;
  
  // Notification operations
  createNotification: (userId: string, notification: Notification) => Promise<string>;
  getNotification: (userId: string, notificationId: string) => Promise<Notification | null>;
  updateNotification: (userId: string, notificationId: string, updates: Partial<Notification>) => Promise<void>;
  deleteNotification: (userId: string, notificationId: string) => Promise<void>;
  getUserNotifications: (query: NotificationQuery) => Promise<Notification[]>;
  markNotificationAsRead: (userId: string, notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: (userId: string) => Promise<void>;
  
  // Chat message operations
  createMessage: (eventId: string, shardId: string, message: ChatMessage) => Promise<string>;
  getMessage: (eventId: string, shardId: string, messageId: string) => Promise<ChatMessage | null>;
  updateMessage: (eventId: string, shardId: string, messageId: string, updates: Partial<ChatMessage>) => Promise<void>;
  deleteMessage: (eventId: string, shardId: string, messageId: string) => Promise<void>;
  getEventMessages: (query: ChatMessageQuery) => Promise<ChatMessage[]>;
  markMessageAsRead: (eventId: string, shardId: string, messageId: string, userId: string) => Promise<void>;
  
  // Report operations
  createReport: (report: UserReport) => Promise<string>;
  getReport: (reportId: string) => Promise<UserReport | null>;
  updateReport: (reportId: string, updates: Partial<UserReport>) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  getReports: (query: { status?: string; targetType?: string }) => Promise<UserReport[]>;
  
  // Batch operations
  batchCreate: <T>(collection: string, documents: Array<{ id: string; data: T }>) => Promise<void>;
  batchUpdate: <T>(collection: string, updates: Array<{ id: string; data: Partial<T> }>) => Promise<void>;
  batchDelete: (collection: string, ids: string[]) => Promise<void>;
}

// ============================================================================
// VALIDATION SERVICE
// ============================================================================

export interface ValidationService {
  validateUserProfile: (profile: Partial<UserProfile>) => ValidationResult;
  validateEvent: (event: Partial<Event>) => EventValidationResult;
  validateEventTitle: (title: string) => ValidationResult;
  validateEventDescription: (description: string) => ValidationResult;
  validateEventTags: (tags: string[]) => ValidationResult;
  validateMessageContent: (content: string) => ValidationResult;
  validateReportDescription: (description: string) => ValidationResult;
}

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================

export interface NotificationService {
  sendEventInvite: (userId: string, eventId: string, inviterId: string) => Promise<void>;
  sendJoinRequest: (eventId: string, requesterId: string) => Promise<void>;
  sendEventConfirmed: (eventId: string, participants: string[]) => Promise<void>;
  sendEventReminder: (eventId: string, participants: string[]) => Promise<void>;
  sendChatMessage: (eventId: string, senderId: string, message: string) => Promise<void>;
  sendFeedbackPrompt: (eventId: string, participants: string[]) => Promise<void>;
  sendSystemUpdate: (userId: string, title: string, message: string) => Promise<void>;
}

// ============================================================================
// EVENT SERVICE
// ============================================================================

export interface EventService {
  createEvent: (creatorId: string, eventData: Omit<Event, 'creatorId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEventStatus: (eventId: string, status: Event['status']) => Promise<void>;
  addUserToEvent: (eventId: string, userId: string, pairRole: 'userA' | 'userB' | 'userC' | 'userD') => Promise<void>;
  removeUserFromEvent: (eventId: string, userId: string) => Promise<void>;
  approveJoinRequest: (eventId: string, requestId: string, approverId: string) => Promise<void>;
  declineJoinRequest: (eventId: string, requestId: string, declinerId: string) => Promise<void>;
  createEventChat: (eventId: string) => Promise<void>;
  archiveEventChat: (eventId: string) => Promise<void>;
  getEventParticipants: (eventId: string) => Promise<string[]>;
  isEventFull: (eventId: string) => Promise<boolean>;
  canUserJoinEvent: (eventId: string, userId: string) => Promise<boolean>;
}

// ============================================================================
// CHAT SERVICE
// ============================================================================

export interface ChatService {
  sendMessage: (eventId: string, senderId: string, content: string) => Promise<string>;
  getEventMessages: (eventId: string, limit?: number) => Promise<ChatMessage[]>;
  markMessageAsRead: (eventId: string, messageId: string, userId: string) => Promise<void>;
  markAllMessagesAsRead: (eventId: string, userId: string) => Promise<void>;
  getUnreadMessageCount: (eventId: string, userId: string) => Promise<number>;
  canUserSendMessage: (eventId: string, userId: string) => Promise<boolean>;
  canUserReadMessages: (eventId: string, userId: string) => Promise<boolean>;
}

// ============================================================================
// USER SERVICE
// ============================================================================

export interface UserService {
  createUserProfile: (userId: string, profileData: UserProfile) => Promise<void>;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => Promise<void>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
  deleteUserProfile: (userId: string) => Promise<void>;
  createPublicProfile: (userId: string, profileData: PublicProfile) => Promise<void>;
  updatePublicProfile: (userId: string, updates: Partial<PublicProfile>) => Promise<void>;
  getPublicProfile: (userId: string) => Promise<PublicProfile | null>;
  deletePublicProfile: (userId: string) => Promise<void>;
  isUserInEvent: (userId: string, eventId: string) => Promise<boolean>;
  getUserRoleInEvent: (userId: string, eventId: string) => Promise<'creator' | 'pair_member' | null>;
  getPairRoleInEvent: (userId: string, eventId: string) => Promise<'userA' | 'userB' | 'userC' | 'userD' | null>;
}

// ============================================================================
// REPORT SERVICE
// ============================================================================

export interface ReportService {
  createReport: (reporterId: string, targetType: 'event' | 'user', targetId: string, category: string, description: string) => Promise<string>;
  getReport: (reportId: string) => Promise<UserReport | null>;
  updateReportStatus: (reportId: string, status: UserReport['status'], reviewerId: string, resolution?: string) => Promise<void>;
  getReports: (query: { status?: string; targetType?: string }) => Promise<UserReport[]>;
  canUserReport: (reporterId: string, targetId: string) => Promise<boolean>;
}

// ============================================================================
// SEARCH SERVICE
// ============================================================================

export interface SearchService {
  searchEvents: (query: EventQuery) => Promise<EventListing[]>;
  searchEventsByLocation: (lat: number, lng: number, radius: number) => Promise<EventGeo[]>;
  searchEventsByTags: (tags: string[]) => Promise<EventListing[]>;
  searchEventsByCity: (city: string) => Promise<EventListing[]>;
  autocompleteEventTitles: (prefix: string) => Promise<Array<{ eventId: string; title: string; city: string }>>;
}

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

export interface AnalyticsService {
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => Promise<void>;
  trackUserAction: (userId: string, action: string, properties?: Record<string, unknown>) => Promise<void>;
  trackEventCreation: (eventId: string, creatorId: string, properties?: Record<string, unknown>) => Promise<void>;
  trackEventJoin: (eventId: string, userId: string, properties?: Record<string, unknown>) => Promise<void>;
  trackMessageSent: (eventId: string, senderId: string, properties?: Record<string, unknown>) => Promise<void>;
  trackReportSubmitted: (reportId: string, reporterId: string, properties?: Record<string, unknown>) => Promise<void>;
}

// ============================================================================
// CACHE SERVICE
// ============================================================================

export interface CacheService {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  has: (key: string) => Promise<boolean>;
  getOrSet: <T>(key: string, factory: () => Promise<T>, ttl?: number) => Promise<T>;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ServiceError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class FirestoreError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'FirestoreError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: string[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BatchResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors: ServiceError[];
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface ServiceConfig {
  firestore: {
    projectId: string;
    apiKey: string;
    authDomain: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  notifications: {
    enabled: boolean;
    batchSize: number;
    ttl: number;
  };
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
}
