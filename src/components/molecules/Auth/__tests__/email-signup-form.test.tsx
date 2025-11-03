import { describe, it, expect, vi } from 'vitest'

import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EmailSignupForm from '../email-signup-form'

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

describe('EmailSignupForm', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <EmailSignupForm />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
