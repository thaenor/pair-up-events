// ============================================================================
// MAIN EXPORTS
// ============================================================================

// Core Firestore types
export * from './firestore';

// Validation types and functions
export * from './validation';

// Helper types and functions
export * from './helpers';

// Legacy user profile types (for backward compatibility)
export * from './user-profile';

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

// Re-export commonly used types for convenience
export type {
  // Core types
  UserProfile,
  PublicProfile,
  Event,
  EventDocument,
  EventListing,
  EventGeo,
  
  // Enums
  EventStatus,
  EventVisibility,
  DuoType,
  Gender,
  Vibe,
  ConnectionIntention,
  NotificationType,
  ReportCategory,
  MessageType,
  Theme,
  ColorScheme,
  Language,
  
  // Update types
  UserProfileUpdate,
  EventUpdate,
  NotificationUpdate,
  ChatMessageUpdate,
  
  // Query types
  EventQuery,
  NotificationQuery,
  ChatMessageQuery,
  
  // Validation types
  ValidationResult,
  EventValidationResult,
  
  // Utility types
  WithId,
  WithTimestamp,
  Optional,
  RequiredFields
} from './firestore';

// Re-export validation functions
export {
  // User validation
  validateFirstName,
  validateDisplayName,
  validateEmail,
  validateBirthDate,
  validateGender,
  isGender,
  validateUserProfile,
  
  // Event validation
  validateEventTitle,
  validateEventDescription,
  validateEventTags,
  validateEventCapacity,
  validateEventPairs,
  validateEventStatus,
  validateEventVisibility,
  validateDuoType,
  validateVibes,
  validateConnectionIntention,
  validateEvent,
  
  // Message validation
  validateMessageContent,
  
  // Report validation
  validateReportCategory,
  validateReportDescription,
  
  // Utility validation
  validateUrl,
  validatePhoneNumber,
  validateAgeRange,
  validateTimestamp
} from './validation';

// Re-export helper functions
export {
  // Type guards
  isEventStatus,
  isEventVisibility,
  isEventLive,
  isEventConfirmed,
  isEventCompleted,
  isEventPending,
  isEventCancelled,
  isEventPublic,
  isEventPrivate,
  
  // User helpers
  calculateAge,
  createPublicProfile,
  isUserInEvent,
  getUserRoleInEvent,
  getPairRoleInEvent,
  getOtherUsersInEvent,
  getPairMembers,
  getOtherPairMembers,
  
  // Event helpers
  canUserJoinEvent,
  canUserCreateEvent,
  canUserEditEvent,
  canUserDeleteEvent,
  getEventParticipants,
  isEventFull,
  isEventUpcoming,
  isEventPast,
  getEventTimeRemaining,
  formatEventTimeRemaining,
  
  // Notification helpers
  isNotificationUnread,
  isNotificationExpired,
  getNotificationAge,
  formatNotificationAge,
  
  // Chat helpers
  canUserSendMessage,
  canUserReadMessages,
  getUnreadMessageCount,
  getMessageAge,
  formatMessageAge,
  
  // Report helpers
  canUserReport,
  isReportPending,
  isReportResolved,
  getReportAge,
  
  // Membership helpers
  isMembershipConfirmed,
  isMembershipPending,
  getMembershipAge,
  
  // Join request helpers
  isJoinRequestPending,
  isJoinRequestApproved,
  isJoinRequestDeclined,
  getJoinRequestAge,
  
  // Utility helpers
  generateShardId,
  generateBatchId,
  sanitizeString,
  truncateString,
  generateEventId,
  generateMessageId,
  generateNotificationId,
  generateReportId,
  
  // Type conversion helpers
  addId,
  removeId,
  toTimestamp,
  fromTimestamp,
  nowTimestamp,
  
  // Array helpers
  groupBy,
  sortBy,
  uniqueBy
} from './helpers';

// ============================================================================
// CONSTANTS EXPORTS
// ============================================================================

export {
  // Enums
  EVENT_STATUS,
  EVENT_VISIBILITY,
  DUO_TYPE,
  CONNECTION_INTENTION,
  GENDER,
  VIBES,
  NOTIFICATION_TYPE,
  REPORT_CATEGORY,
  REPORT_STATUS,
  MESSAGE_TYPE,
  SYSTEM_MESSAGE_TYPE,
  THEME,
  COLOR_SCHEME,
  LANGUAGE,
  
  // Brand colors
  BRAND_COLORS
} from './firestore';

export {
  // Validation constants
  VALIDATION_LIMITS,
  VALIDATION_REGEX
} from './validation';
