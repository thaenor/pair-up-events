import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import InviteFriendSection from '@/components/molecules/Invite/invite-friend-section'
import useRequireAuth from '@/hooks/useRequireAuth'

/**
 * Invite Page
 *
 * Allows users to invite friends to join the PairUp Events platform.
 *
 * @component
 * @example
 * ```tsx
 * <Route path="/invite" element={<InvitePage />} />
 * ```
 *
 * @features
 * - Authentication guard (useRequireAuth)
 * - Invite friend section with sharing functionality
 */
const InvitePage: React.FC = () => {
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2">Invite a Friend</h1>
          <p className="text-pairup-darkBlue/70">Share PairUp Events with your friends and grow your community</p>
        </div>

        <InviteFriendSection />
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default InvitePage
