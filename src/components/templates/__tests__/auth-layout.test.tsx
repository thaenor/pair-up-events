import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AuthLayout } from '../auth-layout'

describe('AuthLayout', () => {
  it('should match snapshot', () => {
    const { container } = render(<AuthLayout left={<div>Left Content</div>} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
