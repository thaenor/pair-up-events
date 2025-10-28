import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Settings, UserPlus, Mail, Info, FileText, Shield, LogOut } from 'lucide-react'

import LoadingSpinner from '@/components/atoms/LoadingSpinner'

/**
 * Props for the Sidebar component
 *
 * @typedef {Object} SidebarProps
 * @property {boolean} isOpen - Whether the sidebar is currently open
 * @property {Function} onClose - Callback function to close the sidebar
 * @property {Function} onLogout - Callback function to handle logout
 * @property {boolean} isLoggingOut - Whether logout is in progress
 */
export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
  isLoggingOut: boolean
}

/**
 * Sidebar navigation menu component
 *
 * A sliding sidebar that provides navigation options and logout functionality.
 * Features include accessibility support, keyboard navigation, and smooth animations.
 *
 * @component
 * @param {SidebarProps} props - Component props
 * @param {boolean} props.isOpen - Controls sidebar visibility
 * @param {Function} props.onClose - Handler to close the sidebar
 * @param {Function} props.onLogout - Handler to execute logout
 * @param {boolean} props.isLoggingOut - Loading state for logout operation
 *
 * @example
 * ```tsx
 * <Sidebar
 *   isOpen={isSidebarOpen}
 *   onClose={closeSidebar}
 *   onLogout={handleLogout}
 *   isLoggingOut={isLoggingOut}
 * />
 * ```
 *
 * @features
 * - Keyboard accessibility (ESC to close, Tab navigation)
 * - Focus trapping when open
 * - Smooth slide-in animation from right
 * - Menu items: Settings, Invite, Contact, About, Privacy, Terms, Logout
 * - Loading states during logout
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout, isLoggingOut }) => {
  const navigate = useNavigate()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Handle ESC key to close sidebar
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Trap focus within sidebar
  useEffect(() => {
    if (!isOpen) return

    const currentRef = sidebarRef.current
    if (!currentRef) return

    const focusableElements = currentRef.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    currentRef.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      currentRef.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  const handleNavigation = (path: string) => {
    onClose()
    navigate(path)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
        data-testid="sidebar-backdrop"
        style={{ zIndex: 30 }}
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-pairup-darkBlue shadow-2xl z-40 transition-all duration-300 ease-out ${
          isOpen ? 'right-0' : 'right-[-100%]'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
        style={{ zIndex: 40 }}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-pairup-cyan/20">
            <h2 className="text-xl font-semibold text-pairup-cream">Menu</h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 text-pairup-cream hover:text-pairup-yellow hover:bg-pairup-cyan/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue hover:rotate-90"
              aria-label="Close menu"
              data-testid="close-sidebar-button"
            >
              <X className="w-6 h-6 transition-transform duration-200" />
            </button>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Side navigation">
            <div className="space-y-2">
              {/* Settings */}
              <button
                onClick={() => handleNavigation('/settings')}
                className="w-full flex items-center gap-3 px-4 py-3 text-pairup-cream hover:text-pairup-yellow hover:bg-pairup-cyan/10 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
                aria-label="Navigate to settings"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>

              {/* Invite a Friend */}
              <button
                onClick={() => handleNavigation('/invite')}
                className="w-full flex items-center gap-3 px-4 py-3 text-pairup-cream hover:text-pairup-yellow hover:bg-pairup-cyan/10 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
                aria-label="Navigate to invite page"
              >
                <UserPlus className="w-5 h-5" />
                <span className="font-medium">Invite a Friend</span>
              </button>

              {/* Contact Us */}
              <button
                onClick={() => handleNavigation('/contact-us')}
                className="w-full flex items-center gap-3 px-4 py-3 text-pairup-cream hover:text-pairup-yellow hover:bg-pairup-cyan/10 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
                aria-label="Navigate to contact page"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">Contact Us</span>
              </button>

              {/* About Us */}
              <button
                onClick={() => handleNavigation('/about')}
                className="w-full flex items-center gap-3 px-4 py-3 text-pairup-cream hover:text-pairup-yellow hover:bg-pairup-cyan/10 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
                aria-label="Navigate to about page"
              >
                <Info className="w-5 h-5" />
                <span className="font-medium">About Us</span>
              </button>

              {/* Privacy Policy */}
              <button
                onClick={() => handleNavigation('/privacy-policy')}
                className="w-full flex items-center gap-3 px-4 py-3 text-pairup-cream hover:text-pairup-yellow hover:bg-pairup-cyan/10 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
                aria-label="Navigate to privacy policy"
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Privacy Policy</span>
              </button>

              {/* Terms and Conditions */}
              <button
                onClick={() => handleNavigation('/terms-of-service')}
                className="w-full flex items-center gap-3 px-4 py-3 text-pairup-cream hover:text-pairup-yellow hover:bg-pairup-cyan/10 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
                aria-label="Navigate to terms and conditions"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Terms and Conditions</span>
              </button>

              {/* Divider */}
              <div className="border-t border-pairup-cyan/20 my-4" />

              {/* Logout */}
              <button
                onClick={onLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-50/10 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                aria-label="Logout"
                data-testid="sidebar-logout-button"
              >
                {isLoggingOut ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="font-medium">Logging Out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </>
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

Sidebar.displayName = 'Sidebar'

export default Sidebar
