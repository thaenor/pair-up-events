import { Timestamp } from 'firebase/firestore';
import type {
  Event,
  EventStatus,
  EventVisibility,
  UserProfile,
  PublicProfile,
  Notification,
  ChatMessage,
  UserReport,
  EventMembership,
  JoinRequest,
  EventQuery,
  NotificationQuery,
  ChatMessageQuery
} from './firestore';

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isEventStatus(status: string): status is EventStatus {
  return ['pending', 'live', 'confirmed', 'completed', 'cancelled'].includes(status);
}

export function isEventVisibility(visibility: string): visibility is EventVisibility {
  return ['public', 'private', 'friends'].includes(visibility);
}

export function isEventLive(event: Event): boolean {
  return event.status === 'live';
}

export function isEventConfirmed(event: Event): boolean {
  return event.status === 'confirmed';
}

export function isEventCompleted(event: Event): boolean {
  return event.status === 'completed';
}

export function isEventPending(event: Event): boolean {
  return event.status === 'pending';
}

export function isEventCancelled(event: Event): boolean {
  return event.status === 'cancelled';
}

export function isEventPublic(event: Event): boolean {
  return event.visibility === 'public';
}

export function isEventPrivate(event: Event): boolean {
  return event.visibility === 'private';
}

// ============================================================================
// USER HELPERS
// ============================================================================

export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function createPublicProfile(userProfile: UserProfile): PublicProfile {
  return {
    firstName: userProfile.firstName,
    displayName: userProfile.displayName,
    photoUrl: userProfile.photoUrl,
    age: calculateAge(userProfile.birthDate),
    gender: userProfile.gender
  };
}

export function isUserInEvent(userId: string, event: Event): boolean {
  return (
    event.pairs.pair1.userA === userId ||
    event.pairs.pair1.userB === userId ||
    event.pairs.pair2.userC === userId ||
    event.pairs.pair2.userD === userId
  );
}

export function getUserRoleInEvent(userId: string, event: Event): 'creator' | 'pair_member' | null {
  if (event.creatorId === userId) {
    return 'creator';
  }
  
  if (isUserInEvent(userId, event)) {
    return 'pair_member';
  }
  
  return null;
}

export function getPairRoleInEvent(userId: string, event: Event): 'userA' | 'userB' | 'userC' | 'userD' | null {
  if (event.pairs.pair1.userA === userId) return 'userA';
  if (event.pairs.pair1.userB === userId) return 'userB';
  if (event.pairs.pair2.userC === userId) return 'userC';
  if (event.pairs.pair2.userD === userId) return 'userD';
  return null;
}

export function getOtherUsersInEvent(userId: string, event: Event): string[] {
  const allUsers = [
    event.pairs.pair1.userA,
    event.pairs.pair1.userB,
    event.pairs.pair2.userC,
    event.pairs.pair2.userD
  ];
  
  return allUsers.filter(id => id !== userId);
}

export function getPairMembers(userId: string, event: Event): string[] {
  const pairRole = getPairRoleInEvent(userId, event);
  
  if (!pairRole) return [];
  
  if (pairRole === 'userA' || pairRole === 'userB') {
    return [event.pairs.pair1.userA, event.pairs.pair1.userB];
  } else {
    return [event.pairs.pair2.userC, event.pairs.pair2.userD];
  }
}

export function getOtherPairMembers(userId: string, event: Event): string[] {
  const pairMembers = getPairMembers(userId, event);
  return pairMembers.filter(id => id !== userId);
}

// ============================================================================
// EVENT HELPERS
// ============================================================================

export function canUserJoinEvent(userId: string, event: Event): boolean {
  // User can't join if they're already in the event
  if (isUserInEvent(userId, event)) {
    return false;
  }
  
  // User can only join live events
  if (!isEventLive(event)) {
    return false;
  }
  
  // Event must have space (should always be true for live events)
  return event.counts.confirmed < event.capacity;
}

export function canUserCreateEvent(userId: string): boolean {
  // Basic validation - could be extended with more business rules
  return !!userId;
}

export function canUserEditEvent(userId: string, event: Event): boolean {
  // Only the creator can edit the event
  return event.creatorId === userId;
}

export function canUserDeleteEvent(userId: string, event: Event): boolean {
  // Only the creator can delete the event
  return event.creatorId === userId;
}

export function getEventParticipants(event: Event): string[] {
  return [
    event.pairs.pair1.userA,
    event.pairs.pair1.userB,
    event.pairs.pair2.userC,
    event.pairs.pair2.userD
  ];
}

export function isEventFull(event: Event): boolean {
  return event.counts.confirmed >= event.capacity;
}

export function isEventUpcoming(event: Event): boolean {
  const now = Timestamp.now();
  return event.timeStart.seconds > now.seconds;
}

export function isEventPast(event: Event): boolean {
  const now = Timestamp.now();
  return event.timeStart.seconds < now.seconds;
}

export function getEventTimeRemaining(event: Event): number {
  const now = Timestamp.now();
  return event.timeStart.seconds - now.seconds;
}

