import React, { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { UserProfile, UserProfileUpdate } from '@/types/user-profile';
import { PROFILE_MESSAGES } from '@/constants/profile';

export type ProfileDetailsFormProps = {
  profile: UserProfile | null;
  onSubmit: (updates: UserProfileUpdate) => Promise<void>;
  isSaving: boolean;
};

export const ProfileDetailsForm: React.FC<ProfileDetailsFormProps> = ({
  profile,
  onSubmit,
  isSaving,
}) => {
  const isDisabled = isSaving;
  const [displayName, setDisplayName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [timezone, setTimezone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    setDisplayName(profile?.displayName ?? '');
    setPhotoUrl(profile?.photoUrl ?? '');
    setTimezone(profile?.timezone ?? '');
    setAge(profile?.age ? String(profile.age) : '');
    setGender(profile?.gender ?? '');
  }, [profile]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const updates: UserProfileUpdate = {
      displayName: displayName.trim(),
      photoUrl: photoUrl.trim() || null,
      timezone: timezone.trim() || null,
      gender: gender.trim() || null,
    };

    if (age.trim()) {
      const parsedAge = Number(age);
      updates.age = Number.isNaN(parsedAge) ? null : parsedAge;
    } else {
      updates.age = null;
    }

    try {
      await onSubmit(updates);
      toast.success(PROFILE_MESSAGES.ALERTS.PROFILE_SAVE_SUCCESS);
    } catch {
      toast.error(PROFILE_MESSAGES.ALERTS.PROFILE_SAVE_ERROR);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="profile-details-form"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-pairup-darkBlue">Profile details</h3>
          <p className="text-sm text-pairup-darkBlue/70">Update how other duos see you across PairUp.</p>
        </div>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile preview"
            className="hidden h-16 w-16 rounded-full object-cover sm:block"
          />
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          Display name
          <input
            type="text"
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Add your name"
            data-testid="profile-details-display-name"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          Timezone
          <input
            type="text"
            value={timezone}
            onChange={event => setTimezone(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="e.g. America/Los_Angeles"
            data-testid="profile-details-timezone"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          Age
          <input
            type="number"
            min={0}
            value={age}
            onChange={event => setAge(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Add your age"
            data-testid="profile-details-age"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          Gender
          <input
            type="text"
            value={gender}
            onChange={event => setGender(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="How do you identify?"
            data-testid="profile-details-gender"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80 md:col-span-2">
          Profile photo URL
          <input
            type="url"
            value={photoUrl}
            onChange={event => setPhotoUrl(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Paste a link to your photo"
            data-testid="profile-details-photo"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-pairup-cyan/10 px-4 py-3 text-sm text-pairup-darkBlue">
        <span>Email</span>
        <span className="font-medium" data-testid="profile-details-email">
          {profile?.email ?? 'Not available'}
        </span>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center rounded-lg border border-pairup-cyan bg-pairup-cyan px-5 py-2 text-sm font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="profile-details-submit"
        >
          {isSaving ? 'Saving…' : 'Save details'}
        </button>
      </div>
    </form>
  );
};

export default ProfileDetailsForm;
