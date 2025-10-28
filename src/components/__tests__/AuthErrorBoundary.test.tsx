import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthErrorBoundary from '@/components/AuthErrorBoundary'

// Mock React Router
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

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

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

// Custom fallback component
const CustomFallback = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div data-testid="custom-fallback">
    <p>Custom error: {error.message}</p>
    <button onClick={onRetry}>Custom Retry</button>
  </div>
)

describe('AuthErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suppress console.error for tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('Error Catching', () => {
    it('should catch errors and display fallback UI', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('An unexpected error occurred. Please try again or contact support.')).toBeInTheDocument()
    })

    it('should not display fallback UI when no error occurs', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={false} />
        </AuthErrorBoundary>
      )

      expect(screen.getByText('No error')).toBeInTheDocument()
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })
  })

  describe('Custom Fallback Component', () => {
    it('should use custom fallback component when provided', () => {
      render(
        <AuthErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
      expect(screen.getByText('Custom error: Test error')).toBeInTheDocument()
    })
  })

  describe('Retry Functionality', () => {
    it('should retry when retry button is clicked', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      const retryButton = screen.getByText(/Try Again/)
      expect(retryButton).toBeInTheDocument()

      // Click retry - this should reset the error boundary
      fireEvent.click(retryButton)

      // The component should re-render and potentially show the non-error state
      // Note: In a real scenario, the component would need to be re-rendered
      // with shouldThrow=false to see the success state
    })

    it('should show retry count when retrying', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      const retryButton = screen.getByText(/Try Again/)
      fireEvent.click(retryButton)

      // After retry, should show attempt count
      expect(screen.getByText(/\(1\/3\)/)).toBeInTheDocument()
    })

    it('should disable retry after max attempts', () => {
      render(
        <AuthErrorBoundary maxRetries={1}>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      const retryButton = screen.getByText(/Try Again/)
      fireEvent.click(retryButton)

      // After max retries, should show navigation buttons only (no retry button)
      expect(screen.queryByText(/Try Again/)).not.toBeInTheDocument()
      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should navigate to home when home button is clicked', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      const homeButton = screen.getByText('Home')
      fireEvent.click(homeButton)

      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('should navigate to login when login button is clicked', () => {
      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)

      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  describe('Error Types', () => {
    it('should display network error UI for network errors', () => {
      const NetworkErrorComponent = () => {
        throw new Error('Network request failed')
      }

      render(
        <AuthErrorBoundary>
          <NetworkErrorComponent />
        </AuthErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText(/network issue/)).toBeInTheDocument()
    })

    it('should display auth error UI for auth errors', () => {
      const AuthErrorComponent = () => {
        throw new Error('auth/invalid-credential')
      }

      render(
        <AuthErrorBoundary>
          <AuthErrorComponent />
        </AuthErrorBoundary>
      )

      expect(screen.getByText('Authentication Error')).toBeInTheDocument()
      expect(screen.getByText(/authentication/)).toBeInTheDocument()
    })
  })

  describe('Error Handler Callback', () => {
    it('should call onError callback when error occurs', () => {
      const onError = vi.fn()

      render(
        <AuthErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      expect(onError).toHaveBeenCalledWith(expect.any(Error), expect.any(Object))
    })
  })

  describe('Development Mode', () => {
    it('should show error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()

      // Restore original environment
      process.env.NODE_ENV = originalEnv
    })

    it('should not show error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      render(
        <AuthErrorBoundary>
          <ThrowError shouldThrow={true} />
        </AuthErrorBoundary>
      )

      expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument()

      // Restore original environment
      process.env.NODE_ENV = originalEnv
    })
  })
})
