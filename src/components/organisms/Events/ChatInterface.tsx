import React, { useMemo, useState, useEffect } from 'react'
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar,
} from '@chatscope/chat-ui-kit-react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import type { ChatMessageData, EventPreviewData } from '@/entities/event/event'
import EventPreviewCard from '@/components/molecules/Events/EventPreviewCard'
import { useUserProfile } from '@/contexts/UserContext'

// Layout constants for responsive design
// Mobile: Top nav (~96px) + page header (~80px) + bottom nav (~70px) + buffer (~24px) = ~270px
const MOBILE_HEADER_FOOTER_HEIGHT = 270 // Header + footer height on mobile
const DESKTOP_HEADER_FOOTER_HEIGHT = 180 // Header + footer height on desktop

/**
 * Props for ChatInterface component
 */
interface ChatInterfaceProps {
  messages: ChatMessageData[]
  onSendMessage: (text: string) => void
  isLoading: boolean
  onConfirmEvent?: (eventData: EventPreviewData) => void
}

/**
 * Formats timestamp to human-readable format
 */
const formatTimestamp = (timestamp: Date): string => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Determines message position for grouping
 */
const getMessagePosition = (
  index: number,
  total: number,
  messages: ChatMessageData[]
): 'single' | 'first' | 'last' | 'normal' => {
  if (total === 1) return 'single'

  const currentMessage = messages[index]
  const prevMessage = index > 0 ? messages[index - 1] : null
  const nextMessage = index < total - 1 ? messages[index + 1] : null

  const isSameSender = (msg1: ChatMessageData | null, msg2: ChatMessageData) => {
    return msg1?.sender === msg2.sender
  }

  const isFirstInGroup = !prevMessage || !isSameSender(prevMessage, currentMessage)
  const isLastInGroup = !nextMessage || !isSameSender(nextMessage, currentMessage)

  if (isFirstInGroup && isLastInGroup) return 'single'
  if (isFirstInGroup) return 'first'
  if (isLastInGroup) return 'last'
  return 'normal'
}

/**
 * Renders avatar component for a message
 * Uses User icon when no profile picture is available or when image fails to load
 */
const renderAvatar = (
  isUser: boolean,
  avatarSrc: string | undefined,
  avatarName: string,
  imageError: boolean
): React.ReactElement => {
  const isAI = !isUser

  // For AI avatars, use ChatScope Avatar (logo should always load)
  if (isAI) {
    if (!avatarSrc) {
      return <Avatar name="AI" size="md" data-ai-avatar="true" />
    }
    return <Avatar src={avatarSrc} name={avatarName} size="md" data-ai-avatar="true" />
  }

  // For user avatars, handle missing src or broken images
  // If image fails or no src, use data-user-fallback to show User icon via CSS
  const userAvatarSrc = !avatarSrc || imageError ? undefined : avatarSrc

  return (
    <Avatar
      src={userAvatarSrc}
      name={avatarName}
      size="md"
      data-ai-avatar={undefined}
      data-user-fallback={!avatarSrc || imageError ? 'true' : undefined}
    />
  )
}

