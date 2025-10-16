import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MobileBottomNavigation from '../MobileBottomNavigation'

describe('MobileBottomNavigation', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileBottomNavigation />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
