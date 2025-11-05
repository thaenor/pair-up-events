import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Compass, Calendar, MessageCircle, User } from 'lucide-react'

const MobileBottomNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Helper function to check if a route is active
  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  const handleNavigateToExplore = () => {
    navigate('/')
  }

  const handleNavigateToEvents = () => {
    navigate('/events')
  }

  const handleNavigateToMessenger = () => {
    navigate('/messenger')
  }

  const handleNavigateToProfile = () => {
    navigate('/profile')
  }

  const navigationItems = [
    {
      label: 'Explore',
      icon: Compass,
      onClick: handleNavigateToExplore,
      path: '/',
      ariaLabel: 'Navigate to homepage',
    },
    {
      label: 'My Events',
      icon: Calendar,
      onClick: handleNavigateToEvents,
      path: '/events',
      ariaLabel: 'Navigate to my events',
    },
    {
      label: 'Messenger',
      icon: MessageCircle,
      onClick: handleNavigateToMessenger,
      path: '/messenger',
      ariaLabel: 'Navigate to messenger',
    },
    {
      label: 'My Profile',
      icon: User,
      onClick: handleNavigateToProfile,
      path: '/profile',
      ariaLabel: 'Navigate to my profile',
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-pairup-darkBlue border-t border-pairup-cyan/20 md:hidden"
      aria-label="Mobile navigation"
      data-testid="mobile-bottom-navigation"
    >
      <div className="flex items-center justify-around py-2">
        {navigationItems.map(item => {
          const Icon = item.icon
          const isActive = isActiveRoute(item.path)

          return (
            <button
              key={item.path}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${
                isActive ? 'text-pairup-yellow' : 'text-pairup-cream hover:text-pairup-yellow'
              }`}
              aria-label={item.ariaLabel}
              role="menuitem"
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-pairup-yellow' : ''}`} />
              <span className={`text-xs font-medium truncate ${isActive ? 'text-pairup-yellow' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-pairup-yellow rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNavigation
