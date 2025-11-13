/**
 * Invite code data structure for Firestore
 *
 * Represents an invite code document in inviteCodes/{inviteCode}
 * Used for quick lookups when a user clicks an invite link.
 */
export interface InviteCodeData {
  inviteCode: string // The unique invite code (8-12 chars, nanoid)
  eventId: string // Reference to the event being shared
  creatorId: string // User ID of the event creator
  createdAt: Date // When the invite code was generated
  expiresAt: Date // Expiration timestamp (default: 30 days)
  isUsed?: boolean // Whether this invite has been accepted
  usedBy?: string // User ID who accepted the invite
  usedAt?: Date // When the invite was accepted
}

/**
 * Public event preview data for invite page
 *
 * Contains only the public information that unauthenticated users
 * can see when viewing an invite link before signing up.
 */
export interface PublicEventPreview {
  eventId: string
  title?: string
  description?: string
  activity?: string
  timeStart?: Date
  location?: {
    address?: string
    city?: string
  }
  // Hide sensitive information like preferences, chat history, etc.
}
