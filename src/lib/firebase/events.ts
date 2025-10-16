import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  collection,
  type FirestoreDataConverter,
  type QueryConstraint,
} from 'firebase/firestore';

import { logError, logWarning } from '@/utils/logger';
import type {
  Event,
  EventUpdate,
  EventListing,
  EventGeo,
  EventQuery,
  EventStatus,
  JoinRequest,
  EventMembership,
  ChatMessage
} from '@/types';
import { validateEvent, generateEventId, nowTimestamp } from '@/types';
import { db } from './index';

// ============================================================================
// COLLECTION NAMES
// ============================================================================

const COLLECTION_NAME = 'events';
const LISTINGS_COLLECTION = 'events_listings';
const GEO_COLLECTION = 'events_geo';
const JOIN_REQUESTS_COLLECTION = 'join_requests';
const MEMBERSHIPS_COLLECTION = 'memberships';
const MESSAGES_COLLECTION = 'messages';

// ============================================================================
// CONVERTERS
// ============================================================================

const removeUndefined = <T extends Record<string, unknown>>(value: T): Record<string, unknown> =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));

const eventConverter: FirestoreDataConverter<Event> = {
  toFirestore: (event: Event) => removeUndefined(event as unknown as Record<string, unknown>),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<Event, 'id'>) } as Event),
};

const eventListingConverter: FirestoreDataConverter<EventListing> = {
  toFirestore: (listing: EventListing) => removeUndefined(listing as unknown as Record<string, unknown>),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<EventListing, 'id'>) } as EventListing),
};

const eventGeoConverter: FirestoreDataConverter<EventGeo> = {
  toFirestore: (geo: EventGeo) => removeUndefined(geo as unknown as Record<string, unknown>),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<EventGeo, 'id'>) } as EventGeo),
};

const joinRequestConverter: FirestoreDataConverter<JoinRequest> = {
  toFirestore: (request: JoinRequest) => removeUndefined(request as unknown as Record<string, unknown>),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<JoinRequest, 'id'>) } as JoinRequest),
};

const membershipConverter: FirestoreDataConverter<EventMembership> = {
  toFirestore: (membership: EventMembership) => removeUndefined(membership as unknown as Record<string, unknown>),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<EventMembership, 'id'>) } as EventMembership),
};

const chatMessageConverter: FirestoreDataConverter<ChatMessage> = {
  toFirestore: (message: ChatMessage) => removeUndefined(message as unknown as Record<string, unknown>),
  fromFirestore: snapshot => ({ id: snapshot.id, ...(snapshot.data() as Omit<ChatMessage, 'id'>) } as ChatMessage),
};

// ============================================================================
// DOCUMENT REFERENCES
// ============================================================================

const eventDoc = (eventId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, COLLECTION_NAME, eventId).withConverter(eventConverter);
};

const eventListingDoc = (eventId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, LISTINGS_COLLECTION, eventId).withConverter(eventListingConverter);
};

const eventGeoDoc = (eventId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, GEO_COLLECTION, eventId).withConverter(eventGeoConverter);
};

const joinRequestDoc = (eventId: string, requestId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, COLLECTION_NAME, eventId, JOIN_REQUESTS_COLLECTION, requestId).withConverter(joinRequestConverter);
};

const membershipDoc = (userId: string, eventId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, 'users', userId, MEMBERSHIPS_COLLECTION, eventId).withConverter(membershipConverter);
};

const chatMessageDoc = (eventId: string, shardId: string, messageId: string) => {
  if (!db) {
    throw new Error('Firestore is not configured');
  }
  return doc(db, COLLECTION_NAME, eventId, MESSAGES_COLLECTION, shardId, messageId).withConverter(chatMessageConverter);
};

// ============================================================================
// EVENT CRUD OPERATIONS
// ============================================================================

