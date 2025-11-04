import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'
import useRequireAuth from '@/hooks/useRequireAuth'
import useAuth from '@/hooks/useAuth'
import { useUserProfile } from '@/contexts/UserContext'
import { getGeminiModel, EVENT_ORGANIZER_SYSTEM_PROMPT, INITIAL_GREETING } from '@/lib/ai'
import {
  createDraftEvent,
  loadDraftEvent,
  saveChatMessage,
  loadChatHistory,
  updateDraftEvent,
} from '@/entities/event/event-service'
import { validateEventData, mapEventPreviewToDraft } from '@/entities/event/event-validation'
import type { ChatMessageData, EventPreviewData } from '@/entities/event/event'
import ChatInterface from '@/components/organisms/Events/ChatInterface'

/**
 * Parses event data from AI response text
 *
 * Searches for EVENT_DATA_START and EVENT_DATA_END markers in the AI response
 * and extracts the JSON event data between them.
 *
 * @param text - AI response text to parse
 * @returns Parsed EventPreviewData or null if not found or invalid
 */
function parseEventDataFromResponse(text: string): EventPreviewData | null {
  try {
    const startMarker = 'EVENT_DATA_START'
    const endMarker = 'EVENT_DATA_END'
    const startIdx = text.indexOf(startMarker)
    const endIdx = text.indexOf(endMarker)

    if (startIdx === -1 || endIdx === -1) return null

    const jsonStr = text.substring(startIdx + startMarker.length, endIdx).trim()
    const parsed = JSON.parse(jsonStr)

    // Validate structure matches EventPreviewData
    if (!parsed.title || !parsed.activity) {
      return null
    }

    return parsed as EventPreviewData
  } catch (error) {
    console.error('Failed to parse event data:', error)
    return null
  }
}

