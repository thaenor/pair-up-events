import { collection, query, where, getDocs, orderBy, addDoc, doc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { DraftEventData, ChatMessageData } from './event'

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
      description: data.description,
      activity: data.activity,
      timeStart: data.timeStart?.toDate(),
      location: data.location,
      preferences: data.preferences,
    }

    return { success: true, data: draftEvent }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to load draft event for userId: ${userId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}

/**
 * Saves a chat message to Firestore users/{userId}/ownEvents/{eventId}/chatHistory/{messageId}
 *
 * @param userId - The unique identifier of the user
 * @param eventId - The unique identifier of the draft event
 * @param message - Chat message data to save (without messageId)
 * @returns A Promise that resolves to SaveResult indicating success or failure
 */
export async function saveChatMessage(
  userId: string,
  eventId: string,
  message: Omit<ChatMessageData, 'messageId'>
): Promise<SaveResult> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const chatHistoryRef = collection(db, 'users', userId, 'ownEvents', eventId, 'chatHistory')

    // Convert Date to Timestamp
    const firestoreData = {
      text: message.text,
      sender: message.sender,
      timestamp: Timestamp.fromDate(message.timestamp),
      ...(message.eventData && { eventData: message.eventData }),
    }

    await addDoc(chatHistoryRef, firestoreData)

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'permission-denied') {
        return {
          success: false,
          error: 'Permission denied: You do not have permission to save this message.',
          errorType: 'permission',
        }
      }
    }
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to save chat message for userId: ${userId}, eventId: ${eventId}`, error)
    return { success: false, error: `Failed to save chat message: ${errorMsg}`, errorType: 'network' }
  }
}

/**
 * Loads all chat messages for a draft event, ordered by timestamp ascending
 *
 * @param userId - The unique identifier of the user
 * @param eventId - The unique identifier of the draft event
 * @returns A Promise that resolves to LoadResult with array of chat messages
 */
export async function loadChatHistory(userId: string, eventId: string): Promise<LoadResult<ChatMessageData[]>> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const chatHistoryRef = collection(db, 'users', userId, 'ownEvents', eventId, 'chatHistory')
    const q = query(chatHistoryRef, orderBy('timestamp', 'asc'))

    const querySnapshot = await getDocs(q)

    const messages: ChatMessageData[] = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data()
      return {
        messageId: docSnap.id,
        text: data.text,
        sender: data.sender,
        timestamp: data.timestamp?.toDate() ?? new Date(),
        eventData: data.eventData,
      }
    })

    return { success: true, data: messages }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to load chat history for userId: ${userId}, eventId: ${eventId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
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

    const firestoreUpdates: Record<string, unknown> = {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    }

    // Convert Date fields to Timestamps
    if (updates.timeStart) {
      firestoreUpdates.timeStart = Timestamp.fromDate(updates.timeStart)
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
        description: data.description,
        activity: data.activity,
        timeStart: data.timeStart?.toDate(),
        location: data.location,
        preferences: data.preferences,
      }
    })

    return { success: true, data: events }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to load events for userId: ${userId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}
