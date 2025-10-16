import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import useRequireAuth from '@/hooks/useRequireAuth'

/**
 * Contact Us Page
 *
 * Placeholder page for contact form functionality.
 *
 * @component
 * @example
 * ```tsx
 * <Route path="/contact-us" element={<ContactUsPage />} />
 * ```
 *
 * @features
 * - Authentication guard (useRequireAuth)
 * - TODO: Contact form implementation
 */
const ContactUsPage: React.FC = () => {
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
