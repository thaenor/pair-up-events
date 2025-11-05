import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPageLayout from '../LandingPageLayout'

describe('LandingPageLayout', () => {
  it('should match snapshot - with navigation and footer', () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPageLayout showNavigation={true} showFooter={true}>
          <div>Content</div>
        </LandingPageLayout>
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - without navigation and footer', () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPageLayout showNavigation={false} showFooter={false}>
          <div>Content</div>
        </LandingPageLayout>
      </MemoryRouter>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