export const createEvent = async (eventData: Omit<Event, 'createdAt' | 'updatedAt' | 'lastActivityAt'>): Promise<string> => {
  if (!db) {
    logWarning('Skipped creating event because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'createEvent:disabled',
      additionalData: { title: eventData.title },
    });
    throw new Error('Firestore is not configured');
  }

  // Validate event data
  const validation = validateEvent(eventData);
  if (!validation.isValid) {
    throw new Error(`Event validation failed: ${validation.errors.join(', ')}`);
  }

  const eventId = generateEventId();
  const now = nowTimestamp();

  const event: Event = {
    ...eventData,
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  };

  try {
    await setDoc(eventDoc(eventId), event);
    
    // Create event listing projection
    await createEventListing(eventId, event);
    
    // Create event geo projection
    await createEventGeo(eventId, event);
    
    return eventId;
  } catch (error) {
    logError('Failed to create event', error, {
      component: 'firebase:events',
      action: 'createEvent',
      additionalData: { eventId, title: eventData.title },
    });
    throw error;
  }
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  if (!db) {
    logWarning('Skipped getting event because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'getEvent:disabled',
      additionalData: { eventId },
    });
    return null;
  }

  try {
    const docSnap = await getDocs(query(collection(db, COLLECTION_NAME), where('__name__', '==', eventId)));
    
    if (docSnap.empty) {
      return null;
    }
    
    return docSnap.docs[0].data() as Event;
  } catch (error) {
    logError('Failed to get event', error, {
      component: 'firebase:events',
      action: 'getEvent',
      additionalData: { eventId },
    });
    throw error;
  }
};

export const updateEvent = async (eventId: string, updates: EventUpdate): Promise<void> => {
  if (!db) {
    logWarning('Skipped updating event because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'updateEvent:disabled',
      additionalData: { eventId, updates },
    });
    throw new Error('Firestore is not configured');
  }

  const sanitizedUpdates = removeUndefined(updates);
  const now = nowTimestamp();

  try {
    await updateDoc(eventDoc(eventId), {
      ...sanitizedUpdates,
      updatedAt: now,
      lastActivityAt: now,
    });
    
    // Update projections if relevant fields changed
    if (updates.title || updates.city || updates.timeStart || updates.visibility || updates.counts) {
      const event = await getEvent(eventId);
      if (event) {
        await updateEventListing(eventId, event);
        await updateEventGeo(eventId, event);
      }
    }
  } catch (error) {
    logError('Failed to update event', error, {
      component: 'firebase:events',
      action: 'updateEvent',
      additionalData: { eventId, updates },
    });
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  if (!db) {
    logWarning('Skipped deleting event because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'deleteEvent:disabled',
      additionalData: { eventId },
    });
    return;
  }

  try {
    await deleteDoc(eventDoc(eventId));
    await deleteDoc(eventListingDoc(eventId));
    await deleteDoc(eventGeoDoc(eventId));
  } catch (error) {
    logError('Failed to delete event', error, {
      component: 'firebase:events',
      action: 'deleteEvent',
      additionalData: { eventId },
    });
    throw error;
  }
};

// ============================================================================
// EVENT QUERYING
// ============================================================================

export const queryEvents = async (queryParams: EventQuery): Promise<Event[]> => {
  if (!db) {
    logWarning('Skipped querying events because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'queryEvents:disabled',
      additionalData: { queryParams },
    });
    return [];
  }

  try {
    const constraints: QueryConstraint[] = [];
    
    // Add filters
    if (queryParams.city) {
      constraints.push(where('location.city', '==', queryParams.city));
    }
    
    if (queryParams.visibility) {
      constraints.push(where('visibility', '==', queryParams.visibility));
    }
    
    if (queryParams.status) {
      constraints.push(where('status', '==', queryParams.status));
    }
    
    if (queryParams.tags && queryParams.tags.length > 0) {
      constraints.push(where('tags', 'array-contains-any', queryParams.tags));
    }
    
    if (queryParams.timeStart?.from) {
      constraints.push(where('timeStart', '>=', queryParams.timeStart.from));
    }
    
    if (queryParams.timeStart?.to) {
      constraints.push(where('timeStart', '<=', queryParams.timeStart.to));
    }
    
    // Add ordering
    const orderByField = queryParams.orderBy || 'timeStart';
    const orderDirection = queryParams.orderDirection || 'asc';
    constraints.push(orderBy(orderByField, orderDirection));
    
    // Add limit
    if (queryParams.limit) {
      constraints.push(limit(queryParams.limit));
    }
    
    const q = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as Event);
  } catch (error) {
    logError('Failed to query events', error, {
      component: 'firebase:events',
      action: 'queryEvents',
      additionalData: { queryParams },
    });
    throw error;
  }
};

