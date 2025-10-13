import React, { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import type { UserProfile, UserProfileUpdate } from '@/types/user-profile';

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
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    setDisplayName(profile?.displayName ?? '');
    setPhotoUrl(profile?.photoUrl ?? '');
    setTimezone(profile?.timezone ?? '');
    setBirthDate(profile?.birthDate ?? '');
    setGender(profile?.gender ?? '');
  }, [profile]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const updates: UserProfileUpdate = {
      displayName: displayName.trim(),
      photoUrl: photoUrl.trim() || null,
      timezone: timezone.trim() || null,
      gender: gender.trim() || null,
      birthDate: birthDate.trim() || null,
    };

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
          <h3 className="text-lg font-semibold text-pairup-darkBlue">{PROFILE_COPY.DETAILS.TITLE}</h3>
          <p className="text-sm text-pairup-darkBlue/70">{PROFILE_COPY.DETAILS.DESCRIPTION}</p>
        </div>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={PROFILE_COPY.SNAPSHOT.AVATAR_ALT}
            className="hidden h-16 w-16 rounded-full object-cover sm:block"
          />
        ) : null}
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
          {PROFILE_COPY.DETAILS.TIMEZONE_LABEL}
          <input
            type="text"
            value={timezone}
            onChange={event => setTimezone(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.DETAILS.TIMEZONE_PLACEHOLDER}
            data-testid="profile-details-timezone"
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
          <input
            type="text"
            value={gender}
            onChange={event => setGender(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.DETAILS.GENDER_PLACEHOLDER}
            data-testid="profile-details-gender"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80 md:col-span-2">
          {PROFILE_COPY.DETAILS.PHOTO_LABEL}
          <input
            type="url"
            value={photoUrl}
            onChange={event => setPhotoUrl(event.target.value)}
            disabled={isDisabled}
            className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.DETAILS.PHOTO_PLACEHOLDER}
            data-testid="profile-details-photo"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-1 rounded-lg bg-pairup-cyan/10 px-4 py-3 text-sm text-pairup-darkBlue sm:flex-row sm:items-center sm:justify-between">
        <span>{PROFILE_COPY.DETAILS.EMAIL_LABEL}</span>
        <span
          className="font-medium break-words text-right sm:text-left"
          data-testid="profile-details-email"
        >
          {profile?.email ?? PROFILE_COPY.DETAILS.EMAIL_FALLBACK}
        </span>
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
