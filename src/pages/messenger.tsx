import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import useRequireAuth from '@/hooks/useRequireAuth'

const MessengerPage: React.FC = () => {
  const { loading } = useRequireAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-pairup-cream flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2">Messenger</h1>
        </div>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default MessengerPage
