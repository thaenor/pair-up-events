import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import AccountControls from '../account-controls'

const mockUser = {
  uid: '123',
  email: 'test@example.com',
  displayName: 'Test User',
}

describe('AccountControls', () => {
  it('should match snapshot - with user', () => {
    const { container } = render(<AccountControls user={mockUser as never} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - without user', () => {
    const { container } = render(<AccountControls user={null} />)
    expect(container.firstChild).toBeNull()
  })
})