// ============================================================================
// EVENT LISTING PROJECTIONS
// ============================================================================

const createEventListing = async (eventId: string, event: Event): Promise<void> => {
  if (!db) return;

  const listing: EventListing = {
    title: event.title,
    city: event.location.city,
    timeStart: event.timeStart,
    visibility: event.visibility,
    confirmedCount: event.counts.confirmed,
    creatorSnap: {
      displayName: '', // This would be populated from user data
      photoUrl: undefined,
    },
    coverThumbUrl: event.coverThumbUrl,
    tags: event.tags,
    lastActivityAt: event.lastActivityAt,
  };

  try {
    await setDoc(eventListingDoc(eventId), listing);
  } catch (error) {
    logError('Failed to create event listing', error, {
      component: 'firebase:events',
      action: 'createEventListing',
      additionalData: { eventId },
    });
  }
};

const updateEventListing = async (eventId: string, event: Event): Promise<void> => {
  if (!db) return;

  const listing: Partial<EventListing> = {
    title: event.title,
    city: event.location.city,
    timeStart: event.timeStart,
    visibility: event.visibility,
    confirmedCount: event.counts.confirmed,
    coverThumbUrl: event.coverThumbUrl,
    tags: event.tags,
    lastActivityAt: event.lastActivityAt,
  };

  try {
    await updateDoc(eventListingDoc(eventId), listing);
  } catch (error) {
    logError('Failed to update event listing', error, {
      component: 'firebase:events',
      action: 'updateEventListing',
      additionalData: { eventId },
    });
  }
};

// ============================================================================
// EVENT GEO PROJECTIONS
// ============================================================================

const createEventGeo = async (eventId: string, event: Event): Promise<void> => {
  if (!db) return;

  const geo: EventGeo = {
    lat: event.location.geoPoint.latitude,
    lng: event.location.geoPoint.longitude,
    geohash: event.location.geohash,
    timeStart: event.timeStart,
    visibility: event.visibility,
  };

  try {
    await setDoc(eventGeoDoc(eventId), geo);
  } catch (error) {
    logError('Failed to create event geo', error, {
      component: 'firebase:events',
      action: 'createEventGeo',
      additionalData: { eventId },
    });
  }
};

const updateEventGeo = async (eventId: string, event: Event): Promise<void> => {
  if (!db) return;

  const geo: Partial<EventGeo> = {
    lat: event.location.geoPoint.latitude,
    lng: event.location.geoPoint.longitude,
    geohash: event.location.geohash,
    timeStart: event.timeStart,
    visibility: event.visibility,
  };

  try {
    await updateDoc(eventGeoDoc(eventId), geo);
  } catch (error) {
    logError('Failed to update event geo', error, {
      component: 'firebase:events',
      action: 'updateEventGeo',
      additionalData: { eventId },
    });
  }
};

// ============================================================================
// JOIN REQUEST OPERATIONS
// ============================================================================

