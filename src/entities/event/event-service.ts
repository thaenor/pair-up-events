import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
  arrayUnion,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { DraftEventData, ChatMessageData } from './event'
import type { Timestamp as FirestoreTimestamp } from 'firebase/firestore'

// Type for chat message data as stored in Firestore
interface FirestoreChatMessage {
  messageId: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: FirestoreTimestamp | Date
  eventData?: unknown
}

/**
 * Result type for service operations.
 * Provides explicit success/error states with type-safe error categorization.
 */
export type LoadResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; errorType: 'not-found' | 'validation' | 'network' }

export type SaveResult =
  | { success: true }
  | { success: false; error: string; errorType: 'permission' | 'validation' | 'network' | 'not-found' }

/**
 * Creates a new draft event document in Firestore users/{userId}/ownEvents/{eventId}
 *
 * @param userId - The unique identifier of the user creating the draft event
 * @returns A Promise that resolves to LoadResult with eventId if successful
 */
export async function createDraftEvent(userId: string): Promise<LoadResult<string>> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const now = new Date()
    const draftEventData: Omit<DraftEventData, 'eventId'> = {
      role: 'creator',
      status: 'draft',
      pairRole: 'userA',
      isDeleted: false,
      joinedAt: now,
      createdAt: now,
      updatedAt: now,
    }

    // Create document in ownEvents subcollection
    const ownEventsRef = collection(db, 'users', userId, 'ownEvents')
    const docRef = await addDoc(ownEventsRef, {
      ...draftEventData,
      joinedAt: Timestamp.fromDate(draftEventData.joinedAt),
      createdAt: Timestamp.fromDate(draftEventData.createdAt),
      updatedAt: Timestamp.fromDate(draftEventData.updatedAt),
    })

    return { success: true, data: docRef.id }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to create draft event for userId: ${userId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}

/**
 * Loads the earliest draft event for a user
 *
 * Queries users/{userId}/ownEvents collection for draft events,
 * ordered by createdAt ascending, and returns the first one found.
 *
 * @param userId - The unique identifier of the user
 * @returns A Promise that resolves to LoadResult with draft event data or error
 */
export async function loadDraftEvent(userId: string): Promise<LoadResult<DraftEventData & { eventId: string }>> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const ownEventsRef = collection(db, 'users', userId, 'ownEvents')
    const q = query(
      ownEventsRef,
      where('status', '==', 'draft'),
      where('isDeleted', '==', false),
      orderBy('createdAt', 'asc')
    )

    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return { success: false, error: 'No draft event found', errorType: 'not-found' }
    }

    // Get the earliest draft (first document)
    const docSnap = querySnapshot.docs[0]
    const data = docSnap.data()

    // Convert Firestore Timestamps to Dates
    const draftEvent: DraftEventData & { eventId: string } = {
      eventId: docSnap.id,
      role: data.role,
      status: data.status,
      pairRole: data.pairRole,
      isDeleted: data.isDeleted ?? false,
      joinedAt: data.joinedAt?.toDate() ?? new Date(),
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
      title: data.title,
      headline: data.headline,
      description: data.description,
      activity: data.activity,
      timeStart: data.timeStart?.toDate(),
      location: data.location,
      preferences: data.preferences,
      // Load chat history from array field
      chatHistory:
        data.chatHistory?.map((msg: FirestoreChatMessage) => ({
          messageId: msg.messageId || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp : (msg.timestamp?.toDate() ?? new Date()),
          eventData: msg.eventData,
        })) || [],
    }

    return { success: true, data: draftEvent }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to load draft event for userId: ${userId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}

/**
 * Loads a specific draft event by eventId
 *
 * @param userId - The unique identifier of the user
 * @param eventId - The unique identifier of the event to load
 * @returns A Promise that resolves to LoadResult with draft event data or error
 */
export async function loadDraftEventById(
  userId: string,
  eventId: string
): Promise<LoadResult<DraftEventData & { eventId: string }>> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const eventRef = doc(db, 'users', userId, 'ownEvents', eventId)
    const docSnap = await getDoc(eventRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Event not found', errorType: 'not-found' }
    }

    const data = docSnap.data()

    // Convert Firestore Timestamps to Dates
    const draftEvent: DraftEventData & { eventId: string } = {
      eventId: docSnap.id,
      role: data.role,
      status: data.status,
      pairRole: data.pairRole,
      isDeleted: data.isDeleted ?? false,
      joinedAt: data.joinedAt?.toDate() ?? new Date(),
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
      title: data.title,
      headline: data.headline,
      description: data.description,
      activity: data.activity,
      timeStart: data.timeStart?.toDate(),
      location: data.location,
      preferences: data.preferences,
      // Load chat history from array field
      chatHistory:
        data.chatHistory?.map((msg: FirestoreChatMessage) => ({
          messageId: msg.messageId || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp : (msg.timestamp?.toDate() ?? new Date()),
          eventData: msg.eventData,
        })) || [],
    }

    return { success: true, data: draftEvent }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to load draft event for userId: ${userId}, eventId: ${eventId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}

/**
 * Saves a batch of chat messages to the draft event's chatHistory array field
 * Uses arrayUnion() for atomic appends without read-before-write
 *
 * @param userId - The unique identifier of the user
 * @param eventId - The unique identifier of the draft event
 * @param messages - Array of chat messages to append (without messageId)
 * @returns A Promise that resolves to SaveResult indicating success or failure
 */
