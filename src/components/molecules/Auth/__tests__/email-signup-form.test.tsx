import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EmailSignupForm from '../email-signup-form'

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
