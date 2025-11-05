import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('should match snapshot - default size', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - with custom label', () => {
    const { container } = render(<LoadingSpinner aria-label="Custom loading" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
