import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import HowItWorksSection from '../HowItWorksSection'

describe('HowItWorksSection', () => {
  it('should match snapshot', () => {
    const { container } = render(<HowItWorksSection />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
