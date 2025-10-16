import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import AccountControls from '@/components/molecules/account-controls';
import InviteFriendSection from '@/components/molecules/invite-friend-section';
import Navigation from '@/components/organisms/Navigation';
import MobileBottomNavigation from '@/components/organisms/MobileBottomNavigation';
import { useAuth } from '@/hooks/useAuth';
import { PROFILE_COPY } from '@/constants/profile';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileDetailsForm from '@/components/molecules/profile-details-form';
import ProfilePreferencesForm from '@/components/molecules/profile-preferences-form';
import type { UserProfileUpdate } from '@/types/user-profile';

const ProfilePage: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const { profile, loading: profileLoading, error: profileError, isSaving, saveProfile } = useUserProfile();
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    const handleSaveProfile = useCallback(
        (updates: UserProfileUpdate) => saveProfile(updates),
        [saveProfile]
    );

    if (authLoading || profileLoading) {
        return (
            <div className="min-h-screen bg-pairup-cream flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-pairup-cream">
            <Navigation />
            <div className="container mx-auto px-4 py-8 max-w-2xl pt-24 pb-20 md:pb-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <img src="/Logo.png" alt={PROFILE_COPY.HEADER.LOGO_ALT} className="h-12 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2">{PROFILE_COPY.HEADER.TITLE}</h1>
                </div>

                {/* Welcome Message */}
                <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-pairup-darkBlue mb-2">{PROFILE_COPY.HEADER.WELCOME_TITLE}</h2>
                    <p className="text-pairup-darkBlue/80">{PROFILE_COPY.HEADER.WELCOME_BODY}</p>
                </div>

                {profileError ? (
                    <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        {profileError}
                    </div>
                ) : null}

                <ProfileDetailsForm
                    profile={profile}
                    onSubmit={handleSaveProfile}
                    isSaving={isSaving}
                />

                <ProfilePreferencesForm
                    profile={profile}
                    onSubmit={handleSaveProfile}
                    isSaving={isSaving}
                />

                {/* Invite Friend */}
                <InviteFriendSection />

                {/* Firebase Controls */}
                <AccountControls user={user} />

            </div>
            <MobileBottomNavigation />
        </div>
    );
};

export default ProfilePage;
