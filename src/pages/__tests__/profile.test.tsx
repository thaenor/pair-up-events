import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProfilePage from '../profile'

// Mock useRequireAuth to return a user
vi.mock('@/hooks/useRequireAuth', () => ({
  default: () => ({
    user: { uid: 'test-user-id', email: 'test@example.com' },
    loading: false,
  }),
}))

// Add to src/pages/__tests__/profile.test.tsx
vi.mock('@/contexts/UserContext', () => ({
  useUserProfile: () => ({
    userProfile: null, // or mock user data for testing
    loading: false,
    updateProfile: vi.fn(),
    error: null,
    refreshProfile: vi.fn(),
  }),
}))

describe('ProfilePage', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
