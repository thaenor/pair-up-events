import React, { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import type { UserProfile, UserProfileUpdate } from '@/types/user-profile';
import { trackProfileEvent, trackFormEvent } from '@/lib/analytics';

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
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    setDisplayName(profile?.displayName ?? '');
    setBirthDate(profile?.birthDate ?? '');
    setGender(profile?.gender ?? '');
  }, [profile]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    // Track form submission start
    trackFormEvent('profile_details', 'start');

    const updates: UserProfileUpdate = {
      displayName: displayName.trim(),
      gender: gender.trim() || null,
      birthDate: birthDate.trim() || null,
    };

    try {
      await onSubmit(updates);
      toast.success(PROFILE_MESSAGES.ALERTS.PROFILE_SAVE_SUCCESS);
      
      // Track successful form submission
      trackFormEvent('profile_details', 'submit');
      trackProfileEvent('update', 'details');
    } catch {
      toast.error(PROFILE_MESSAGES.ALERTS.PROFILE_SAVE_ERROR);
      
      // Track form error
      trackFormEvent('profile_details', 'error');
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
          <h3 className="text-lg font-semibold text-pairup-darkBlue">{PROFILE_COPY.DETAILS.TITLE}</h3>
          <p className="text-sm text-pairup-darkBlue/70">{PROFILE_COPY.DETAILS.DESCRIPTION}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          {PROFILE_COPY.DETAILS.DISPLAY_NAME_LABEL}
          <input
            type="text"
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.DETAILS.DISPLAY_NAME_PLACEHOLDER}
            data-testid="profile-details-display-name"
          />
        </label>


        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          {PROFILE_COPY.DETAILS.BIRTH_DATE_LABEL}
          <input
            type="date"
            value={birthDate}
            onChange={event => setBirthDate(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.DETAILS.BIRTH_DATE_PLACEHOLDER}
            data-testid="profile-details-birth-date"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          {PROFILE_COPY.DETAILS.GENDER_LABEL}
          <select
            value={gender}
            onChange={event => setGender(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            data-testid="profile-details-gender"
          >
            <option value="">{PROFILE_COPY.DETAILS.GENDER_PLACEHOLDER}</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </label>

      </div>


      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center rounded-lg border border-pairup-cyan bg-pairup-cyan px-5 py-2 text-sm font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="profile-details-submit"
        >
          {isSaving ? PROFILE_COPY.DETAILS.SUBMIT_LOADING : PROFILE_COPY.DETAILS.SUBMIT_IDLE}
        </button>
      </div>
    </form>
  );
};

export default ProfileDetailsForm;
