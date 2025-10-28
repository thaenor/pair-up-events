import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'

/**
 * Contact Us Page
 *
 * Placeholder page for contact form functionality.
 * This page is accessible to both logged-in and logged-out users.
 *
 * @component
 * @example
 * ```tsx
 * <Route path="/contact-us" element={<ContactUsPage />} />
 * ```
 *
 * @features
 * - Public access (no authentication required)
 * - TODO: Contact form implementation
 */
const ContactUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-pairup-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-32 pb-20 md:pb-8">
        {/* TODO: Add contact form UI */}
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-4">Contact Us</h1>
          <p className="text-xl text-pairup-darkBlue/70">Coming soon...</p>
        </div>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default ContactUsPage
