import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../login'

describe('LoginPage', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
