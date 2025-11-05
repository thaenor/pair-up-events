import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EmailLoginForm from '../email-login-form'

describe('EmailLoginForm', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <EmailLoginForm />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
