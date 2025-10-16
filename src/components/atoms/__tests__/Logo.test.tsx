import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Logo from '../Logo'

describe('Logo', () => {
  it('should match snapshot - default', () => {
    const { container } = render(<Logo />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - without text', () => {
    const { container } = render(<Logo showText={false} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - large size', () => {
    const { container } = render(<Logo size="lg" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - hero size', () => {
    const { container } = render(<Logo size="hero" />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
