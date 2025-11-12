import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { loadDraftEventById } from '@/entities/event/event-service'
import { INITIAL_GREETING } from '@/lib/ai'
import type { ChatMessageData } from '@/entities/event/event'

/**
 * Creates initial greeting message
 */
function createGreetingMessage(): ChatMessageData {
  return {
    messageId: 'initial-greeting',
    text: INITIAL_GREETING,
    sender: 'assistant',
    timestamp: new Date(),
  }
}

/**
 * Custom hook to initialize chat state
 *
 * Handles loading chat history from existing events or creating initial greeting.
 * Prevents race conditions by managing state updates atomically.
 *
 * @param userId - User ID (optional)
 * @param eventIdFromState - Event ID from navigation state (optional)
 * @returns Chat initialization state and setters
 */
export function useChatInitialization(userId?: string, eventIdFromState?: string) {
  const [eventId, setEventId] = useState<string | null>(eventIdFromState || null)
  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [isInitializing, setIsInitializing] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeChat = async () => {
      if (!userId) {
        setIsInitializing(false)
        setIsInitialized(true)
        return
      }

      setIsInitializing(true)

      try {
        if (eventIdFromState) {
          // Load specific event's chat history
          setEventId(eventIdFromState)
          const draftResult = await loadDraftEventById(userId, eventIdFromState)

          if (draftResult.success) {
            const chatHistory = draftResult.data.chatHistory || []
            setMessages(chatHistory.length > 0 ? chatHistory : [createGreetingMessage()])
          } else {
            // No draft found, start with greeting
            setMessages([createGreetingMessage()])
          }
        } else {
          // No eventIdFromState: Start with fresh greeting (don't load existing drafts)
          // A new event will be created when the user sends their first message
          setEventId(null)
          setMessages([createGreetingMessage()])
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error)
        toast.error('Failed to load chat history. Please refresh the page.')
        // Start with greeting anyway
        setMessages([createGreetingMessage()])
      } finally {
        setIsInitializing(false)
        setIsInitialized(true)
      }
    }

    initializeChat()
  }, [userId, eventIdFromState])

  return { eventId, setEventId, messages, setMessages, isInitializing, isInitialized }
}
