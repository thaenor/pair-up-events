import type { EventPreviewData } from '@/components/molecules/Events/EventPreviewCard'

/**
 * Draft event data structure for Firestore
 *
 * Represents a draft event document in users/{userId}/ownEvents/{eventId}
 * Only exists when status="draft" during event creation.
 */
export interface DraftEventData {
  eventId: string
  role: 'creator'
  status: 'draft'
  pairRole: 'userA'
  isDeleted: boolean
  joinedAt: Date
  createdAt: Date
  updatedAt: Date
  // Optional draft fields
  title?: string
  headline?: string
  description?: string
  activity?: string
  timeStart?: Date
  location?: {
    address?: string
    city?: string
  }
  preferences?: Partial<EventPreferences>
  // Chat history array - stores AI conversation messages during event creation
  chatHistory?: ChatMessageData[]
}

/**
 * Chat message data structure for Firestore
 *
 * Represents a chat message stored in the draft event's chatHistory array field.
 * Used for persisting AI conversation history during event creation.
 */
export interface ChatMessageData {
  messageId: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
  eventData?: EventPreviewData // Included if AI returned parseable event data
}

/**
 * Event preferences structure
 *
 * Defines matching preferences for the event, including duo types,
 * desired vibes, and optional age range (from user profile).
 */
export interface EventPreferences {
  userDuoType: 'friends' | 'couples' | 'family' | 'roommates' | 'colleagues'
  preferredDuoType: 'friends' | 'couples' | 'family' | 'roommates' | 'colleagues'
  desiredVibes: string[]
  ageRange?: { min: number; max: number }
}

/**
 * Re-export EventPreviewData for convenience
 */
export type { EventPreviewData }
