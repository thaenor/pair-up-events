import React from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import ProfilePictureUpload from '@/components/molecules/Profile/profile-picture-upload'
import ProfileDetailsForm from '@/components/molecules/Profile/profile-details-form'
import ProfilePreferencesForm from '@/components/molecules/Profile/profile-preferences-form'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import useRequireAuth from '@/hooks/useRequireAuth'

const ProfilePage: React.FC = () => {
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
      <div className="container mx-auto px-4 py-8 max-w-2xl pt-32 pb-20 md:pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2">Your Profile</h1>
        </div>

        <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-pairup-darkBlue mb-2">Welcome to your profile</h2>
          <p className="text-pairup-darkBlue/80">Manage your account settings and preferences here.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8 text-center">
          <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">Profile Picture</h3>
          <ProfilePictureUpload
            currentPhotoUrl={null}
            onPhotoUpdate={async () => {
              // TODO: Implement photo upload to Firebase Storage
            }}
            isLoading={false}
          />
        </div>

        <ProfileDetailsForm
          profile={null}
          onSubmit={async () => {
            // TODO: Save profile details to Firestore
          }}
          isSaving={false}
        />

        <ProfilePreferencesForm
          profile={null}
          onSubmit={async () => {
            // TODO: Save profile preferences to Firestore
          }}
          isSaving={false}
        />
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default ProfilePage
