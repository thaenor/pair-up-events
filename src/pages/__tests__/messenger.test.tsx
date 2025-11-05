import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MessengerPage from '../messenger'

describe('MessengerPage', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <MessengerPage />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
