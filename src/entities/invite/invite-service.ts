import { doc, getDoc, setDoc, Timestamp, updateDoc } from 'firebase/firestore'
import { nanoid } from 'nanoid'
import { db } from '@/lib/firebase'
import type { InviteCodeData, PublicEventPreview } from './invite'
import type { DraftEventData } from '../event/event'

/**
 * Generate a unique invite code using nanoid
 * @param length Length of the invite code (default: 10)
 * @returns A URL-safe unique invite code
 */
export function generateInviteCode(length = 10): string {
  return nanoid(length)
}

/**
 * Create an invite link for an event
 * Generates a unique invite code and stores it in Firestore
 *
 * @param eventId The event ID to create an invite for
 * @param creatorId The user ID of the event creator
 * @param expirationDays Number of days until the invite expires (default: 30)
 * @returns The full invite URL
 */
export async function createInviteLink(eventId: string, creatorId: string, expirationDays = 30): Promise<string> {
  // Generate unique invite code
  const inviteCode = generateInviteCode(10)

  // Calculate expiration date
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expirationDays)

  if (!db) {
    throw new Error('Firestore database is not initialized')
  }

  // Create invite code document
  const inviteCodeData: InviteCodeData = {
    inviteCode,
    eventId,
    creatorId,
    createdAt: new Date(),
    expiresAt,
    isUsed: false,
  }

  // Store in Firestore
  const inviteCodeRef = doc(db, 'inviteCodes', inviteCode)
  await setDoc(inviteCodeRef, {
    ...inviteCodeData,
    createdAt: Timestamp.fromDate(inviteCodeData.createdAt),
    expiresAt: Timestamp.fromDate(inviteCodeData.expiresAt),
  })

  // Generate full URL
  const baseUrl = window.location.origin
  return `${baseUrl}/accept-invite?eventId=${eventId}&inviteCode=${inviteCode}`
}

/**
 * Validate an invite code
 * Checks if the code exists, is not expired, and has not been used
 *
 * @param inviteCode The invite code to validate
 * @returns The invite code data if valid, null otherwise
 */
export async function validateInviteCode(inviteCode: string): Promise<InviteCodeData | null> {
  if (!db) {
    return null
  }

  try {
    const inviteCodeRef = doc(db, 'inviteCodes', inviteCode)
    const inviteCodeSnap = await getDoc(inviteCodeRef)

    if (!inviteCodeSnap.exists()) {
      return null
    }

    const data = inviteCodeSnap.data()
    const inviteData: InviteCodeData = {
      inviteCode: data.inviteCode,
      eventId: data.eventId,
      creatorId: data.creatorId,
      createdAt: data.createdAt.toDate(),
      expiresAt: data.expiresAt.toDate(),
      isUsed: data.isUsed || false,
      usedBy: data.usedBy,
      usedAt: data.usedAt?.toDate(),
    }

    // Check if expired
    if (inviteData.expiresAt < new Date()) {
      return null
    }

    // Check if already used
    if (inviteData.isUsed) {
      return null
    }

    return inviteData
  } catch (error) {
    console.error('Error validating invite code:', error)
    return null
  }
}

/**
 * Mark an invite code as used
 *
 * @param inviteCode The invite code to mark as used
 * @param userId The user ID who used the invite
 */
export async function markInviteAsUsed(inviteCode: string, userId: string): Promise<void> {
  if (!db) {
    throw new Error('Firestore database is not initialized')
  }

  const inviteCodeRef = doc(db, 'inviteCodes', inviteCode)
  await updateDoc(inviteCodeRef, {
    isUsed: true,
    usedBy: userId,
    usedAt: Timestamp.now(),
  })
}

/**
 * Get public event preview data for an invite
 * Returns only non-sensitive information that can be shown to unauthenticated users
 *
 * @param eventId The event ID
 * @param creatorId The creator's user ID
 * @returns Public event preview data
 */
export async function getPublicEventPreview(eventId: string, creatorId: string): Promise<PublicEventPreview | null> {
  if (!db) {
    return null
  }

  try {
    const eventRef = doc(db, 'users', creatorId, 'ownEvents', eventId)
    const eventSnap = await getDoc(eventRef)

    if (!eventSnap.exists()) {
      return null
    }

    const eventData = eventSnap.data() as DraftEventData

    // Return only public fields
    return {
      eventId: eventData.eventId,
      title: eventData.title,
      description: eventData.description,
      activity: eventData.activity,
      timeStart: eventData.timeStart,
      location: eventData.location,
    }
  } catch (error) {
    console.error('Error fetching public event preview:', error)
    return null
  }
}
