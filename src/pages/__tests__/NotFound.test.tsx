import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from '../NotFound'

describe('NotFound', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
