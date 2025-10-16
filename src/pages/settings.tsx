import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import AccountControls from '@/components/molecules/Auth/account-controls'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import useRequireAuth from '@/hooks/useRequireAuth'

/**
 * Settings Page
 *
 * Provides account management controls including logout, password reset,
 * and account deletion functionality.
 *
 * @component
 * @example
 * ```tsx
 * <Route path="/settings" element={<SettingsPage />} />
 * ```
 *
 * @features
 * - Authentication guard (useRequireAuth)
 * - Account controls with logout functionality
 * - TODO: Password reset implementation
 * - TODO: Account deletion implementation
 */
const SettingsPage: React.FC = () => {
  const { user, loading } = useRequireAuth()

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
      <div className="container mx-auto px-4 py-8 max-w-2xl pt-32 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2">Settings</h1>
          <p className="text-pairup-darkBlue/70">Manage your account settings and preferences</p>
        </div>

        <AccountControls user={user} />
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default SettingsPage
