import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import BenefitsSection from '../BenefitsSection'

describe('BenefitsSection', () => {
  it('should match snapshot', () => {
    const { container } = render(<BenefitsSection />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
