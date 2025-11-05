import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '../Navigation'

describe('Navigation', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
