import { useState, useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { getGeminiModel } from '@/lib/ai'
import { createDraftEvent, updateDraftEvent } from '@/entities/event/event-service'
import { useChatMessageBatching } from '@/hooks/useChatMessageBatching'
import { validateEventData, mapEventPreviewToDraft } from '@/entities/event/event-validation'
import { parseAIResponse } from '@/lib/ai/response-parser'
import { extractResponseText } from '@/lib/ai/response-extractor'
import { buildAIPrompt } from '@/lib/ai/prompt-builder'
import type { ChatMessageData, EventPreviewData } from '@/entities/event/event'
import type { UserProfileData } from '@/entities/user'

/**
 * Custom hook for AI chat functionality
 *
 * Manages chat state, message sending, AI interactions, and event updates.
 * Prevents race conditions by using refs for eventId and managing state updates atomically.
 * Uses initialization guard pattern to prevent prop syncing from overwriting local state changes.
 *
 * @param userId - User ID
 * @param initialEventId - Initial event ID (may be null)
 * @param initialMessages - Initial chat messages
 * @param userProfile - User profile data (optional)
 * @param isInitialized - Flag indicating initialization is complete (prevents race conditions)
 * @returns Chat state and sendMessage function
 */
export function useAIChat(
  userId: string,
  initialEventId: string | null,
  initialMessages: ChatMessageData[],
  userProfile: UserProfileData | null,
  isInitialized?: boolean
) {
  const [eventId, setEventId] = useState<string | null>(initialEventId)
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)

  // Use ref to track current eventId to prevent race conditions
  const eventIdRef = useRef<string | null>(initialEventId)
  useEffect(() => {
    eventIdRef.current = eventId
  }, [eventId])

  // Track if props have been synced once (initialization guard pattern)
  const hasInitializedRef = useRef(false)

  // Initialize batching hook
  const { queueMessage } = useChatMessageBatching({
    userId,
    eventId,
    onSaveError: error => {
      console.error('Chat message save error:', error)
    },
  })

  // Initialization guard: Only sync props once on mount when initialization completes
  // This prevents race conditions where prop updates overwrite local state changes
  // (e.g., user sends message while initialization is still async, or event is created locally)
  useEffect(() => {
    // Sync when initialization completes AND we have messages to sync
    // This ensures the initial greeting message is displayed
    // Check both isInitialized flag and that we have messages to avoid syncing empty arrays
    if (!hasInitializedRef.current && isInitialized === true && initialMessages.length > 0) {
      setMessages(initialMessages)
      setEventId(initialEventId)
      eventIdRef.current = initialEventId
      hasInitializedRef.current = true
    }
  }, [initialMessages, initialEventId, isInitialized])

  /**
   * Creates a user message object
   */
  const createUserMessage = useCallback((text: string): ChatMessageData => {
    return {
      messageId: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    }
  }, [])

  /**
   * Ensures eventId exists, creating a draft event if needed
   */
  const ensureEventId = useCallback(
    async (currentEventId: string | null): Promise<string | null> => {
      if (currentEventId) {
        return currentEventId
      }

      const draftResult = await createDraftEvent(userId)
      if (!draftResult.success) {
        toast.error('Failed to create draft event')
        return null
      }

      const newEventId = draftResult.data
      setEventId(newEventId)
      eventIdRef.current = newEventId

      // Save greeting message now that we have eventId
      const greetingMessage = messages.find(msg => msg.messageId === 'initial-greeting')
      if (greetingMessage) {
        queueMessage({
          text: greetingMessage.text,
          sender: greetingMessage.sender,
          timestamp: greetingMessage.timestamp,
        })
      }

      return newEventId
    },
    [userId, messages, queueMessage]
  )

  /**
   * Processes AI response and updates event if needed
   */
  const processAIResponse = useCallback(
    async (
      responseText: string,
      currentMessages: ChatMessageData[],
      currentEventId: string | null
    ): Promise<{
      assistantMessage: ChatMessageData
      titleHeadline?: { title: string; headline: string }
      eventData?: EventPreviewData
    }> => {
      // Parse AI response
      const parsed = parseAIResponse(responseText)

      // Check if this is the first AI response (no assistant messages except greeting)
      const hasAssistantMessages = currentMessages.some(
        msg => msg.sender === 'assistant' && msg.messageId !== 'initial-greeting'
      )
      const isFirstAIResponse = !hasAssistantMessages

      // Save title/headline if this is the first AI response
      if (isFirstAIResponse && parsed.titleHeadline && currentEventId) {
        const updateResult = await updateDraftEvent(userId, currentEventId, {
          title: parsed.titleHeadline.title,
          headline: parsed.titleHeadline.headline,
        })
        if (!updateResult.success && 'error' in updateResult) {
          console.error('Failed to update draft event with title/headline:', updateResult.error)
        }
      }

      // Update event if eventData is valid
      if (parsed.eventData && validateEventData(parsed.eventData) && currentEventId) {
        const draftUpdates = mapEventPreviewToDraft(parsed.eventData)
        // Log what fields are being saved for debugging
        console.log('Saving event data to Firestore:', {
          eventId: currentEventId,
          fields: Object.keys(draftUpdates),
          hasTitle: !!draftUpdates.title,
          hasHeadline: !!draftUpdates.headline,
          hasDescription: !!draftUpdates.description,
          hasActivity: !!draftUpdates.activity,
          hasTimeStart: !!draftUpdates.timeStart,
          hasLocation: !!draftUpdates.location,
          hasPreferences: !!draftUpdates.preferences,
        })
        const updateResult = await updateDraftEvent(userId, currentEventId, draftUpdates)
        if (!updateResult.success && 'error' in updateResult) {
          console.error('Failed to update draft event:', updateResult.error)
        } else {
          console.log('Successfully saved event data to Firestore')
        }
      } else if (parsed.eventData) {
        console.warn('Invalid event data received from AI:', parsed.eventData)
      }

      // Create assistant message
      const assistantMessage: ChatMessageData = {
        messageId: `assistant-${Date.now()}`,
        text: parsed.cleanedText,
        sender: 'assistant',
        timestamp: new Date(),
        eventData: parsed.eventData,
      }

      return {
        assistantMessage,
        titleHeadline: parsed.titleHeadline,
        eventData: parsed.eventData,
      }
    },
    [userId]
  )

  /**
   * Handles message sending errors
   */
  const handleMessageError = useCallback((error: unknown, userMessageId: string) => {
    console.error('Failed to send message:', error)
    toast.error('AI assistant is unavailable, please try again')
    // Remove the user message from UI if error occurred
    setMessages(prev => prev.filter(msg => msg.messageId !== userMessageId))
  }, [])

  /**
   * Sends a message to the AI and processes the response
   */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!userId || isLoading) return

      // Create user message
      const userMessage = createUserMessage(text)

      // Add user message to UI immediately
      setMessages(prev => [...prev, userMessage])

      try {
        // Ensure eventId exists (create if needed)
        const currentEventId = await ensureEventId(eventIdRef.current)
        if (!currentEventId) {
          // Failed to create event, error already shown
          setMessages(prev => prev.filter(msg => msg.messageId !== userMessage.messageId))
          return
        }

        // Queue user message
        queueMessage({
          text: userMessage.text,
          sender: userMessage.sender,
          timestamp: userMessage.timestamp,
        })

        setIsLoading(true)

        // Build AI prompt
        const model = getGeminiModel()
        if (!model) {
          toast.error('AI service is unavailable')
          setIsLoading(false)
          setMessages(prev => prev.filter(msg => msg.messageId !== userMessage.messageId))
          return
        }

        // Use current messages state (including the user message we just added)
        const currentMessages = [...messages, userMessage]
        const prompt = buildAIPrompt(userProfile, currentMessages, text)

        // Call AI
        const result = await model.generateContent(prompt)
        const responseText = extractResponseText(result)

        if (!responseText) {
          throw new Error('AI returned empty response')
        }

        // Process response using current messages state
        const { assistantMessage } = await processAIResponse(responseText, currentMessages, currentEventId)

        // Add assistant message to UI
        setMessages(prev => [...prev, assistantMessage])

        // Queue assistant message
        queueMessage({
          text: assistantMessage.text,
          sender: assistantMessage.sender,
          timestamp: assistantMessage.timestamp,
          eventData: assistantMessage.eventData,
        })
      } catch (error) {
        handleMessageError(error, userMessage.messageId)
      } finally {
        setIsLoading(false)
      }
    },
    [
      userId,
      messages,
      userProfile,
      isLoading,
      createUserMessage,
      ensureEventId,
      queueMessage,
      processAIResponse,
      handleMessageError,
    ]
  )

  return { messages, sendMessage, isLoading, eventId }
}
