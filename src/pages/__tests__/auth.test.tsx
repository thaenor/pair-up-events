import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AuthPage from '../auth'

// Mock useUserProfile from UserContext
vi.mock('@/contexts/UserContext', () => ({
  useUserProfile: () => ({
    userProfile: null,
    loading: false,
    updateProfile: vi.fn(),
    error: null,
    refreshProfile: vi.fn(),
  }),
}))

describe('AuthPage', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