export async function saveChatMessagesBatch(
  userId: string,
  eventId: string,
  messages: Omit<ChatMessageData, 'messageId'>[]
): Promise<SaveResult> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  if (messages.length === 0) {
    return { success: true }
  }

  try {
    const eventRef = doc(db, 'users', userId, 'ownEvents', eventId)

    // Convert messages to Firestore format with messageIds
    const firestoreMessages = messages.map(msg => ({
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: msg.text,
      sender: msg.sender,
      timestamp: Timestamp.fromDate(msg.timestamp),
      ...(msg.eventData && { eventData: msg.eventData }),
    }))

    // Use arrayUnion for atomic append
    await updateDoc(eventRef, {
      chatHistory: arrayUnion(...firestoreMessages),
      updatedAt: Timestamp.fromDate(new Date()),
    })

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'permission-denied') {
        return {
          success: false,
          error: 'Permission denied: You do not have permission to save messages.',
          errorType: 'permission',
        }
      }
      if (error.code === 'not-found') {
        return {
          success: false,
          error: 'Draft event not found',
          errorType: 'not-found',
        }
      }
    }
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to save chat messages batch for userId: ${userId}, eventId: ${eventId}`, error)
    return { success: false, error: `Failed to save chat messages: ${errorMsg}`, errorType: 'network' }
  }
}

/**
 * Updates a draft event document with parsed event data
 *
 * @param userId - The unique identifier of the user
 * @param eventId - The unique identifier of the draft event
 * @param updates - Partial DraftEventData to update
 * @returns A Promise that resolves to SaveResult indicating success or failure
 */
export async function updateDraftEvent(
  userId: string,
  eventId: string,
  updates: Partial<DraftEventData>
): Promise<SaveResult> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const eventRef = doc(db, 'users', userId, 'ownEvents', eventId)

    // Build Firestore updates object - explicitly handle all fields
    const firestoreUpdates: Record<string, unknown> = {
      updatedAt: Timestamp.fromDate(new Date()),
    }

    // Copy all fields from updates, handling Date conversion
    if (updates.title !== undefined) {
      firestoreUpdates.title = updates.title
    }
    if (updates.headline !== undefined) {
      firestoreUpdates.headline = updates.headline
    }
    if (updates.description !== undefined) {
      firestoreUpdates.description = updates.description
    }
    if (updates.activity !== undefined) {
      firestoreUpdates.activity = updates.activity
    }
    if (updates.timeStart !== undefined) {
      // Convert Date to Timestamp
      firestoreUpdates.timeStart = Timestamp.fromDate(updates.timeStart)
    }
    if (updates.location !== undefined) {
      // Save location object even if partially empty (address or city only)
      firestoreUpdates.location = updates.location
    }
    if (updates.preferences !== undefined) {
      firestoreUpdates.preferences = updates.preferences
    }

    await updateDoc(eventRef, firestoreUpdates)

    return { success: true }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to update draft event for userId: ${userId}, eventId: ${eventId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}

/**
 * Marks an event as deleted (soft delete)
 *
 * Updates the event document to set isDeleted to true and updatedAt timestamp.
 * The event data remains in Firestore but will be filtered out from queries.
 *
 * @param userId - The unique identifier of the user
 * @param eventId - The unique identifier of the event to delete
 * @returns A Promise that resolves to SaveResult indicating success or failure
 */
export async function deleteEvent(userId: string, eventId: string): Promise<SaveResult> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const eventRef = doc(db, 'users', userId, 'ownEvents', eventId)

    await updateDoc(eventRef, {
      isDeleted: true,
      updatedAt: Timestamp.fromDate(new Date()),
    })

    return { success: true }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to delete event for userId: ${userId}, eventId: ${eventId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}

/**
 * Loads all events for a user (excluding deleted events)
 *
 * Queries users/{userId}/ownEvents collection for all non-deleted events,
 * ordered by createdAt descending (most recent first).
 *
 * @param userId - The unique identifier of the user
 * @returns A Promise that resolves to LoadResult with array of event data
 */
export async function loadAllEvents(userId: string): Promise<LoadResult<(DraftEventData & { eventId: string })[]>> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const ownEventsRef = collection(db, 'users', userId, 'ownEvents')
    const q = query(ownEventsRef, where('isDeleted', '==', false), orderBy('createdAt', 'desc'))

    const querySnapshot = await getDocs(q)

    const events: (DraftEventData & { eventId: string })[] = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        eventId: docSnap.id,
        role: data.role,
        status: data.status,
        pairRole: data.pairRole,
        isDeleted: data.isDeleted ?? false,
        joinedAt: data.joinedAt?.toDate() ?? new Date(),
        createdAt: data.createdAt?.toDate() ?? new Date(),
        updatedAt: data.updatedAt?.toDate() ?? new Date(),
        title: data.title,
        headline: data.headline,
        description: data.description,
        activity: data.activity,
        timeStart: data.timeStart?.toDate(),
        location: data.location,
        preferences: data.preferences,
        chatHistory:
          data.chatHistory?.map((msg: FirestoreChatMessage) => ({
            messageId: msg.messageId || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : (msg.timestamp?.toDate() ?? new Date()),
            eventData: msg.eventData,
          })) || [],
      }
    })

    return { success: true, data: events }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to load events for userId: ${userId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}
