import { z } from 'zod'
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
  // Invite fields - for sharing events with others
  inviteCode?: string // 8-12 character unique code (nanoid)
  shareStatus?: 'draft' | 'shared' | 'accepted' // Event sharing lifecycle
  sharedAt?: Date // Timestamp when invite link was generated
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

const duoTypeSchema = z.enum(['friends', 'couples', 'family', 'roommates', 'colleagues'])

export const draftEventDataSchema = z.object({
  eventId: z.string(),
  role: z.literal('creator'),
  status: z.string(),
  pairRole: z.literal('userA'),
  isDeleted: z.boolean(),
  joinedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  inviteCode: z.string().optional(),
  shareStatus: z.enum(['draft', 'shared', 'accepted']).optional(),
  sharedAt: z.date().optional(),
  title: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  activity: z.string().optional(),
  timeStart: z.date().optional(),
  location: z
    .object({
      address: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),
  preferences: z
    .object({
      userDuoType: duoTypeSchema.optional(),
      preferredDuoType: duoTypeSchema.optional(),
      desiredVibes: z.array(z.string()).optional(),
      ageRange: z.object({ min: z.number(), max: z.number() }).optional(),
    })
    .optional(),
  chatHistory: z
    .array(
      z.object({
        messageId: z.string(),
        text: z.string(),
        sender: z.enum(['user', 'assistant']),
        timestamp: z.date(),
        eventData: z.unknown().optional(),
      })
    )
    .optional(),
})

/**
 * Re-export EventPreviewData for convenience
 */
export type { EventPreviewData }
