import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EventsPage from '../events'

// Mock useRequireAuth to return loading: false so button renders
vi.mock('@/hooks/useRequireAuth', () => ({
  default: () => ({
    loading: false,
  }),
}))

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
