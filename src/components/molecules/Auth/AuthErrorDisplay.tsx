import React from 'react'
import { AlertTriangle, RefreshCw, WifiOff, Shield, Settings } from 'lucide-react'
import Button from '../../atoms/button'
import { AuthError } from '@/hooks/useAuth'

interface AuthErrorDisplayProps {
  error: AuthError
  onRetry?: () => void
  onClear?: () => void
  showRetry?: boolean
  className?: string
}

/**
 * Auth-specific error display component
 *
 * Shows authentication errors with contextual icons, messages, and retry options.
 * Provides different UI based on error type (network, auth, config, unknown).
 *
 * @param error - The authentication error to display
 * @param onRetry - Callback for retry action
 * @param onClear - Callback to clear the error
 * @param showRetry - Whether to show retry button
 * @param className - Additional CSS classes
 */
const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({
  error,
  onRetry,
  onClear,
  showRetry = true,
  className = '',
}) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return <WifiOff className="h-5 w-5" />
      case 'auth':
        return <Shield className="h-5 w-5" />
      case 'config':
        return <Settings className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getErrorColor = () => {
    switch (error.type) {
      case 'network':
        return 'text-pairup-orange'
      case 'auth':
        return 'text-red-500'
      case 'config':
        return 'text-yellow-500'
      default:
        return 'text-red-500'
    }
  }

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Connection Problem'
      case 'auth':
        return 'Authentication Error'
      case 'config':
        return 'Configuration Issue'
      default:
        return 'Something went wrong'
    }
  }

  const getErrorDescription = () => {
    switch (error.type) {
      case 'network':
        return 'Please check your internet connection and try again.'
      case 'auth':
        // For auth errors, the error.message already contains the specific message
        // Only show description for generic auth errors
        if (error.message.includes('unexpected error') || error.message.includes('An internal error')) {
          return 'Please try again or contact support if the problem persists.'
        }
        return '' // Don't show redundant description for specific auth errors
      case 'config':
        return 'There is a configuration issue. Please contact support.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`} data-testid="auth-error-display">
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${getErrorColor()}`}>{getErrorIcon()}</div>

        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{getErrorTitle()}</h3>

          <div className="mt-1 text-sm text-red-700">
            <p>{error.message}</p>
            {getErrorDescription() && <p className="mt-1 text-red-600">{getErrorDescription()}</p>}
          </div>

          <div className="mt-3 flex space-x-3">
            {showRetry && error.retryable && onRetry && (
              <Button
                onClick={onRetry}
                variant="outline"
                size="sm"
                className="text-red-700 border-red-300 hover:bg-red-50"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Try Again
              </Button>
            )}

            {onClear && (
              <Button onClick={onClear} variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthErrorDisplay
