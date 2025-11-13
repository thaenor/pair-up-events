import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Button } from '@/components/atoms/button'
import SkipLink from '@/components/atoms/skip-link'
import useRequireAuth from '@/hooks/useRequireAuth'
import useAuth from '@/hooks/useAuth'
import { useUserProfile } from '@/contexts/UserContext'
import { useChatInitialization } from '@/hooks/useChatInitialization'
import { useAIChat } from '@/hooks/useAIChat'
import ChatInterface from '@/components/organisms/Events/ChatInterface'
import type { EventPreviewData } from '@/entities/event/event'

const EventsCreatePage: React.FC = () => {
  const { loading: authLoading } = useRequireAuth()
  const { user } = useAuth()
  const { userProfile } = useUserProfile()
  const navigate = useNavigate()
  const location = useLocation()

  // Get eventId from navigation state if present
  const stateEventId = location.state?.eventId as string | undefined

  // Initialize chat state
  const {
    eventId,
    messages: initialMessages,
    isInitializing,
    isInitialized,
  } = useChatInitialization(user?.uid, stateEventId)

  // Handle AI chat functionality
  const { messages, sendMessage, isLoading, streamingMessage, isStreaming } = useAIChat(
    user?.uid || '',
    eventId,
    initialMessages,
    userProfile,
    isInitialized
  )

  // Handle event confirmation - generate invite link and copy to clipboard
  const handleConfirmEvent = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Parameter required by callback signature
    async (_eventData: EventPreviewData) => {
      if (!user?.uid || !eventId) {
        console.error('User or eventId not available')
        return
      }

      try {
        // Generate invite link
        const { publishEventWithInvite } = await import('@/entities/event/event-service')
        const result = await publishEventWithInvite(user.uid, eventId)

        if (result.success) {
          // Copy to clipboard
          await navigator.clipboard.writeText(result.data)
          console.log('Invite link copied to clipboard:', result.data)
          // TODO: Show success toast
          alert('Invite link copied to clipboard!')
        } else {
          console.error('Failed to generate invite link:', result.error)
          alert('Failed to generate invite link. Please try again.')
        }
      } catch (error) {
        console.error('Error generating invite link:', error)
        alert('An error occurred. Please try again.')
      }
    },
    [user?.uid, eventId]
  )

  // Handle chat interface errors gracefully
  const handleChatError = React.useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Chat interface error:', error, errorInfo)
    // Error handling is done in hooks
  }, [])

  // Handle back navigation
  const handleBack = React.useCallback(() => {
    navigate('/events')
  }, [navigate])

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
      <SkipLink targetId="chat-interface" label="Skip to chat interface" />
      <Navigation />
      <main
        className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8"
        role="main"
        aria-label="Create event page"
      >
        <div className="mb-2 md:mb-4">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={handleBack}
            className="mb-2 md:mb-4 text-pairup-darkBlue hover:bg-pairup-darkBlue/10 focus:ring-pairup-darkBlue"
            aria-label="Back to events"
          >
            Back to Events
          </Button>
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-pairup-darkBlue">Create Event</h1>
            {userProfile?.public?.firstName && (
              <p className="text-pairup-darkBlue/70 mt-1 md:mt-2 hidden md:block">
                Hey {userProfile.public.firstName}, let's create your event!
              </p>
            )}
          </div>
        </div>
        <ErrorBoundary onError={handleChatError}>
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            streamingMessage={streamingMessage}
            isStreaming={isStreaming}
            onConfirmEvent={handleConfirmEvent}
          />
        </ErrorBoundary>
      </main>
      <MobileBottomNavigation />
    </div>
  )
}

export default EventsCreatePage
