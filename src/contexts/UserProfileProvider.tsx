import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { missingFirebaseConfig } from '@/lib/firebase';
import { subscribeToUserProfile, updateUserProfile } from '@/lib/firebase/user-profile';
import type { UserProfile, UserProfileUpdate } from '@/types/user-profile';
import { useAuth } from '@/hooks/useAuth';
import { UserProfileContext } from './UserProfileContext';

export type UserProfileContextValue = {
  profile: UserProfile | null;
  loading: boolean;
  isSaving: boolean;
  error: string | null;
  saveProfile: (updates: UserProfileUpdate) => Promise<void>;
};

type UserProfileProviderProps = {
  children: React.ReactNode;
};

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileUnavailableMessage = missingFirebaseConfig.length > 0
    ? 'Profile customization is disabled because Firebase credentials are not configured in this environment.'
    : 'Unable to load your profile right now.';

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setError(null);
      setLoading(authLoading);
      return undefined;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserProfile(
      user.uid,
      data => {
        setProfile(data);
        setLoading(false);
      },
      () => {
        setError(profileUnavailableMessage);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [authLoading, profileUnavailableMessage, user]);

  const saveProfile = useCallback(
    async (updates: UserProfileUpdate) => {
      if (!user) {
        throw new Error('Cannot update profile without an authenticated user.');
      }

      setIsSaving(true);
      setError(null);

      try {
        await updateUserProfile(user.uid, updates);
      } catch (updateError) {
        if (updateError instanceof Error && updateError.message.includes('not configured')) {
          setError('Profile customization is disabled in this environment.');
        } else {
          setError('We couldn\'t save your changes. Please try again.');
        }
        throw updateError;
      } finally {
        setIsSaving(false);
      }
    },
    [user],
  );

  const value = useMemo(
    () => ({
      profile,
      loading,
      isSaving,
      error,
      saveProfile,
    }),
    [profile, loading, isSaving, error, saveProfile],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
};
