import React, { useState } from 'react'
import Navigation from '@/components/organisms/Navigation/Navigation'
import MobileBottomNavigation from '@/components/organisms/Navigation/MobileBottomNavigation'
import ProfilePictureUpload from '@/components/molecules/Profile/profile-picture-upload'
import ProfileDetailsForm from '@/components/molecules/Profile/profile-details-form'
import ProfilePreferencesForm from '@/components/molecules/Profile/profile-preferences-form'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import useRequireAuth from '@/hooks/useRequireAuth'
import { useUserProfile } from '@/contexts/UserContext'
import { splitUserUpdates } from '@/entities/user/user-data-helpers'

const ProfilePage: React.FC = () => {
  const { loading: authLoading } = useRequireAuth()
  const { userProfile, loading: profileLoading, updateProfile, error } = useUserProfile()
  const [isSaving, setIsSaving] = useState(false)

  const loading = authLoading || profileLoading

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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 text-sm">Error loading profile: {error.message}</p>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8 text-center">
          <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">Profile Picture</h3>
          <ProfilePictureUpload
            currentPhotoUrl={userProfile?.public?.photoURL || userProfile?.private?.photoURL || null}
            onPhotoUpdate={async (photoURL: string | null) => {
              await updateProfile({
                private: { photoURL: photoURL || undefined },
                public: { photoURL: photoURL || undefined },
              })
            }}
            isLoading={isSaving}
          />
        </div>

        <ProfileDetailsForm
          profile={{
            firstName: userProfile?.public?.firstName || userProfile?.private?.firstName,
            lastName: userProfile?.public?.lastName || userProfile?.private?.lastName,
            email: userProfile?.private?.email,
            birthDate: userProfile?.private?.birthDate
              ? new Date(userProfile.private.birthDate).toISOString().split('T')[0]
              : '',
            gender: userProfile?.public?.gender || userProfile?.private?.gender,
            bio: userProfile?.public?.bio,
          }}
          onSubmit={async updates => {
            setIsSaving(true)
            try {
              const unifiedUpdates: Record<string, unknown> = {}

              if (updates.firstName) unifiedUpdates.firstName = updates.firstName
              if (updates.lastName !== undefined) unifiedUpdates.lastName = updates.lastName || undefined

              // Only include email if it actually changed (email is immutable in Firestore)
              // Email changes should be handled through Firebase Auth updateEmail() method
              if (updates.email && updates.email !== userProfile?.private?.email) {
                // Email change detected - skip Firestore update for email
                // TODO: Implement email change through Firebase Auth if needed
                // For now, we skip email updates to avoid permission errors
                console.warn(
                  'Email changes are not supported through profile updates. Use Firebase Auth to change email.'
                )
              }

              if (updates.birthDate) {
                unifiedUpdates.birthDate = new Date(updates.birthDate)
              }
              if (updates.gender) unifiedUpdates.gender = updates.gender
              if (updates.bio !== undefined) unifiedUpdates.bio = updates.bio

              const { private: privateUpdates, public: publicUpdates } = splitUserUpdates(unifiedUpdates)

              await updateProfile({ private: privateUpdates, public: publicUpdates })
            } finally {
              setIsSaving(false)
            }
          }}
          isSaving={isSaving}
        />

        <ProfilePreferencesForm
          profile={{
            funFact: userProfile?.private?.funFact,
            hobbies: userProfile?.private?.hobbies
              ? userProfile.private.hobbies.split(',').map((h: string) => h.trim())
              : [],
            preferredVibes: userProfile?.private?.preferences?.preferredVibes || [],
            ageRangePreference: userProfile?.private?.preferences?.ageRange,
          }}
          onSubmit={async updates => {
            setIsSaving(true)
            try {
              const privateUpdates: Record<string, unknown> = {}

              if (updates.funFact !== undefined) privateUpdates.funFact = updates.funFact
              if (updates.hobbies !== undefined) privateUpdates.hobbies = updates.hobbies.join(', ')

              // Merge preferences correctly - ensure all required fields are present
              const existingPreferences = userProfile?.private?.preferences
              const preferencesUpdate = {
                ageRange: updates.ageRangePreference ?? existingPreferences?.ageRange ?? { min: 18, max: 65 },
                preferredGenders: existingPreferences?.preferredGenders ?? [],
                preferredVibes: updates.preferredVibes ?? existingPreferences?.preferredVibes ?? [],
              }
              privateUpdates.preferences = preferencesUpdate

              await updateProfile({ private: privateUpdates })
            } finally {
              setIsSaving(false)
            }
          }}
          isSaving={isSaving}
        />
      </div>
      <MobileBottomNavigation />
    </div>
  )
}

export default ProfilePage
