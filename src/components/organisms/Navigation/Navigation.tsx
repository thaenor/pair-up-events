import React, { useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Compass, Calendar, MessageCircle, User, LogIn, UserPlus, Menu } from 'lucide-react'
import { toast } from 'sonner'

import Logo from '../../atoms/Logo'
import useAuth from '@/hooks/useAuth'
import Sidebar from './Sidebar'

/**
 * Main navigation component with authentication-aware UI
 *
 * Displays different navigation based on authentication state:
 * - Logged out: Shows "How It Works", "Benefits", "Early Access" links + Login/Sign Up buttons
 * - Logged in: Shows "Explore", "My Events", "Messenger", "My Profile" + burger menu with sidebar
 *
 * @component
 *
 * @example
 * ```tsx
 * <Navigation />
 * ```
 *
 * @features
 * - Real-time authentication state tracking via useAuth hook
 * - Responsive design (burger menu on mobile/desktop for logged-in users)
 * - Active route highlighting
 * - Burger menu opens sidebar with Settings, Invite, Contact, About, Privacy, Terms, Logout
 * - Smooth animations and micro-interactions
 * - Full keyboard accessibility
 */
const Navigation: React.FC = React.memo(() => {
  // No props needed - uses useAuth hook internally for authentication state
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogin = () => {
    navigate('/login')
  }

  const handleSignUp = () => {
    navigate('/signup')
  }

  const handleNavigateToProfile = () => {
    navigate('/profile')
  }

  const handleNavigateToEvents = () => {
    navigate('/events')
  }

  const handleNavigateToMessenger = () => {
    navigate('/messenger')
  }

  const handleNavigateToExplore = () => {
    navigate('/')
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      const result = await logout()

      if (result.success) {
        setIsSidebarOpen(false)
        toast.success('Logged out successfully!')
        navigate('/')
      } else {
        toast.error(result.error || 'Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An unexpected error occurred during logout')
    } finally {
      setIsLoggingOut(false)
    }
  }, [logout, navigate])

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  return (
    <nav
      className="py-4 w-full absolute top-0 left-0 z-10 bg-pairup-darkBlue shadow-2xl"
      aria-label="Main navigation"
      data-testid="main-navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Logo size="md" />

        {user ? (
          // Logged in user navigation
          <>
            <div className="hidden md:flex items-center gap-6" role="menubar">
              <button
                onClick={handleNavigateToExplore}
                className={`flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1 relative ${isActiveRoute('/') ? 'font-bold' : ''}`}
                aria-label="Explore homepage"
                role="menuitem"
              >
                <Compass className="w-4 h-4" />
                <span className={isActiveRoute('/') ? 'underline decoration-2 underline-offset-4' : ''}>Explore</span>
              </button>
              <button
                onClick={handleNavigateToEvents}
                className={`flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1 relative ${isActiveRoute('/events') ? 'font-bold' : ''}`}
                aria-label="Navigate to my events"
                role="menuitem"
              >
                <Calendar className="w-4 h-4" />
                <span className={isActiveRoute('/events') ? 'underline decoration-2 underline-offset-4' : ''}>
                  My Events
                </span>
              </button>
              <button
                onClick={handleNavigateToMessenger}
                className={`flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1 relative ${isActiveRoute('/messenger') ? 'font-bold' : ''}`}
                aria-label="Navigate to messenger"
                role="menuitem"
              >
                <MessageCircle className="w-4 h-4" />
                <span className={isActiveRoute('/messenger') ? 'underline decoration-2 underline-offset-4' : ''}>
                  Messenger
                </span>
              </button>
              <button
                onClick={handleNavigateToProfile}
                className={`flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1 relative ${isActiveRoute('/profile') ? 'font-bold' : ''}`}
                aria-label="Navigate to my profile"
                role="menuitem"
              >
                <User className="w-4 h-4" />
                <span className={isActiveRoute('/profile') ? 'underline decoration-2 underline-offset-4' : ''}>
                  My Profile
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4 mr-4">
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center w-10 h-10 text-pairup-cream hover:text-pairup-yellow hover:bg-pairup-cyan/10 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue"
                aria-label="Open menu"
                aria-expanded={isSidebarOpen}
                data-testid="burger-menu-button"
              >
                <Menu className={`w-6 h-6 transition-transform duration-200 ${isSidebarOpen ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </>
        ) : (
          // Logged out user navigation
          <>
            <div className="hidden md:flex items-center gap-6" role="menubar">
              <a
                href="#how-it-works"
                className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                aria-label="Learn how PairUp works"
                role="menuitem"
              >
                How It Works
              </a>
              <a
                href="#benefits"
                className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                aria-label="Learn about PairUp benefits"
                role="menuitem"
              >
                Benefits
              </a>
              <a
                href="#early-access"
                className="text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-2 py-1"
                aria-label="Join Early Access"
                role="menuitem"
              >
                Early Access
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 mr-4">
              <button
                className="flex items-center gap-2 text-pairup-cream hover:text-pairup-yellow duration-300 focus:outline-none focus:ring-2 focus:ring-pairup-cyan focus:ring-offset-2 focus:ring-offset-pairup-darkBlue rounded-md px-4 py-2 font-medium"
                onClick={handleLogin}
                aria-label="Navigate to login page"
                data-testid="login-button"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[5px] font-medium transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-6 py-3 text-base bg-pairup-yellow text-pairup-darkBlue hover:opacity-90"
                onClick={handleSignUp}
                aria-label="Navigate to signup page"
                data-testid="signup-button"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          </>
        )}
      </div>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onLogout={handleLogout} isLoggingOut={isLoggingOut} />
    </nav>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation
