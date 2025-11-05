import React, { useState } from 'react'
import { RefreshCw, Loader2 } from 'lucide-react'
import Button from '../../atoms/button'

interface AuthRetryButtonProps {
  onRetry: () => Promise<void>
  error?: string
  maxRetries?: number
  retryCount?: number
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Authentication retry button component
 *
 * Provides a retry button specifically for authentication operations with
 * loading states, retry count tracking, and exponential backoff.
 *
 * @param onRetry - Async function to execute on retry
 * @param error - Error message to display
 * @param maxRetries - Maximum number of retry attempts
 * @param retryCount - Current retry count
 * @param className - Additional CSS classes
 * @param variant - Button variant
 * @param size - Button size
 */
const AuthRetryButton: React.FC<AuthRetryButtonProps> = ({
  onRetry,
  error,
  maxRetries = 3,
  retryCount = 0,
  className = '',
  variant = 'outline',
  size = 'md',
}) => {
  const [isRetrying, setIsRetrying] = useState(false)
  const [localRetryCount, setLocalRetryCount] = useState(retryCount)

  const handleRetry = async () => {
    if (isRetrying || localRetryCount >= maxRetries) {
      return
    }

    setIsRetrying(true)
    setLocalRetryCount(prev => prev + 1)

    try {
      await onRetry()
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  const canRetry = localRetryCount < maxRetries && !isRetrying
  const isMaxRetriesReached = localRetryCount >= maxRetries

  const getButtonText = () => {
    if (isRetrying) {
      return 'Retrying...'
    }
    if (isMaxRetriesReached) {
      return `Max retries reached (${maxRetries})`
    }
    if (localRetryCount > 0) {
      return `Try Again (${localRetryCount}/${maxRetries})`
    }
    return 'Try Again'
  }

  const getDelayText = () => {
    if (localRetryCount === 0) return ''

    const delay = Math.min(1000 * Math.pow(2, localRetryCount - 1), 10000)
    return `Next retry in ${delay / 1000}s`
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        onClick={handleRetry}
        disabled={!canRetry}
        variant={variant}
        size={size}
        className="w-full"
        aria-label={getButtonText()}
      >
        {isRetrying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
        {getButtonText()}
      </Button>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      {localRetryCount > 0 && !isMaxRetriesReached && (
        <p className="text-xs text-gray-500 text-center">{getDelayText()}</p>
      )}

      {isMaxRetriesReached && (
        <div className="text-center">
          <p className="text-sm text-red-600 mb-2">Maximum retry attempts reached</p>
          <p className="text-xs text-gray-500">Please check your connection or contact support</p>
        </div>
      )}
    </div>
  )
}

export default AuthRetryButton
