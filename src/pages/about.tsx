import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'

/**
 * About Page
 *
 * Provides information about the PairUp Events platform and team.
 * This page is accessible to both logged-in and logged-out users.
 *
 * @component
 * @example
 * ```tsx
 * <Route path="/about" element={<AboutPage />} />
 * ```
 *
 * @features
 * - Public access (no authentication required)
 * - TODO: About us content implementation
 */
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-32 pb-20 md:pb-8">
        {/* TODO: Add about us content */}
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-4">About Us</h1>
          <p className="text-xl text-pairup-darkBlue/70">Coming soon...</p>
        </div>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default AboutPage
