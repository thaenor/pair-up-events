import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Sidebar from '../Sidebar'

// Mock the toast from sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockProps = {
  isOpen: true,
  onClose: vi.fn(),
  onLogout: vi.fn(),
  isLoggingOut: false,
}

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render sidebar when open', () => {
    render(
      <MemoryRouter>
        <Sidebar {...mockProps} />
      </MemoryRouter>
    )

    expect(screen.getByText('Menu')).toBeInTheDocument()
    expect(screen.getByLabelText('Navigate to settings')).toBeInTheDocument()
  })

  it('should hide sidebar when closed', () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar {...mockProps} isOpen={false} />
      </MemoryRouter>
    )

    // Check that sidebar has translate-x-full class for hidden state
    const sidebar = container.querySelector('[role="dialog"]')
    expect(sidebar).toHaveClass('translate-x-full')
  })

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Sidebar {...mockProps} />
      </MemoryRouter>
    )

    const closeButton = screen.getByLabelText('Close menu')
    await user.click(closeButton)

    expect(mockProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('should call onLogout when logout button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Sidebar {...mockProps} />
      </MemoryRouter>
    )

    const logoutButton = screen.getByLabelText('Logout')
    await user.click(logoutButton)

    expect(mockProps.onLogout).toHaveBeenCalledTimes(1)
  })

  it('should show loading state when logout is in progress', () => {
    render(
      <MemoryRouter>
        <Sidebar {...mockProps} isLoggingOut={true} />
      </MemoryRouter>
    )

    expect(screen.getByText('Logging Out...')).toBeInTheDocument()
  })

  it('should navigate to settings when settings button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar {...mockProps} />
      </MemoryRouter>
    )

    const settingsButton = screen.getByLabelText('Navigate to settings')
    await user.click(settingsButton)

    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('should navigate to invite when invite button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar {...mockProps} />
      </MemoryRouter>
    )

    const inviteButton = screen.getByLabelText('Navigate to invite page')
    await user.click(inviteButton)

    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('should close sidebar when backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Sidebar {...mockProps} />
      </MemoryRouter>
    )

    const backdrop = screen.getByRole('dialog').previousElementSibling
    if (backdrop) {
      await user.click(backdrop)
      expect(mockProps.onClose).toHaveBeenCalled()
    }
  })

  it('should have correct menu items', () => {
    render(
      <MemoryRouter>
        <Sidebar {...mockProps} />
      </MemoryRouter>
    )

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Invite a Friend')).toBeInTheDocument()
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByText('About Us')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })
})
