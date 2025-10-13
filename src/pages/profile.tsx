import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ProfileSection from '@/components/molecules/profile-section';
import AccountControls from '@/components/molecules/account-controls';
import InviteFriendSection from '@/components/molecules/invite-friend-section';
import InviteDuoSection from '@/components/molecules/invite-duo-section';
import { useAuth } from '@/hooks/useAuth';
import { PROFILE_CONFIG } from '@/constants/profile';
import { useUserProfile } from '@/hooks/useUserProfile';
import ProfileDetailsForm from '@/components/molecules/profile-details-form';
import ProfilePreferencesForm from '@/components/molecules/profile-preferences-form';
import ProfileStatsCard from '@/components/molecules/profile-stats-card';
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
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <img src="/Logo.png" alt="PairUp Events" className="h-12 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-pairup-darkBlue mb-2">Your Profile</h1>
                </div>

                {/* Welcome Message */}
                <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-pairup-darkBlue mb-2">
                        Welcome back! 👋
                    </h2>
                    <p className="text-pairup-darkBlue/80">
                        Thanks for being part of the PairUp Events community. We're excited to have you on this journey as we build something amazing together!
                    </p>
                </div>

                {/* User Information */}
                <ProfileSection profile={profile} />

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

                <ProfileStatsCard stats={profile?.stats} />

                {/* Survey Link */}
                <div className="bg-pairup-cyan/10 border border-pairup-cyan/30 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-pairup-darkBlue mb-3">
                        Help Us Build Something Amazing! 🚀
                    </h3>
                    <p className="text-pairup-darkBlue/80 mb-4">
                        Thank you for creating an account! If you're interested in helping us shape the future of PairUp Events,
                        we'd love to hear your thoughts and feedback.
                    </p>
                    <a
                        href={PROFILE_CONFIG.SURVEY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-pairup-cyan text-pairup-darkBlue font-medium rounded-lg hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan transition-colors"
                    >
                        Share Your Feedback
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>

                {/* Invite Duo */}
                <InviteDuoSection />

                {/* Invite Friend */}
                <InviteFriendSection />

                {/* Firebase Controls */}
                <AccountControls user={user} />

                {/* Development Notice */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                    <p className="text-yellow-800 text-sm">
                        🚧 This app is currently in development. Thank you for your patience as we build something amazing!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
