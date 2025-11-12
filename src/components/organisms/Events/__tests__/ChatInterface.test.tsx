import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatInterface from '../ChatInterface'
import type { ChatMessageData, EventPreviewData } from '@/entities/event/event'

// Mock chatscope styles
vi.mock('@chatscope/chat-ui-kit-styles/dist/default/styles.min.css', () => ({}))

// Mock EventPreviewCard
vi.mock('@/components/molecules/Events/EventPreviewCard', () => ({
  default: ({ eventData, onConfirm }: { eventData: EventPreviewData; onConfirm?: () => void }) => (
    <div data-testid="event-preview-card">
      <div>{eventData.title}</div>
      <button onClick={onConfirm} data-testid="preview-confirm-button">
        Confirm
      </button>
    </div>
  ),
}))

// Mock useUserProfile
const mockUserProfile = {
  public: {
    firstName: 'John',
    lastName: 'Doe',
    photoURL: 'https://example.com/avatar.jpg',
    gender: 'male' as const,
    age: 25,
  },
  private: {
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    birthDate: new Date('1998-01-01'),
    gender: 'male' as const,
    createdAt: new Date(),
  },
}

vi.mock('@/contexts/UserContext', () => ({
  useUserProfile: vi.fn(() => ({
    userProfile: mockUserProfile,
    loading: false,
    error: null,
    refreshProfile: vi.fn(),
    updateProfile: vi.fn(),
  })),
}))

describe('ChatInterface', () => {
  const mockOnSendMessage = vi.fn()
  const mockOnConfirmEvent = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render message list', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        messageId: '2',
        text: 'Hi there!',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]

    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />)
    expect(screen.getByTestId('chat-message-list')).toBeInTheDocument()
  })

  it('should render typing indicator when loading', () => {
    const messages: ChatMessageData[] = []
    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={true} />)
    expect(screen.getByTestId('chat-typing-indicator')).toBeInTheDocument()
  })

  it('should not render typing indicator when not loading', () => {
    const messages: ChatMessageData[] = []
    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />)
    expect(screen.queryByTestId('chat-typing-indicator')).not.toBeInTheDocument()
  })

  it('should render EventPreviewCard when message has eventData', () => {
    const eventData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
    }
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Here is your event',
        sender: 'assistant',
        timestamp: new Date(),
        eventData,
      },
    ]

    const { container } = render(
      <ChatInterface
        messages={messages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
        onConfirmEvent={mockOnConfirmEvent}
      />
    )
    // Check that EventPreviewCard is rendered (may be nested in chatscope components)
    expect(container.querySelector('[data-testid="event-preview-card"]')).toBeInTheDocument()
    expect(screen.getByText('Test Event')).toBeInTheDocument()
  })

  it('should call onConfirmEvent when EventPreviewCard confirm is clicked', async () => {
    const user = userEvent.setup()
    const eventData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
    }
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Here is your event',
        sender: 'assistant',
        timestamp: new Date(),
        eventData,
      },
    ]

    render(
      <ChatInterface
        messages={messages}
        onSendMessage={mockOnSendMessage}
        isLoading={false}
        onConfirmEvent={mockOnConfirmEvent}
      />
    )
    const confirmButton = screen.getByTestId('preview-confirm-button')
    await user.click(confirmButton)
    expect(mockOnConfirmEvent).toHaveBeenCalledWith(eventData)
  })

  it('should render regular messages without eventData', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
    ]

    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />)
    expect(screen.getByTestId('chat-message-list')).toBeInTheDocument()
    expect(screen.queryByTestId('event-preview-card')).not.toBeInTheDocument()
  })

  it('should render message input', () => {
    const messages: ChatMessageData[] = []
    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />)
    expect(screen.getByTestId('chat-message-input')).toBeInTheDocument()
  })

  it('should render avatars for user messages', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
    ]

    const { container } = render(
      <ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />
    )
    // Check for avatar in user message (outgoing)
    const avatars = container.querySelectorAll('.cs-avatar')
    expect(avatars.length).toBeGreaterThan(0)
  })

  it('should render avatars for AI messages', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hi there!',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]

    const { container } = render(
      <ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />
    )
    // Check for avatar in AI message (incoming)
    const avatars = container.querySelectorAll('.cs-avatar')
    expect(avatars.length).toBeGreaterThan(0)
  })

  it('should render avatars for both user and AI messages', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        messageId: '2',
        text: 'Hi there!',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]

    const { container } = render(
      <ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />
    )
    // Should have 2 avatars (one for user, one for AI)
    const avatars = container.querySelectorAll('.cs-avatar')
    expect(avatars.length).toBe(2)
  })

  it('should render avatar for typing indicator', () => {
    const messages: ChatMessageData[] = []
    const { container } = render(
      <ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={true} />
    )
    // Typing indicator should have an avatar
    const avatars = container.querySelectorAll('.cs-avatar')
    expect(avatars.length).toBeGreaterThan(0)
  })

  it('should render multiple messages', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Message 1',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        messageId: '2',
        text: 'Message 2',
        sender: 'assistant',
        timestamp: new Date(),
      },
      {
        messageId: '3',
        text: 'Message 3',
        sender: 'user',
        timestamp: new Date(),
      },
    ]

    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />)
    expect(screen.getByTestId('chat-message-list')).toBeInTheDocument()
  })

  it('should render messages with eventData mixed with regular messages', () => {
    const eventData: EventPreviewData = {
      title: 'Test Event',
      activity: 'Hiking',
    }
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        messageId: '2',
        text: 'Here is your event',
        sender: 'assistant',
        timestamp: new Date(),
        eventData,
      },
      {
        messageId: '3',
        text: 'Thank you!',
        sender: 'user',
        timestamp: new Date(),
      },
    ]

    const { container } = render(
      <ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />
    )
    // Check that EventPreviewCard is rendered (may be nested in chatscope components)
    expect(container.querySelector('[data-testid="event-preview-card"]')).toBeInTheDocument()
    expect(screen.getByText('Test Event')).toBeInTheDocument()
  })

  it('should match snapshot with empty messages', () => {
    const messages: ChatMessageData[] = []
    const { container } = render(
      <ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot with messages', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        messageId: '2',
        text: 'Hi there!',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]
    const { container } = render(
      <ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot with loading state', () => {
    const messages: ChatMessageData[] = []
    const { container } = render(
      <ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={true} />
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should show typing indicator in last AI message when loading', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        messageId: '2',
        text: 'Hi there!',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]

    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={true} />)
    // Typing indicator should be in the last AI message
    expect(screen.getByTestId('chat-typing-indicator')).toBeInTheDocument()
  })

  it('should show typing indicator in new message bubble when no AI messages exist', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
    ]

    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={true} />)
    // Typing indicator should appear in a new message bubble
    expect(screen.getByTestId('chat-typing-indicator')).toBeInTheDocument()
  })

  it('should hide typing indicator when loading stops', () => {
    const messages: ChatMessageData[] = [
      {
        messageId: '1',
        text: 'Hello',
        sender: 'user',
        timestamp: new Date(),
      },
      {
        messageId: '2',
        text: 'Hi there!',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]

    // Test with loading state
    const { unmount } = render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={true} />)
    expect(screen.getByTestId('chat-typing-indicator')).toBeInTheDocument()
    unmount()

    // Test without loading state - typing indicator should not appear
    render(<ChatInterface messages={messages} onSendMessage={mockOnSendMessage} isLoading={false} />)
    expect(screen.queryByTestId('chat-typing-indicator')).not.toBeInTheDocument()
  })
})
