import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SkipLink from '../skip-link'

describe('SkipLink', () => {
  it('should match snapshot - default', () => {
    const { container } = render(<SkipLink targetId="main-content" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - with custom label', () => {
    const { container } = render(<SkipLink targetId="main-content" label="Skip to content" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - with custom className', () => {
    const { container } = render(<SkipLink targetId="main-content" className="custom-class" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
