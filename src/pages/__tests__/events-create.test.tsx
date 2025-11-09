import { describe, it, expect, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EventsCreatePage from '../events-create'

// Mock useRequireAuth
vi.mock('@/hooks/useRequireAuth', () => ({
  default: () => ({
    loading: false,
  }),
}))

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  default: () => ({
    user: { uid: 'test-user-id', email: 'test@example.com' },
    loading: false,
  }),
}))

// Mock useUserProfile
vi.mock('@/contexts/UserContext', () => ({
  useUserProfile: () => ({
    userProfile: null,
    loading: false,
    updateProfile: vi.fn(),
    error: null,
    refreshProfile: vi.fn(),
  }),
}))

// Mock event service functions
vi.mock('@/entities/event/event-service', () => ({
  createDraftEvent: vi.fn(),
  loadDraftEvent: vi.fn(() => Promise.resolve({ success: false, error: 'No draft found', errorType: 'not-found' })),
  saveChatMessage: vi.fn(),
  loadChatHistory: vi.fn(),
}))

// Mock AI functions
vi.mock('@/lib/ai', () => ({
  getGeminiModel: vi.fn(() => null),
  EVENT_ORGANIZER_SYSTEM_PROMPT: 'Mock system prompt',
  INITIAL_GREETING: 'Mock greeting',
}))

// Mock chatscope styles (not needed in test)
vi.mock('@chatscope/chat-ui-kit-styles/dist/default/styles.min.css', () => ({}))

describe('EventsCreatePage', () => {
  it('should match snapshot', async () => {
    const { container } = render(
      <MemoryRouter>
        <EventsCreatePage />
      </MemoryRouter>
    )

    // Wait for async initialization to complete
    await waitFor(() => {
      expect(container.querySelector('[data-testid]') || container.firstChild).toBeTruthy()
    })

    expect(container.firstChild).toMatchSnapshot()
  })
})
