import React, { useState, useEffect } from 'react'
import { WifiOff, AlertCircle } from 'lucide-react'

interface NetworkStatusProps {
  className?: string
  showOfflineMessage?: boolean
}

/**
 * Network status indicator component
 *
 * Shows current network connectivity status and provides offline indicators.
 * Automatically detects network state changes and updates UI accordingly.
 *
 * @param className - Additional CSS classes
 * @param showOfflineMessage - Whether to show offline message when disconnected
 */
const NetworkStatus: React.FC<NetworkStatusProps> = ({ className = '', showOfflineMessage = true }) => {
  const [isOnline, setIsOnline] = useState(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return navigator.onLine
    }
    return true // Default to online for SSR
  })
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    // Only add event listeners in browser environment
    if (typeof window === 'undefined') {
      return
    }

    const handleOnline = () => {
      setIsOnline(true)
      setShowMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      if (showOfflineMessage) {
        setShowMessage(true)
        // Auto-hide message after 5 seconds
        setTimeout(() => setShowMessage(false), 5000)
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [showOfflineMessage])

  if (!isOnline) {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`} data-testid="network-status">
        <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">You're offline</span>
        </div>

        {showMessage && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 max-w-sm">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">No internet connection</p>
                <p className="mt-1">Some features may not work properly. Please check your connection.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Don't render anything when online - only show offline status
  return null
}

export default NetworkStatus
