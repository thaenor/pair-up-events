import { useState, useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { getGeminiModel } from '@/lib/ai'
import { createDraftEvent, updateDraftEvent } from '@/entities/event/event-service'
import { useChatMessageBatching } from '@/hooks/useChatMessageBatching'
import { validateEventData, mapEventPreviewToDraft } from '@/entities/event/event-validation'
import { parseAIResponse } from '@/lib/ai/response-parser'
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
  const [streamingMessage, setStreamingMessage] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState(false)

  // Use ref to track current eventId to prevent race conditions
  const eventIdRef = useRef<string | null>(initialEventId)
  useEffect(() => {
    eventIdRef.current = eventId
  }, [eventId])

  // Ref to track and cancel character-by-character animation
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const streamingCancelledRef = useRef(false)

  // Track if props have been synced once (initialization guard pattern)
  const hasInitializedRef = useRef(false)

  /**
   * Animates text character by character with a typewriter effect
   * @param text - The full text to animate
   * @param delayMs - Delay between each character in milliseconds
   * @returns Promise that resolves when animation completes or is cancelled
   */
  const animateTextCharByChar = useCallback((text: string, delayMs: number = 20): Promise<void> => {
    return new Promise(resolve => {
      streamingCancelledRef.current = false
      let currentIndex = 0

      const displayNextChar = () => {
        if (streamingCancelledRef.current || currentIndex >= text.length) {
          // Animation complete or cancelled
          streamingTimeoutRef.current = null
          resolve()
          return
        }

        currentIndex++
        setStreamingMessage(text.substring(0, currentIndex))

        streamingTimeoutRef.current = setTimeout(displayNextChar, delayMs)
      }

      // Start animation
      displayNextChar()
    })
  }, [])

  // Initialize batching hook
  const { queueMessage } = useChatMessageBatching({
    userId,
    eventId,
    onSaveError: error => {
      console.error('Chat message save error:', error)
    },
  })

  // Cleanup: Cancel streaming animation on unmount
  useEffect(() => {
    return () => {
      streamingCancelledRef.current = true
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current)
        streamingTimeoutRef.current = null
      }
    }
  }, [])

  // Initialization guard: Only sync props once on mount when initialization completes
  // This prevents race conditions where prop updates overwrite local state changes
  // (e.g., user sends message while initialization is still async, or event is created locally)
  useEffect(() => {
    if (!hasInitializedRef.current && isInitialized === true) {
      // Wait for initialMessages to be available before syncing
      // This handles the case where isInitialized becomes true before initialMessages is set
      if (initialMessages.length > 0) {
        setMessages(initialMessages)
        setEventId(initialEventId)
        eventIdRef.current = initialEventId
        hasInitializedRef.current = true
      }
      // If initialMessages is empty but isInitialized is true, still mark as initialized
      // (this handles the case where initialization completes but no messages are available)
      else {
        setEventId(initialEventId)
        eventIdRef.current = initialEventId
        hasInitializedRef.current = true
      }
    }
    // Handle the case where initialMessages becomes available after the guard has run
    // (e.g., if isInitialized became true before initialMessages was populated)
    else if (
      hasInitializedRef.current &&
      isInitialized === true &&
      initialMessages.length > 0 &&
      messages.length === 0
    ) {
      setMessages(initialMessages)
    }
  }, [initialMessages, initialEventId, isInitialized, messages.length])

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

      if (parsed.eventData && validateEventData(parsed.eventData) && currentEventId) {
        const draftUpdates = mapEventPreviewToDraft(parsed.eventData)
        const updateResult = await updateDraftEvent(userId, currentEventId, draftUpdates)
        if (!updateResult.success && 'error' in updateResult) {
          console.error('Failed to update draft event:', updateResult.error)
        }
      }

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

        // Create temporary array for prompt building: include all previous messages plus the user message
        // Note: messages state hasn't updated yet (setState is async), so we manually include userMessage
        const currentMessages = [...messages, userMessage]
        const prompt = buildAIPrompt(userProfile, currentMessages, text)

        // Call AI with streaming - collect full response first
        let fullResponseText = ''

        const stream = await model.generateContentStream(prompt)

        // Collect all chunks into full response
        for await (const chunk of stream.stream) {
          const chunkText = chunk.text()
          if (chunkText) {
            fullResponseText += chunkText
          }
        }

        if (!fullResponseText) {
          throw new Error('AI returned empty response')
        }

        // Parse response to extract clean text (strips JSON metadata)
        const parsed = parseAIResponse(fullResponseText)
        const cleanText = parsed.cleanedText

        // Animate the clean text character by character
        setIsStreaming(true)
        setStreamingMessage('')
        await animateTextCharByChar(cleanText, 20) // 20ms per character

        // Animation complete
        setIsStreaming(false)
        setStreamingMessage('')

        // Process response using current messages state
        const { assistantMessage } = await processAIResponse(fullResponseText, currentMessages, currentEventId)

        // Add assistant message to UI and stop loading atomically
        // This prevents race condition where isLoading=true with AI message already in array
        setMessages(prev => {
          // Set loading to false synchronously with message addition
          setIsLoading(false)
          return [...prev, assistantMessage]
        })

        // Queue assistant message
        queueMessage({
          text: assistantMessage.text,
          sender: assistantMessage.sender,
          timestamp: assistantMessage.timestamp,
          eventData: assistantMessage.eventData,
        })
      } catch (error) {
        // Cancel any ongoing animation
        streamingCancelledRef.current = true
        if (streamingTimeoutRef.current) {
          clearTimeout(streamingTimeoutRef.current)
          streamingTimeoutRef.current = null
        }

        handleMessageError(error, userMessage.messageId)
        setIsLoading(false)
        setIsStreaming(false)
        setStreamingMessage('')
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
      animateTextCharByChar,
    ]
  )

  return { messages, sendMessage, isLoading, eventId, streamingMessage, isStreaming }
}
