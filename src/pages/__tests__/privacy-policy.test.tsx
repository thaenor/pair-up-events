import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PrivacyPolicyPage from '../privacy-policy'

describe('PrivacyPolicyPage', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <PrivacyPolicyPage />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
