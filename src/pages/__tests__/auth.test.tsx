import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AuthPage from '../auth'

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
