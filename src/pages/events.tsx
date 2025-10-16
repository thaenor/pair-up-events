import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'

const EventsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-24 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-4 flex items-center justify-center">My Events</h1>
        </div>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default EventsPage
