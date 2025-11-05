import React from 'react'
import { AlertTriangle, RefreshCw, Home, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from './atoms/button'

interface AuthErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  retryCount: number
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<AuthErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  maxRetries?: number
}

interface AuthErrorFallbackProps {
  error: Error
  errorInfo: React.ErrorInfo | null
  retryCount: number
  maxRetries: number
  onRetry: () => void
}

/**
 * Auth-specific error boundary component
 *
 * Handles authentication-related errors with specialized recovery options
 * including retry mechanisms, navigation to login, and graceful fallbacks.
 *
 * @param children - React components to wrap
 * @param fallback - Custom fallback component (optional)
 * @param onError - Custom error handler (optional)
 * @param maxRetries - Maximum retry attempts (default: 3)
 */
class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: AuthErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<AuthErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onError } = this.props

    // Log the error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Auth Error Boundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo,
    })
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
      this.retryTimeoutId = null
    }
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      // Clear current error state
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }))

      // Add a small delay before retry to allow state to settle
      if (this.retryTimeoutId) {
        clearTimeout(this.retryTimeoutId)
      }
      this.retryTimeoutId = setTimeout(() => {
        // Force a re-render by updating a dummy state
        this.setState({})
        this.retryTimeoutId = null
      }, 100)
    }
  }

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state
    const { children, fallback: FallbackComponent, maxRetries = 3 } = this.props

    if (hasError && error) {
      // Use custom fallback if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            retryCount={retryCount}
            maxRetries={maxRetries}
            onRetry={this.handleRetry}
          />
        )
      }

      // Default auth error fallback UI
      return (
        <DefaultAuthErrorFallback
          error={error}
          errorInfo={errorInfo}
          retryCount={retryCount}
          maxRetries={maxRetries}
          onRetry={this.handleRetry}
        />
      )
    }

    return children
  }
}

/**
 * Default fallback UI for authentication errors
 */
const DefaultAuthErrorFallback: React.FC<AuthErrorFallbackProps> = ({ error, retryCount, maxRetries, onRetry }) => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  const isNetworkError =
    error.message.includes('network') || error.message.includes('Network') || error.message.includes('fetch')

  const isAuthError =
    error.message.includes('auth') ||
    error.message.includes('Auth') ||
    error.message.includes('firebase') ||
    error.message.includes('Firebase')

  const canRetry = retryCount < maxRetries

  return (
    <div className="min-h-screen flex items-center justify-center bg-pairup-darkBlue text-pairup-cream p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-pairup-orange mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{isAuthError ? 'Authentication Error' : 'Something went wrong'}</h1>
          <p className="text-pairup-cream/80 mb-4">
            {isNetworkError
              ? 'There was a network issue. Please check your connection and try again.'
              : isAuthError
                ? 'There was an issue with authentication. This might be temporary.'
                : 'An unexpected error occurred. Please try again or contact support.'}
          </p>
        </div>

        <div className="space-y-3">
          {canRetry && (
            <Button
              onClick={onRetry}
              variant="primary"
              size="lg"
              className="w-full"
              aria-label={`Retry (attempt ${retryCount + 1} of ${maxRetries})`}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
            </Button>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleGoToLogin}
              variant="outline"
              size="lg"
              className="flex-1"
              aria-label="Go to login page"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>

            <Button onClick={handleGoHome} variant="outline" size="lg" className="flex-1" aria-label="Go to home page">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>

        {/* Error details for debugging (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-pairup-cream/60 hover:text-pairup-cream">
              Error Details (Development)
            </summary>
            <pre className="mt-2 p-3 bg-pairup-darkBlue/50 rounded text-xs text-pairup-cream/80 overflow-auto">
              {error.message}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

// Wrapper component that provides navigation functionality
interface AuthErrorBoundaryWrapperProps {
  children: React.ReactNode
  fallback?: React.ComponentType<AuthErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  maxRetries?: number
}

const AuthErrorBoundaryWrapper: React.FC<AuthErrorBoundaryWrapperProps> = props => {
  return <AuthErrorBoundary {...props} />
}

export default AuthErrorBoundaryWrapper
export type { AuthErrorFallbackProps }
