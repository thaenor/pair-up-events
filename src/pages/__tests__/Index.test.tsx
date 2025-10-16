import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Index from '../Index'

describe('Index', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
