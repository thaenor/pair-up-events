import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import HeroSection from '../HeroSection'

describe('HeroSection', () => {
  it('should match snapshot', () => {
    const { container } = render(<HeroSection onScrollToEarlyAccess={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
