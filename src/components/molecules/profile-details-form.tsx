import React, { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import type { UserProfile, UserProfileUpdate, Gender } from '@/types';
import { validateFirstName, validateDisplayName, validateBirthDate, validateGender } from '@/types';
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
  const [firstName, setFirstName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFirstName(profile?.firstName ?? '');
    setDisplayName(profile?.displayName ?? '');
    setBirthDate(profile?.birthDate ?? '');
    setGender(profile?.gender ?? '');
    setErrors({});
  }, [profile]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else {
      const firstNameResult = validateFirstName(firstName.trim());
      if (!firstNameResult.isValid) {
        newErrors.firstName = firstNameResult.errors[0];
      }
    }

    // Validate display name
    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else {
      const displayNameResult = validateDisplayName(displayName.trim());
      if (!displayNameResult.isValid) {
        newErrors.displayName = displayNameResult.errors[0];
      }
    }

    // Validate birth date
    if (!birthDate.trim()) {
      newErrors.birthDate = 'Birth date is required';
    } else {
      const birthDateResult = validateBirthDate(birthDate.trim());
      if (!birthDateResult.isValid) {
        newErrors.birthDate = birthDateResult.errors[0];
      }
    }

    // Validate gender
    if (!gender) {
      newErrors.gender = 'Gender is required';
    } else {
      const genderResult = validateGender(gender);
      if (!genderResult.isValid) {
        newErrors.gender = genderResult.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    // Track form submission start
    trackFormEvent('profile_details', 'start');

    if (!validateForm()) {
      trackFormEvent('profile_details', 'error');
      return;
    }

    const updates: UserProfileUpdate = {
      firstName: firstName.trim(),
      displayName: displayName.trim(),
      birthDate: birthDate.trim(),
      gender: gender as Gender,
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
        <label htmlFor="profile-first-name" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          First Name *
          <input
            id="profile-first-name"
            type="text"
            value={firstName}
            onChange={event => setFirstName(event.target.value)}
            disabled={isDisabled}
            className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.firstName 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
            }`}
            placeholder="Enter your first name"
            data-testid="profile-details-first-name"
            aria-label="Your first name"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'first-name-error' : undefined}
          />
          {errors.firstName && (
            <p id="first-name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.firstName}
            </p>
          )}
        </label>

        <label htmlFor="profile-display-name" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          {PROFILE_COPY.DETAILS.DISPLAY_NAME_LABEL}
          <input
            id="profile-display-name"
            type="text"
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            disabled={isDisabled}
            className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.displayName 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
            }`}
            placeholder={PROFILE_COPY.DETAILS.DISPLAY_NAME_PLACEHOLDER}
            data-testid="profile-details-display-name"
            aria-label="Your display name"
            aria-invalid={!!errors.displayName}
            aria-describedby={errors.displayName ? 'display-name-error' : undefined}
          />
          {errors.displayName && (
            <p id="display-name-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.displayName}
            </p>
          )}
        </label>


        <label htmlFor="profile-birth-date" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          {PROFILE_COPY.DETAILS.BIRTH_DATE_LABEL}
          <input
            id="profile-birth-date"
            type="date"
            value={birthDate}
            onChange={event => setBirthDate(event.target.value)}
            disabled={isDisabled}
            className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.birthDate 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
            }`}
            placeholder={PROFILE_COPY.DETAILS.BIRTH_DATE_PLACEHOLDER}
            data-testid="profile-details-birth-date"
            aria-label="Your birth date"
            aria-invalid={!!errors.birthDate}
            aria-describedby={errors.birthDate ? 'birth-date-error' : undefined}
          />
          {errors.birthDate && (
            <p id="birth-date-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.birthDate}
            </p>
          )}
        </label>

        <label htmlFor="profile-gender" className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          {PROFILE_COPY.DETAILS.GENDER_LABEL}
          <select
            id="profile-gender"
            value={gender}
            onChange={event => setGender(event.target.value as Gender | '')}
            disabled={isDisabled}
            className={`mt-2 rounded-lg border px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              errors.gender 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 focus:border-pairup-cyan focus:ring-pairup-cyan'
            }`}
            data-testid="profile-details-gender"
            aria-label="Your gender"
            aria-invalid={!!errors.gender}
            aria-describedby={errors.gender ? 'gender-error' : undefined}
          >
            <option value="">{PROFILE_COPY.DETAILS.GENDER_PLACEHOLDER}</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          {errors.gender && (
            <p id="gender-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.gender}
            </p>
          )}
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
