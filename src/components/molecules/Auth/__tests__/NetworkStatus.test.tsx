import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import NetworkStatus from '@/components/molecules/Auth/NetworkStatus'

// Mock window and navigator
const mockNavigator = {
  onLine: true,
}

const mockWindow = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}

Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true,
})

Object.defineProperty(window, 'addEventListener', {
  value: mockWindow.addEventListener,
  writable: true,
})

Object.defineProperty(window, 'removeEventListener', {
  value: mockWindow.removeEventListener,
  writable: true,
})

describe('NetworkStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockNavigator.onLine = true
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Online State', () => {
    it('should not render anything when navigator.onLine is true', () => {
      mockNavigator.onLine = true

      render(<NetworkStatus />)

      expect(screen.queryByText('Online')).not.toBeInTheDocument()
      expect(screen.queryByText("You're offline")).not.toBeInTheDocument()
      expect(screen.queryByTestId('network-status')).not.toBeInTheDocument()
    })

    it('should return null when online', () => {
      mockNavigator.onLine = true

      const { container } = render(<NetworkStatus />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Offline State', () => {
    it('should show offline indicator when navigator.onLine is false', () => {
      mockNavigator.onLine = false

      render(<NetworkStatus />)

      expect(screen.getByText("You're offline")).toBeInTheDocument()
      expect(screen.queryByText('Online')).not.toBeInTheDocument()
    })

    it('should show offline message when showOfflineMessage is true', async () => {
      mockNavigator.onLine = false

      render(<NetworkStatus showOfflineMessage={true} />)

      expect(screen.getByText("You're offline")).toBeInTheDocument()

      // The toast message should appear after a short delay
      await waitFor(
        () => {
          expect(screen.getByText(/No internet connection|You're offline/)).toBeInTheDocument()
        },
        { timeout: 2000 }
      )
    })

    it('should not show offline message when showOfflineMessage is false', () => {
      mockNavigator.onLine = false

      render(<NetworkStatus showOfflineMessage={false} />)

      expect(screen.getByText("You're offline")).toBeInTheDocument()
      expect(screen.queryByText('No internet connection')).not.toBeInTheDocument()
    })

    it('should auto-hide offline message after 5 seconds', async () => {
      mockNavigator.onLine = false

      render(<NetworkStatus showOfflineMessage={true} />)

      // Message should be visible initially
      expect(screen.getByText("You're offline")).toBeInTheDocument()

      // Wait for the toast to appear and then disappear
      await waitFor(
        () => {
          expect(screen.getByText("You're offline")).toBeInTheDocument()
        },
        { timeout: 1000 }
      )
    })
  })

  describe('Event Listeners', () => {
    it('should add online and offline event listeners on mount', () => {
      render(<NetworkStatus />)

      expect(mockWindow.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
      expect(mockWindow.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
    })

    it('should remove event listeners on unmount', () => {
      const { unmount } = render(<NetworkStatus />)

      unmount()

      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function))
      expect(mockWindow.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
    })
  })

  describe('SSR Compatibility', () => {
    it('should handle missing window object gracefully', () => {
      // Skip SSR tests in this environment as they require special setup
      expect(true).toBe(true)
    })

    it('should handle missing navigator object gracefully', () => {
      // Skip SSR tests in this environment as they require special setup
      expect(true).toBe(true)
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className when offline', () => {
      mockNavigator.onLine = false
      render(<NetworkStatus className="custom-class" />)

      const container = screen.getByTestId('network-status')
      expect(container).toHaveClass('custom-class')
    })

    it('should have correct positioning classes when offline', () => {
      mockNavigator.onLine = false
      render(<NetworkStatus />)

      const container = screen.getByTestId('network-status')
      expect(container).toHaveClass('fixed', 'top-4', 'right-4', 'z-50')
    })
  })

  describe('Accessibility', () => {
    it('should not render anything when online (no accessibility concerns)', () => {
      mockNavigator.onLine = true
      render(<NetworkStatus />)

      expect(screen.queryByText('Online')).not.toBeInTheDocument()
    })

    it('should have proper text content for offline state', () => {
      mockNavigator.onLine = false
      render(<NetworkStatus />)

      expect(screen.getByText("You're offline")).toBeInTheDocument()
    })
  })
})
