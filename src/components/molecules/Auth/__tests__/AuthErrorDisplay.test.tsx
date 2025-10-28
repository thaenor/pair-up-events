import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AuthErrorDisplay from '@/components/molecules/Auth/AuthErrorDisplay'

// Mock Button component
vi.mock('@/components/atoms/button', () => ({
  default: ({
    children,
    onClick,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}))

// Mock AuthError type
interface MockAuthError {
  type: 'network' | 'auth' | 'config' | 'unknown'
  retryable: boolean
  message: string
}

const createMockError = (type: MockAuthError['type'], retryable: boolean, message: string): MockAuthError => ({
  type,
  retryable,
  message,
})

describe('AuthErrorDisplay', () => {
  const mockOnRetry = vi.fn()
  const mockOnClear = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Error Type Display', () => {
    it('should display network error with correct styling and icon', () => {
      const error = createMockError('network', true, 'Network connection failed')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      expect(screen.getByText('Connection Problem')).toBeInTheDocument()
      expect(screen.getByText('Network connection failed')).toBeInTheDocument()
      expect(screen.getByText('Please check your internet connection and try again.')).toBeInTheDocument()
    })

    it('should display auth error with correct styling and icon', () => {
      const error = createMockError('auth', false, 'Invalid credentials')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      expect(screen.getByText('Authentication Error')).toBeInTheDocument()
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      // Description is not shown for specific auth errors to avoid redundancy
    })

    it('should display config error with correct styling and icon', () => {
      const error = createMockError('config', false, 'Configuration error')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      expect(screen.getByText('Configuration Issue')).toBeInTheDocument()
      expect(screen.getByText('Configuration error')).toBeInTheDocument()
      expect(screen.getByText('There is a configuration issue. Please contact support.')).toBeInTheDocument()
    })

    it('should display unknown error with correct styling and icon', () => {
      const error = createMockError('unknown', true, 'Unexpected error')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Unexpected error')).toBeInTheDocument()
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument()
    })
  })

  describe('Retry Functionality', () => {
    it('should show retry button for retryable errors', () => {
      const error = createMockError('network', true, 'Network error')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      const retryButton = screen.getByText('Try Again')
      expect(retryButton).toBeInTheDocument()
    })

    it('should not show retry button for non-retryable errors', () => {
      const error = createMockError('auth', false, 'Invalid credentials')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
    })

    it('should call onRetry when retry button is clicked', () => {
      const error = createMockError('network', true, 'Network error')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      const retryButton = screen.getByText('Try Again')
      fireEvent.click(retryButton)

      expect(mockOnRetry).toHaveBeenCalledTimes(1)
    })

    it('should not show retry button when showRetry is false', () => {
      const error = createMockError('network', true, 'Network error')

      render(
        <AuthErrorDisplay
          error={error as MockAuthError}
          onRetry={mockOnRetry}
          onClear={mockOnClear}
          showRetry={false}
        />
      )

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
    })
  })

  describe('Clear Functionality', () => {
    it('should show dismiss button when onClear is provided', () => {
      const error = createMockError('auth', false, 'Invalid credentials')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      const dismissButton = screen.getByText('Dismiss')
      expect(dismissButton).toBeInTheDocument()
    })

    it('should not show dismiss button when onClear is not provided', () => {
      const error = createMockError('auth', false, 'Invalid credentials')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} />)

      expect(screen.queryByText('Dismiss')).not.toBeInTheDocument()
    })

    it('should call onClear when dismiss button is clicked', () => {
      const error = createMockError('auth', false, 'Invalid credentials')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      const dismissButton = screen.getByText('Dismiss')
      fireEvent.click(dismissButton)

      expect(mockOnClear).toHaveBeenCalledTimes(1)
    })
  })

  describe('Styling and CSS Classes', () => {
    it('should apply custom className when provided', () => {
      const error = createMockError('auth', false, 'Invalid credentials')

      render(
        <AuthErrorDisplay
          error={error as MockAuthError}
          onRetry={mockOnRetry}
          onClear={mockOnClear}
          className="custom-class"
        />
      )

      const container = screen.getByTestId('auth-error-display')
      expect(container).toHaveClass('custom-class')
    })

    it('should have correct base CSS classes', () => {
      const error = createMockError('auth', false, 'Invalid credentials')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      const container = screen.getByTestId('auth-error-display')
      expect(container).toHaveClass('bg-red-50', 'border', 'border-red-200', 'rounded-lg', 'p-4')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const error = createMockError('auth', false, 'Invalid credentials')

      render(<AuthErrorDisplay error={error as MockAuthError} onRetry={mockOnRetry} onClear={mockOnClear} />)

      // Check that error message is accessible
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()

      // Check that buttons have proper text
      expect(screen.getByText('Dismiss')).toBeInTheDocument()
    })
  })
})