export const createJoinRequest = async (eventId: string, request: JoinRequest): Promise<string> => {
  if (!db) {
    logWarning('Skipped creating join request because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'createJoinRequest:disabled',
      additionalData: { eventId },
    });
    throw new Error('Firestore is not configured');
  }

  const requestId = `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    await setDoc(joinRequestDoc(eventId, requestId), request);
    return requestId;
  } catch (error) {
    logError('Failed to create join request', error, {
      component: 'firebase:events',
      action: 'createJoinRequest',
      additionalData: { eventId, requestId },
    });
    throw error;
  }
};

export const getJoinRequest = async (eventId: string, requestId: string): Promise<JoinRequest | null> => {
  if (!db) {
    logWarning('Skipped getting join request because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'getJoinRequest:disabled',
      additionalData: { eventId, requestId },
    });
    return null;
  }

  try {
    const docSnap = await getDocs(query(collection(db, COLLECTION_NAME, eventId, JOIN_REQUESTS_COLLECTION), where('__name__', '==', requestId)));
    
    if (docSnap.empty) {
      return null;
    }
    
    return docSnap.docs[0].data() as JoinRequest;
  } catch (error) {
    logError('Failed to get join request', error, {
      component: 'firebase:events',
      action: 'getJoinRequest',
      additionalData: { eventId, requestId },
    });
    throw error;
  }
};

export const updateJoinRequest = async (eventId: string, requestId: string, updates: Partial<JoinRequest>): Promise<void> => {
  if (!db) {
    logWarning('Skipped updating join request because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'updateJoinRequest:disabled',
      additionalData: { eventId, requestId, updates },
    });
    throw new Error('Firestore is not configured');
  }

  const sanitizedUpdates = removeUndefined(updates);

  try {
    await updateDoc(joinRequestDoc(eventId, requestId), sanitizedUpdates);
  } catch (error) {
    logError('Failed to update join request', error, {
      component: 'firebase:events',
      action: 'updateJoinRequest',
      additionalData: { eventId, requestId, updates },
    });
    throw error;
  }
};

export const deleteJoinRequest = async (eventId: string, requestId: string): Promise<void> => {
  if (!db) {
    logWarning('Skipped deleting join request because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'deleteJoinRequest:disabled',
      additionalData: { eventId, requestId },
    });
    return;
  }

  try {
    await deleteDoc(joinRequestDoc(eventId, requestId));
  } catch (error) {
    logError('Failed to delete join request', error, {
      component: 'firebase:events',
      action: 'deleteJoinRequest',
      additionalData: { eventId, requestId },
    });
    throw error;
  }
};

export const getEventJoinRequests = async (eventId: string): Promise<JoinRequest[]> => {
  if (!db) {
    logWarning('Skipped getting event join requests because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'getEventJoinRequests:disabled',
      additionalData: { eventId },
    });
    return [];
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME, eventId, JOIN_REQUESTS_COLLECTION),
      orderBy('requestedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as JoinRequest);
  } catch (error) {
    logError('Failed to get event join requests', error, {
      component: 'firebase:events',
      action: 'getEventJoinRequests',
      additionalData: { eventId },
    });
    throw error;
  }
};

// ============================================================================
// MEMBERSHIP OPERATIONS
// ============================================================================

export const createMembership = async (userId: string, eventId: string, membership: EventMembership): Promise<void> => {
  if (!db) {
    logWarning('Skipped creating membership because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'createMembership:disabled',
      additionalData: { userId, eventId },
    });
    throw new Error('Firestore is not configured');
  }

  try {
    await setDoc(membershipDoc(userId, eventId), membership);
  } catch (error) {
    logError('Failed to create membership', error, {
      component: 'firebase:events',
      action: 'createMembership',
      additionalData: { userId, eventId },
    });
    throw error;
  }
};

export const getMembership = async (userId: string, eventId: string): Promise<EventMembership | null> => {
  if (!db) {
    logWarning('Skipped getting membership because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'getMembership:disabled',
      additionalData: { userId, eventId },
    });
    return null;
  }

  try {
    const docSnap = await getDocs(query(collection(db, 'users', userId, MEMBERSHIPS_COLLECTION), where('__name__', '==', eventId)));
    
    if (docSnap.empty) {
      return null;
    }
    
    return docSnap.docs[0].data() as EventMembership;
  } catch (error) {
    logError('Failed to get membership', error, {
      component: 'firebase:events',
      action: 'getMembership',
      additionalData: { userId, eventId },
    });
    throw error;
  }
};

export const updateMembership = async (userId: string, eventId: string, updates: Partial<EventMembership>): Promise<void> => {
  if (!db) {
    logWarning('Skipped updating membership because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'updateMembership:disabled',
      additionalData: { userId, eventId, updates },
    });
    throw new Error('Firestore is not configured');
  }

  const sanitizedUpdates = removeUndefined(updates);

  try {
    await updateDoc(membershipDoc(userId, eventId), sanitizedUpdates);
  } catch (error) {
    logError('Failed to update membership', error, {
      component: 'firebase:events',
      action: 'updateMembership',
      additionalData: { userId, eventId, updates },
    });
    throw error;
  }
};

export const deleteMembership = async (userId: string, eventId: string): Promise<void> => {
  if (!db) {
    logWarning('Skipped deleting membership because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'deleteMembership:disabled',
      additionalData: { userId, eventId },
    });
    return;
  }

  try {
    await deleteDoc(membershipDoc(userId, eventId));
  } catch (error) {
    logError('Failed to delete membership', error, {
      component: 'firebase:events',
      action: 'deleteMembership',
      additionalData: { userId, eventId },
    });
    throw error;
  }
};

export const getUserMemberships = async (userId: string): Promise<EventMembership[]> => {
  if (!db) {
    logWarning('Skipped getting user memberships because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'getUserMemberships:disabled',
      additionalData: { userId },
    });
    return [];
  }

  try {
    const q = query(
      collection(db, 'users', userId, MEMBERSHIPS_COLLECTION),
      orderBy('joinedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data() as EventMembership);
  } catch (error) {
    logError('Failed to get user memberships', error, {
      component: 'firebase:events',
      action: 'getUserMemberships',
      additionalData: { userId },
    });
    throw error;
  }
};

// ============================================================================
// CHAT MESSAGE OPERATIONS
// ============================================================================

export const createMessage = async (eventId: string, shardId: string, message: ChatMessage): Promise<string> => {
  if (!db) {
    logWarning('Skipped creating message because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'createMessage:disabled',
      additionalData: { eventId, shardId },
    });
    throw new Error('Firestore is not configured');
  }

  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    await setDoc(chatMessageDoc(eventId, shardId, messageId), message);
    return messageId;
  } catch (error) {
    logError('Failed to create message', error, {
      component: 'firebase:events',
      action: 'createMessage',
      additionalData: { eventId, shardId, messageId },
    });
    throw error;
  }
};

export const getEventMessages = async (eventId: string, shardId?: string, limitCount: number = 50): Promise<ChatMessage[]> => {
  if (!db) {
    logWarning('Skipped getting event messages because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'getEventMessages:disabled',
      additionalData: { eventId, shardId },
    });
    return [];
  }

  try {
    if (shardId) {
      // Query specific shard
      const q = query(
        collection(db, COLLECTION_NAME, eventId, MESSAGES_COLLECTION, shardId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ChatMessage);
    } else {
      // Query all shards (this is expensive, should be avoided in production)
      const q = query(
        collection(db, COLLECTION_NAME, eventId, MESSAGES_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as ChatMessage);
    }
  } catch (error) {
    logError('Failed to get event messages', error, {
      component: 'firebase:events',
      action: 'getEventMessages',
      additionalData: { eventId, shardId },
    });
    throw error;
  }
};

export const updateMessage = async (eventId: string, shardId: string, messageId: string, updates: Partial<ChatMessage>): Promise<void> => {
  if (!db) {
    logWarning('Skipped updating message because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'updateMessage:disabled',
      additionalData: { eventId, shardId, messageId, updates },
    });
    throw new Error('Firestore is not configured');
  }

  const sanitizedUpdates = removeUndefined(updates);

  try {
    await updateDoc(chatMessageDoc(eventId, shardId, messageId), sanitizedUpdates);
  } catch (error) {
    logError('Failed to update message', error, {
      component: 'firebase:events',
      action: 'updateMessage',
      additionalData: { eventId, shardId, messageId, updates },
    });
    throw error;
  }
};

export const deleteMessage = async (eventId: string, shardId: string, messageId: string): Promise<void> => {
  if (!db) {
    logWarning('Skipped deleting message because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'deleteMessage:disabled',
      additionalData: { eventId, shardId, messageId },
    });
    return;
  }

  try {
    await deleteDoc(chatMessageDoc(eventId, shardId, messageId));
  } catch (error) {
    logError('Failed to delete message', error, {
      component: 'firebase:events',
      action: 'deleteMessage',
      additionalData: { eventId, shardId, messageId },
    });
    throw error;
  }
};

// ============================================================================
// EVENT STATE MANAGEMENT
// ============================================================================

export const updateEventStatus = async (eventId: string, status: EventStatus): Promise<void> => {
  if (!db) {
    logWarning('Skipped updating event status because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'updateEventStatus:disabled',
      additionalData: { eventId, status },
    });
    throw new Error('Firestore is not configured');
  }

  try {
    await updateEvent(eventId, { status });
    
    // If event is confirmed, create chat
    if (status === 'confirmed') {
      await updateEvent(eventId, { chatCreated: true });
    }
  } catch (error) {
    logError('Failed to update event status', error, {
      component: 'firebase:events',
      action: 'updateEventStatus',
      additionalData: { eventId, status },
    });
    throw error;
  }
};

export const addUserToEvent = async (eventId: string, userId: string, pairRole: 'userA' | 'userB' | 'userC' | 'userD'): Promise<void> => {
  if (!db) {
    logWarning('Skipped adding user to event because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'addUserToEvent:disabled',
      additionalData: { eventId, userId, pairRole },
    });
    throw new Error('Firestore is not configured');
  }

  try {
    const event = await getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Update pairs
    const updatedPairs = { ...event.pairs };
    if (pairRole === 'userA') {
      updatedPairs.pair1.userA = userId;
    } else if (pairRole === 'userB') {
      updatedPairs.pair1.userB = userId;
    } else if (pairRole === 'userC') {
      updatedPairs.pair2.userC = userId;
    } else if (pairRole === 'userD') {
      updatedPairs.pair2.userD = userId;
    }

    // Update counts
    const updatedCounts = { ...event.counts };
    updatedCounts.confirmed += 1;

    await updateEvent(eventId, {
      pairs: updatedPairs,
      counts: updatedCounts,
    });
  } catch (error) {
    logError('Failed to add user to event', error, {
      component: 'firebase:events',
      action: 'addUserToEvent',
      additionalData: { eventId, userId, pairRole },
    });
    throw error;
  }
};

export const removeUserFromEvent = async (eventId: string, userId: string): Promise<void> => {
  if (!db) {
    logWarning('Skipped removing user from event because Firestore is not configured.', {
      component: 'firebase:events',
      action: 'removeUserFromEvent:disabled',
      additionalData: { eventId, userId },
    });
    throw new Error('Firestore is not configured');
  }

  try {
    const event = await getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Update pairs
    const updatedPairs = { ...event.pairs };
    if (event.pairs.pair1.userA === userId) {
      updatedPairs.pair1.userA = '';
    } else if (event.pairs.pair1.userB === userId) {
      updatedPairs.pair1.userB = '';
    } else if (event.pairs.pair2.userC === userId) {
      updatedPairs.pair2.userC = '';
    } else if (event.pairs.pair2.userD === userId) {
      updatedPairs.pair2.userD = '';
    }

    // Update counts
    const updatedCounts = { ...event.counts };
    updatedCounts.confirmed = Math.max(0, updatedCounts.confirmed - 1);

    await updateEvent(eventId, {
      pairs: updatedPairs,
      counts: updatedCounts,
    });
  } catch (error) {
    logError('Failed to remove user from event', error, {
      component: 'firebase:events',
      action: 'removeUserFromEvent',
      additionalData: { eventId, userId },
    });
    throw error;
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const isEventFull = async (eventId: string): Promise<boolean> => {
  const event = await getEvent(eventId);
  return event ? event.counts.confirmed >= event.capacity : false;
};

export const canUserJoinEvent = async (eventId: string, userId: string): Promise<boolean> => {
  const event = await getEvent(eventId);
  if (!event) return false;
  
  // Check if user is already in the event
  const isInEvent = event.pairs.pair1.userA === userId ||
                   event.pairs.pair1.userB === userId ||
                   event.pairs.pair2.userC === userId ||
                   event.pairs.pair2.userD === userId;
  
  if (isInEvent) return false;
  
  // Check if event is live and has space
  return event.status === 'live' && event.counts.confirmed < event.capacity;
};

export const getEventParticipants = async (eventId: string): Promise<string[]> => {
  const event = await getEvent(eventId);
  if (!event) return [];
  
  return [
    event.pairs.pair1.userA,
    event.pairs.pair1.userB,
    event.pairs.pair2.userC,
    event.pairs.pair2.userD,
  ].filter(id => id !== '');
};