export function formatEventTimeRemaining(event: Event): string {
  const seconds = getEventTimeRemaining(event);
  
  if (seconds <= 0) {
    return 'Event has started';
  }
  
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
  }
}

// ============================================================================
// NOTIFICATION HELPERS
// ============================================================================

export function isNotificationUnread(notification: Notification): boolean {
  return !notification.read;
}

export function isNotificationExpired(notification: Notification): boolean {
  const now = Timestamp.now();
  return notification.expiresAt.seconds < now.seconds;
}

export function getNotificationAge(notification: Notification): number {
  const now = Timestamp.now();
  return now.seconds - notification.createdAt.seconds;
}

export function formatNotificationAge(notification: Notification): string {
  const seconds = getNotificationAge(notification);
  
  if (seconds < 60) {
    return 'Just now';
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

// ============================================================================
// CHAT HELPERS
// ============================================================================

export function canUserSendMessage(userId: string, event: Event): boolean {
  // User must be in the event and event must be confirmed
  return isUserInEvent(userId, event) && isEventConfirmed(event);
}

export function canUserReadMessages(userId: string, event: Event): boolean {
  // User must be in the event
  return isUserInEvent(userId, event);
}

export function getUnreadMessageCount(messages: ChatMessage[], userId: string): number {
  return messages.filter(message => {
    const readByUser = message.readBy[userId];
    return !readByUser || readByUser.seconds < message.createdAt.seconds;
  }).length;
}

export function getMessageAge(message: ChatMessage): number {
  const now = Timestamp.now();
  return now.seconds - message.createdAt.seconds;
}

export function formatMessageAge(message: ChatMessage): string {
  const seconds = getMessageAge(message);
  
  if (seconds < 60) {
    return 'Just now';
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days}d`;
  }
}

// ============================================================================
// QUERY HELPERS
// ============================================================================

export function buildEventQuery(query: EventQuery) {
  // This would be used with Firestore query builder
  // Implementation depends on your Firestore service layer
  return query;
}

export function buildNotificationQuery(query: NotificationQuery) {
  // This would be used with Firestore query builder
  return query;
}

export function buildChatMessageQuery(query: ChatMessageQuery) {
  // This would be used with Firestore query builder
  return query;
}

// ============================================================================
// REPORT HELPERS
// ============================================================================

export function canUserReport(userId: string, targetId: string): boolean {
  // User can't report themselves
  return userId !== targetId;
}

export function isReportPending(report: UserReport): boolean {
  return report.status === 'pending';
}

export function isReportResolved(report: UserReport): boolean {
  return report.status === 'resolved';
}

export function getReportAge(report: UserReport): number {
  const now = Timestamp.now();
  return now.seconds - report.createdAt.seconds;
}

// ============================================================================
// MEMBERSHIP HELPERS
// ============================================================================

export function isMembershipConfirmed(membership: EventMembership): boolean {
  return membership.status === 'confirmed';
}

export function isMembershipPending(membership: EventMembership): boolean {
  return membership.status === 'pending';
}

export function getMembershipAge(membership: EventMembership): number {
  const now = Timestamp.now();
  return now.seconds - membership.joinedAt.seconds;
}

// ============================================================================
// JOIN REQUEST HELPERS
// ============================================================================

export function isJoinRequestPending(request: JoinRequest): boolean {
  return request.status === 'pending';
}

export function isJoinRequestApproved(request: JoinRequest): boolean {
  return request.status === 'approved';
}

export function isJoinRequestDeclined(request: JoinRequest): boolean {
  return request.status === 'declined';
}

export function getJoinRequestAge(request: JoinRequest): number {
  const now = Timestamp.now();
  return now.seconds - request.requestedAt.seconds;
}

// ============================================================================
// UTILITY HELPERS
// ============================================================================

export function generateShardId(timestamp: Timestamp): string {
  // Daily sharding for messages
  const date = new Date(timestamp.seconds * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateBatchId(timestamp: Timestamp): string {
  // Batch notifications by hour
  const date = new Date(timestamp.seconds * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  return `${year}-${month}-${day}-${hour}`;
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function truncateString(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }
  return input.substring(0, maxLength - 3) + '...';
}

export function generateEventId(): string {
  // Generate a unique event ID
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMessageId(): string {
  // Generate a unique message ID
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateNotificationId(): string {
  // Generate a unique notification ID
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateReportId(): string {
  // Generate a unique report ID
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// TYPE CONVERSION HELPERS
// ============================================================================

export function addId<T>(data: T, id: string): T & { id: string } {
  return { ...data, id };
}

export function removeId<T extends { id: string }>(data: T): Omit<T, 'id'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = data;
  return rest;
}

export function toTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

export function fromTimestamp(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

export function nowTimestamp(): Timestamp {
  return Timestamp.now();
}

// ============================================================================
// ARRAY HELPERS
// ============================================================================

export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

export function sortBy<T>(
  array: T[],
  keyFn: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);
    
    if (direction === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
}

export function uniqueBy<T, K>(array: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
