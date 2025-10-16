import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { EventCreationForm } from '../EventCreationForm'

describe('EventCreationForm', () => {
  it('should match snapshot', () => {
    const { container } = render(<EventCreationForm onSubmit={async () => {}} isCreating={false} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('should match snapshot - creating state', () => {
    const { container } = render(<EventCreationForm onSubmit={async () => {}} isCreating={true} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