const EventsCreatePage: React.FC = () => {
  const { loading: authLoading } = useRequireAuth()
  const { user } = useAuth()
  const { userProfile } = useUserProfile()
  const navigate = useNavigate()
  const location = useLocation()

  const [messages, setMessages] = useState<ChatMessageData[]>([])
  const [eventId, setEventId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize chat on mount
  useEffect(() => {
    const initializeChat = async () => {
      if (authLoading || !user?.uid) {
        return
      }

      setIsInitializing(true)

      try {
        // Check if eventId was passed via navigation state
        const stateEventId = location.state?.eventId as string | undefined

        if (stateEventId) {
          // Load specific event's chat history
          setEventId(stateEventId)
          const historyResult = await loadChatHistory(user.uid, stateEventId)

          if (historyResult.success && historyResult.data.length > 0) {
            // Convert history messages to ChatMessageData format
            const chatMessages: ChatMessageData[] = historyResult.data
            setMessages(chatMessages)
          } else {
            // No history found, start fresh with greeting
            const greetingMessage: ChatMessageData = {
              messageId: 'initial-greeting',
              text: INITIAL_GREETING,
              sender: 'assistant',
              timestamp: new Date(),
            }
            setMessages([greetingMessage])
          }
        } else {
          // Check for existing draft event (earliest one)
          const draftResult = await loadDraftEvent(user.uid)

          if (draftResult.success) {
            // Load existing chat history
            setEventId(draftResult.data.eventId)
            const historyResult = await loadChatHistory(user.uid, draftResult.data.eventId)

            if (historyResult.success && historyResult.data.length > 0) {
              // Convert history messages to ChatMessageData format
              const chatMessages: ChatMessageData[] = historyResult.data
              setMessages(chatMessages)
            } else {
              // No history found, start fresh with greeting
              const greetingMessage: ChatMessageData = {
                messageId: 'initial-greeting',
                text: INITIAL_GREETING,
                sender: 'assistant',
                timestamp: new Date(),
              }
              setMessages([greetingMessage])
            }
          } else {
            // No draft found, start with greeting (don't save yet)
            const greetingMessage: ChatMessageData = {
              messageId: 'initial-greeting',
              text: INITIAL_GREETING,
              sender: 'assistant',
              timestamp: new Date(),
            }
            setMessages([greetingMessage])
          }
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error)
        toast.error('Failed to load chat history. Please refresh the page.')
        // Start with greeting anyway
        const greetingMessage: ChatMessageData = {
          messageId: 'initial-greeting',
          text: INITIAL_GREETING,
          sender: 'assistant',
          timestamp: new Date(),
        }
        setMessages([greetingMessage])
      } finally {
        setIsInitializing(false)
      }
    }

    initializeChat()
  }, [authLoading, user?.uid, location.state])

  // Handle message sending
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!user?.uid || isLoading) return

      try {
        // Create user message
        const userMessage: ChatMessageData = {
          messageId: `user-${Date.now()}`,
          text,
          sender: 'user',
          timestamp: new Date(),
        }

        // Add user message to UI immediately
        setMessages(prev => [...prev, userMessage])

        // If this is the first message and no eventId exists, create draft event
        if (!eventId) {
          const draftResult = await createDraftEvent(user.uid)
          if (!draftResult.success) {
            toast.error('Failed to create draft event')
            setMessages(prev => prev.filter(msg => msg.messageId !== userMessage.messageId))
            return
          }
          setEventId(draftResult.data)
        }

        // Save user message to Firestore
        if (eventId) {
          await saveChatMessage(user.uid, eventId, {
            text: userMessage.text,
            sender: userMessage.sender,
            timestamp: userMessage.timestamp,
          })
        }

        setIsLoading(true)

        // Build AI context
        const model = getGeminiModel()
        if (!model) {
          toast.error('AI service is unavailable')
          setIsLoading(false)
          return
        }

        // Build system prompt with user context
        let systemPrompt = EVENT_ORGANIZER_SYSTEM_PROMPT

        // Add user context if available
        if (userProfile?.public) {
          const userInfo = [
            `User Information:`,
            `- Name: ${userProfile.public.firstName}`,
            userProfile.public.age ? `- Age: ${userProfile.public.age}` : '',
            userProfile.private?.hobbies ? `- Hobbies: ${userProfile.private.hobbies}` : '',
            userProfile.private?.preferences?.preferredVibes
              ? `- Preferred vibes: ${userProfile.private.preferences.preferredVibes.join(', ')}`
              : '',
          ]
            .filter(Boolean)
            .join('\n')

          systemPrompt = `${userInfo}\n\n${systemPrompt}`
        }

        // Add current date context
        const today = new Date().toISOString().split('T')[0]
        systemPrompt = `${systemPrompt}\n\nCurrent Date Context: Today is ${today}`

        // Build conversation history for AI context
        // Format: "User: message\nAssistant: response\nUser: next message..."
        let conversationContext = ''
        messages.forEach(msg => {
          const roleLabel = msg.sender === 'user' ? 'User' : 'Assistant'
          conversationContext += `${roleLabel}: ${msg.text}\n`
        })
        // Add current user message
        conversationContext += `User: ${text}\n`

        // Build full prompt with conversation history
        const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationContext}\n\nAssistant:`

        // Call Gemini AI
        const result = await model.generateContent(fullPrompt)
        // Get response text - handle different Firebase AI SDK response formats
        let responseText = ''
        if (result.response) {
          if (typeof result.response.text === 'function') {
            responseText = result.response.text()
          } else if (typeof result.response.text === 'string') {
            responseText = result.response.text
          } else if (result.response.candidates && result.response.candidates[0]?.content?.parts?.[0]?.text) {
            responseText = result.response.candidates[0].content.parts[0].text
          }
        }

        // Parse event data from response
        const eventData = parseEventDataFromResponse(responseText)

        // Validate and update draft event if eventData is valid
        if (eventData && validateEventData(eventData)) {
          const draftUpdates = mapEventPreviewToDraft(eventData)
          if (eventId) {
            const updateResult = await updateDraftEvent(user.uid, eventId, draftUpdates)
            if (!updateResult.success && 'error' in updateResult) {
              console.error('Failed to update draft event:', updateResult.error)
              // Continue anyway - chat message still saved
            }
          }
        } else if (eventData) {
          console.warn('Invalid event data received from AI:', eventData)
          // Still include in message for debugging
        }

        // Create assistant message
        const assistantMessage: ChatMessageData = {
          messageId: `assistant-${Date.now()}`,
          text: responseText,
          sender: 'assistant',
          timestamp: new Date(),
          eventData: eventData || undefined,
        }

        // Add assistant message to UI
        setMessages(prev => [...prev, assistantMessage])

        // Save assistant message to Firestore
        if (eventId) {
          await saveChatMessage(user.uid, eventId, {
            text: assistantMessage.text,
            sender: assistantMessage.sender,
            timestamp: assistantMessage.timestamp,
            eventData: assistantMessage.eventData,
          })
        }
      } catch (error) {
        console.error('Failed to send message:', error)
        toast.error('AI assistant is unavailable, please try again')
        // Remove the most recent user message from UI if error occurred
        setMessages(prev => {
          // Find last user message index
          let lastUserMsgIndex = -1
          for (let i = prev.length - 1; i >= 0; i--) {
            if (prev[i].sender === 'user') {
              lastUserMsgIndex = i
              break
            }
          }
          if (lastUserMsgIndex !== -1) {
            return prev.filter((_, idx) => idx !== lastUserMsgIndex)
          }
          return prev
        })
      } finally {
        setIsLoading(false)
      }
    },
    [user?.uid, eventId, messages, userProfile, isLoading]
  )

  // Handle event confirmation
  const handleConfirmEvent = useCallback((eventData: EventPreviewData) => {
    console.log('Event confirmed:', eventData)
    toast.info('Event confirmation - to be implemented')
  }, [])

  // Handle chat interface errors gracefully
  const handleChatError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Chat interface error:', error, errorInfo)
    toast.error('Chat interface encountered an error. Please refresh the page.')
  }, [])

  if (authLoading || isInitializing) {
    return (
      <div className="min-h-screen bg-pairup-cream flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user?.uid) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
        <div className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-pairup-darkBlue">Create Event</h1>
          {userProfile?.public?.firstName && (
            <p className="text-pairup-darkBlue/70 mt-2">Hey {userProfile.public.firstName}, let's create your event!</p>
          )}
        </div>
        <ErrorBoundary onError={handleChatError}>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onConfirmEvent={handleConfirmEvent}
          />
        </ErrorBoundary>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default EventsCreatePage
