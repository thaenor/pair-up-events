import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EventsCreatePage from '../events-create'

describe('EventsCreatePage', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <EventsCreatePage />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
