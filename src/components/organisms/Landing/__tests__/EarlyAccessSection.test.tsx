import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import EarlyAccessSection from '../EarlyAccessSection'

describe('EarlyAccessSection', () => {
  it('should match snapshot', () => {
    const { container } = render(<EarlyAccessSection />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
