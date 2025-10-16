import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EventsPage from '../events'

describe('EventsPage', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
