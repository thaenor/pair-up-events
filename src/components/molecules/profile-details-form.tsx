import React, { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button, FormField, Input, Select } from '@/components';
import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import type { UserProfile, UserProfileUpdate, Gender } from '@/types';
import { GENDER } from '@/types';
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
        <FormField
          label="First Name"
          id="profile-first-name"
          error={errors.firstName}
          required
          errorTestId="profile-details-first-name-error"
        >
          <Input
            id="profile-first-name"
            type="text"
            value={firstName}
            onChange={event => setFirstName(event.target.value)}
            disabled={isDisabled}
            placeholder="Enter your first name"
            data-testid="profile-details-first-name"
            aria-label="Your first name"
          />
        </FormField>

        <FormField
          label={PROFILE_COPY.DETAILS.DISPLAY_NAME_LABEL}
          id="profile-display-name"
          error={errors.displayName}
          required
          errorTestId="profile-details-display-name-error"
        >
          <Input
            id="profile-display-name"
            type="text"
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            disabled={isDisabled}
            placeholder={PROFILE_COPY.DETAILS.DISPLAY_NAME_PLACEHOLDER}
            data-testid="profile-details-display-name"
            aria-label="Your display name"
          />
        </FormField>


        <FormField
          label={PROFILE_COPY.DETAILS.BIRTH_DATE_LABEL}
          id="profile-birth-date"
          error={errors.birthDate}
          required
          errorTestId="profile-details-birth-date-error"
        >
          <Input
            id="profile-birth-date"
            type="date"
            value={birthDate}
            onChange={event => setBirthDate(event.target.value)}
            disabled={isDisabled}
            placeholder={PROFILE_COPY.DETAILS.BIRTH_DATE_PLACEHOLDER}
            data-testid="profile-details-birth-date"
            aria-label="Your birth date"
          />
        </FormField>

        <FormField
          label={PROFILE_COPY.DETAILS.GENDER_LABEL}
          id="profile-gender"
          error={errors.gender}
          required
          errorTestId="profile-details-gender-error"
        >
          <Select
            id="profile-gender"
            value={gender}
            onChange={event => setGender(event.target.value as Gender | '')}
            disabled={isDisabled}
            data-testid="profile-details-gender"
            aria-label="Your gender"
          >
            <option value="">{PROFILE_COPY.DETAILS.GENDER_PLACEHOLDER}</option>
            <option value={GENDER.MALE}>Male</option>
            <option value={GENDER.FEMALE}>Female</option>
            <option value={GENDER.NON_BINARY}>Non-binary</option>
            <option value={GENDER.PREFER_NOT_TO_SAY}>Prefer not to say</option>
          </Select>
        </FormField>

      </div>


      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSaving}
          loadingText={PROFILE_COPY.DETAILS.SUBMIT_LOADING}
          data-testid="profile-details-submit"
        >
          {PROFILE_COPY.DETAILS.SUBMIT_IDLE}
        </Button>
      </div>
    </form>
  );
};

export default ProfileDetailsForm;
