import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '../button'

describe('Button', () => {
  it('should match snapshot - primary button', () => {
    const { container } = render(<Button>Click Nested</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - loading state', () => {
    const { container } = render(<Button loading>Loading</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - with icons', () => {
    const { container } = render(
      <Button icon={<span>L</span>} iconRight={<span>R</span>}>
        With Icons
      </Button>
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