/**
 * Chat interface component using chatscope UI kit
 *
 * Provides a mobile-first, accessible chat interface for AI-powered event creation.
 * Features smooth scrolling, touch-optimized interactions, and screen reader support.
 *
 * **Typing Indicator Behavior:**
 * - When `isLoading` is true and there's a last AI message, the typing indicator appears
 *   inside that message bubble (replacing the message text)
 * - When `isLoading` is true and no AI messages exist yet, a temporary message bubble
 *   with only the typing indicator is created
 * - Messages with `eventData` are not replaced with typing indicator (EventPreviewCard takes precedence)
 *
 * **Integration Notes:**
 * - Chatscope components don't accept className props directly, so we use a wrapper div for Tailwind styling
 * - Inline `WebkitOverflowScrolling` style is required for iOS momentum scrolling (not available as Tailwind class)
 * - Components should be wrapped in ErrorBoundary at parent level for graceful failure handling
 *
 * **Note on ID attributes:**
 * - We use `data-testid` instead of `id` attributes (React best practice)
 * - IDs should only be added when needed for: accessibility (ARIA relationships),
 *   form labels, or URL anchors - not for general styling/testing
 * - data-testid provides better component encapsulation and avoids ID uniqueness conflicts
 *
 * @component
 * @param {ChatInterfaceProps} props - Component props
 * @param {ChatMessageData[]} props.messages - Array of chat messages to display
 * @param {(text: string) => void} props.onSendMessage - Callback when user sends a message
 * @param {boolean} props.isLoading - Whether AI is currently processing/responding
 * @param {(eventData: EventPreviewData) => void} [props.onConfirmEvent] - Optional callback when user confirms event preview
 *
 * @example
 * ```tsx
 * <ChatInterface
 *   messages={messages}
 *   onSendMessage={handleSendMessage}
 *   isLoading={false}
 *   onConfirmEvent={handleConfirmEvent}
 * />
 * ```
 *
 * @see {@link ChatMessageData} - Message data structure
 * @see {@link EventPreviewData} - Event preview data structure
 * @see {@link tests/e2e/e2e-flow.spec.ts} - E2E tests
 *
 * @accessibility
 * - ARIA live region for message list updates
 * - Keyboard navigation support
 * - Screen reader friendly message structure
 *
 * @performance
 * - Messages are memoized to prevent unnecessary re-renders
 * - Auto-scroll uses requestAnimationFrame for smooth performance
 * - Smart scroll only triggers when user is near bottom or typing indicator appears
 *
 * @version 2.0.0
 * @since 2024-10-01
 * @updated 2025-01-15 - Refactored typing indicator to appear inside last AI message bubble
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, onConfirmEvent }) => {
  const { userProfile } = useUserProfile()
  const [userAvatarError, setUserAvatarError] = useState(false)
  const chatInterfaceContainerRef = React.useRef<HTMLDivElement>(null)

  const handleSend = (text: string) => {
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim())
    }
  }

  // Get user avatar source
  const userAvatarSrc = userProfile?.public?.photoURL || userProfile?.private?.photoURL
  const userAvatarName =
    userProfile?.public?.firstName && userProfile?.public?.lastName
      ? `${userProfile.public.firstName} ${userProfile.public.lastName}`
      : userProfile?.public?.firstName || userProfile?.private?.firstName || 'User'

  // Pre-validate user avatar image to detect broken images
  useEffect(() => {
    if (userAvatarSrc) {
      const img = new Image()
      img.onerror = () => setUserAvatarError(true)
      img.onload = () => setUserAvatarError(false)
      img.src = userAvatarSrc
    } else {
      setUserAvatarError(false)
    }
  }, [userAvatarSrc])

  // Scroll to bottom when messages change or typing indicator appears
  // Only auto-scroll if user is already near the bottom (within 100px)
  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated before scrolling
    const rafId = requestAnimationFrame(() => {
      if (chatInterfaceContainerRef.current) {
        // Find the scrollable container - the scroll wrapper is the actual scrollable element
        const scrollContainer = chatInterfaceContainerRef.current.querySelector(
          '.cs-message-list__scroll-wrapper'
        ) as HTMLElement

        if (scrollContainer) {
          const { scrollTop, scrollHeight, clientHeight } = scrollContainer
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

          // Only auto-scroll if user is already near the bottom or if typing indicator appears
          if (isNearBottom || isLoading) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
          }
        }
      }
    })
    return () => cancelAnimationFrame(rafId)
  }, [messages, isLoading])

  // Find the last AI message index (if any)
  const lastAIMessageIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'assistant') {
        return i
      }
    }
    return -1
  }, [messages])

  // Memoize message rendering to avoid unnecessary re-renders
  const renderedMessages = useMemo(() => {
    const rendered = messages.map((message, index) => {
      const isUser = message.sender === 'user'
      const avatarPosition = isUser ? 'bottom-right' : 'bottom-left'
      const avatarSrc = isUser ? userAvatarSrc : '/PUE_logo_transparent.png'
      const avatarName = isUser ? userAvatarName : 'AI Assistant'
      const isLastAI = !isUser && index === lastAIMessageIndex && isLoading

      // If message has eventData, render EventPreviewCard in custom message
      if (message.eventData) {
        return (
          <Message
            key={message.messageId}
            model={{
              message: '',
              sentTime: formatTimestamp(message.timestamp),
              sender: message.sender === 'user' ? 'You' : 'AI Assistant',
              direction: message.sender === 'user' ? 'outgoing' : 'incoming',
              position: getMessagePosition(index, messages.length, messages),
            }}
            avatarPosition={avatarPosition}
          >
            {renderAvatar(isUser, avatarSrc, avatarName, isUser ? userAvatarError : false)}
            <Message.CustomContent data-testid={`event-preview-message-${message.messageId}`}>
              <EventPreviewCard
                eventData={message.eventData}
                onConfirm={onConfirmEvent && message.eventData ? () => onConfirmEvent(message.eventData!) : undefined}
              />
            </Message.CustomContent>
          </Message>
        )
      }

      // If this is the last AI message and we're loading, show typing indicator instead of text
      if (isLastAI) {
        return (
          <Message
            key={message.messageId}
            model={{
              message: '',
              sentTime: formatTimestamp(message.timestamp),
              sender: 'AI Assistant',
              direction: 'incoming',
              position: getMessagePosition(index, messages.length, messages),
            }}
            avatarPosition="bottom-left"
            data-testid="chat-typing-indicator"
          >
            {renderAvatar(false, avatarSrc, avatarName, false)}
            <Message.CustomContent>
              <TypingIndicator content="AI is thinking..." />
            </Message.CustomContent>
          </Message>
        )
      }

      // Regular message
      return (
        <Message
          key={message.messageId}
          model={{
            message: message.text,
            sentTime: formatTimestamp(message.timestamp),
            sender: message.sender === 'user' ? 'You' : 'AI Assistant',
            direction: message.sender === 'user' ? 'outgoing' : 'incoming',
            position: getMessagePosition(index, messages.length, messages),
          }}
          avatarPosition={avatarPosition}
        >
          {renderAvatar(isUser, avatarSrc, avatarName, isUser ? userAvatarError : false)}
        </Message>
      )
    })

    // If loading and no AI message exists yet, add a temporary message bubble with typing indicator
    if (isLoading && lastAIMessageIndex === -1) {
      rendered.push(
        <Message
          key="typing-indicator-temp"
          model={{
            message: '',
            sentTime: 'now',
            sender: 'AI Assistant',
            direction: 'incoming',
            position: 'single',
          }}
          avatarPosition="bottom-left"
          data-testid="chat-typing-indicator"
        >
          {renderAvatar(false, '/PUE_logo_transparent.png', 'AI Assistant', false)}
          <Message.CustomContent>
            <TypingIndicator content="AI is thinking..." />
          </Message.CustomContent>
        </Message>
      )
    }

    return rendered
  }, [messages, onConfirmEvent, userAvatarSrc, userAvatarName, userAvatarError, isLoading, lastAIMessageIndex])

  return (
    <div
      ref={chatInterfaceContainerRef}
      className="relative w-full rounded-2xl overflow-hidden shadow-md"
      style={{
        height: `calc(100dvh - ${MOBILE_HEADER_FOOTER_HEIGHT}px)`,
      }}
      data-testid="chat-interface-container"
    >
      <style>{`
        @media (min-width: 768px) {
          [data-testid="chat-interface-container"] {
            height: calc(100dvh - ${DESKTOP_HEADER_FOOTER_HEIGHT}px) !important;
          }
        }
        
        /* Message spacing - increase padding between messages */
        [data-testid="chat-interface-container"] .cs-message {
          margin-top: 1rem !important;
          margin-bottom: 1rem !important;
        }
        
        /* Additional spacing for first/last messages */
        [data-testid="chat-interface-container"] .cs-message:first-child {
          margin-top: 1.5rem !important;
        }
        
        [data-testid="chat-interface-container"] .cs-message:last-child {
          margin-bottom: 1.5rem !important;
        }
        
        /* Extra spacing between different senders */
        [data-testid="chat-interface-container"] .cs-message--incoming + .cs-message--outgoing,
        [data-testid="chat-interface-container"] .cs-message--outgoing + .cs-message--incoming {
          margin-top: 1.5rem !important;
        }
        
        /* AI message bubble (incoming) - sharp corner at bottom-left (where avatar is) */
        [data-testid="chat-interface-container"] .cs-message--incoming .cs-message__content {
          background-color: #F2F5F7 !important;
          border: 1px solid #1A2A33 !important;
          color: #1A2A33 !important;
          border-radius: 12px 12px 12px 0px !important;
        }
        
        /* User message bubble (outgoing) */
        [data-testid="chat-interface-container"] .cs-message--outgoing .cs-message__content {
          background-color: #DFFBFD !important;
          border: 1px solid #1A2A33 !important;
          color: #1A2A33 !important;
        }
        
        /* Message input field wrapper */
        [data-testid="chat-interface-container"] .cs-message-input__content-editor-wrapper {
          background-color: #FCF7ED !important;
          border: none !important;
        }
        
        /* Message input textarea/input element */
        [data-testid="chat-interface-container"] .cs-message-input__content-editor-wrapper textarea,
        [data-testid="chat-interface-container"] .cs-message-input__content-editor-wrapper input {
          background-color: #FCF7ED !important;
          border: none !important;
          color: #1A2A33 !important;
        }
        
        /* Message input placeholder text */
        [data-testid="chat-interface-container"] .cs-message-input__content-editor-wrapper textarea::placeholder,
        [data-testid="chat-interface-container"] .cs-message-input__content-editor-wrapper input::placeholder {
          color: #8B9AA2 !important;
        }
        
        /* Alternative selectors for message input */
        [data-testid="chat-interface-container"] .cs-message-input__content-editor {
          background-color: #FCF7ED !important;
          border: none !important;
          color: #1A2A33 !important;
        }
        
        [data-testid="chat-interface-container"] .cs-message-input__content-editor::placeholder {
          color: #8B9AA2 !important;
        }
        
        /* Avatar styling - ensure circular avatars with minimum size */
        [data-testid="chat-interface-container"] .cs-avatar {
          border-radius: 50% !important;
          min-width: 26px !important;
          min-height: 26px !important;
          width: 32px !important;
          height: 32px !important;
          overflow: hidden !important;
        }
        
        /* Dark background for AI avatars */
        [data-testid="chat-interface-container"] .cs-avatar[data-ai-avatar="true"] {
          background-color: #1A2A33 !important;
          color: #ffffff !important;
        }
        
        /* Light background for user avatars (default) */
        [data-testid="chat-interface-container"] .cs-avatar:not([data-ai-avatar="true"]) {
          background-color: #E5E7EB !important;
          color: #374151 !important;
        }
        
        [data-testid="chat-interface-container"] .cs-avatar img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 50% !important;
        }
        
        /* AI avatar logo - use contain to fit entirely within bubble */
        [data-testid="chat-interface-container"] .cs-avatar[data-ai-avatar="true"] img {
          object-fit: contain !important;
          padding: 6px !important;
        }
        
        /* User avatar fallback - show User icon when image fails or no src */
        [data-testid="chat-interface-container"] .cs-avatar[data-user-fallback="true"] img,
        [data-testid="chat-interface-container"] .cs-avatar[data-user-fallback="true"] .cs-avatar__content {
          display: none !important;
        }
        
        [data-testid="chat-interface-container"] .cs-avatar[data-user-fallback="true"]::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E") !important;
          background-size: 60% !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          pointer-events: none !important;
        }
        
        /* Typing indicator styling - ensure it displays properly */
        [data-testid="chat-interface-container"] .cs-message--incoming .cs-message__custom-content {
          display: block !important;
        }
        
        [data-testid="chat-interface-container"] .cs-typing-indicator {
          background-color: #F2F5F7 !important;
          border: 1px solid #1A2A33 !important;
          border-radius: 12px 12px 12px 0px !important;
          padding: 12px 16px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          min-width: 120px !important;
        }
        
        [data-testid="chat-interface-container"] .cs-typing-indicator__text {
          color: #1A2A33 !important;
          font-size: 14px !important;
        }
        
        [data-testid="chat-interface-container"] .cs-typing-indicator__indicator {
          display: flex !important;
          gap: 4px !important;
        }
        
        [data-testid="chat-interface-container"] .cs-typing-indicator__dot {
          width: 8px !important;
          height: 8px !important;
          background-color: #1A2A33 !important;
          border-radius: 50% !important;
          animation: typing-dot 1.4s infinite ease-in-out !important;
        }
        
        [data-testid="chat-interface-container"] .cs-typing-indicator__dot:nth-child(1) {
          animation-delay: 0s !important;
        }
        
        [data-testid="chat-interface-container"] .cs-typing-indicator__dot:nth-child(2) {
          animation-delay: 0.2s !important;
        }
        
        [data-testid="chat-interface-container"] .cs-typing-indicator__dot:nth-child(3) {
          animation-delay: 0.4s !important;
        }
        
        @keyframes typing-dot {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          30% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            aria-live="polite"
            role="log"
            data-testid="chat-message-list"
            style={{
              // iOS-specific optimization: Not available as Tailwind utility
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {renderedMessages}
          </MessageList>
          <MessageInput
            placeholder="Type your message here..."
            disabled={isLoading}
            onSend={handleSend}
            attachButton={false}
            aria-label="Type your message to the AI assistant"
            data-testid="chat-message-input"
          />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}

export default ChatInterface
