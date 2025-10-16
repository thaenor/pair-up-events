import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TermsOfServicePage from '../terms-of-service'

describe('TermsOfServicePage', () => {
  it('should match snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <TermsOfServicePage />
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
