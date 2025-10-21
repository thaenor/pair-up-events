import React, { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button, Textarea } from '@/components';
import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import type { UserProfile, UserProfileUpdate } from '@/types/user-profile';
import { trackProfileEvent, trackFormEvent } from '@/lib/analytics';

export type ProfilePreferencesFormProps = {
  profile: UserProfile | null;
  onSubmit: (updates: UserProfileUpdate) => Promise<void>;
  isSaving: boolean;
};

export const ProfilePreferencesForm: React.FC<ProfilePreferencesFormProps> = ({
  profile,
  onSubmit,
  isSaving,
}) => {
  const isDisabled = isSaving;
  const [funFact, setFunFact] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [hobbies, setHobbies] = useState('');

  useEffect(() => {
    setFunFact(profile?.funFact ?? '');
    setLikes(profile?.likes ?? '');
    setDislikes(profile?.dislikes ?? '');
    setHobbies(profile?.hobbies ?? '');
  }, [profile]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    // Track form submission start
    trackFormEvent('profile_preferences', 'start');

    const updates: UserProfileUpdate = {
      funFact: funFact.trim() || null,
      likes: likes.trim() || null,
      dislikes: dislikes.trim() || null,
      hobbies: hobbies.trim() || null,
    };

    try {
      await onSubmit(updates);
      toast.success(PROFILE_MESSAGES.ALERTS.PREFERENCES_SAVE_SUCCESS);
      
      // Track successful form submission
      trackFormEvent('profile_preferences', 'submit');
      trackProfileEvent('update', 'preferences');
    } catch {
      toast.error(PROFILE_MESSAGES.ALERTS.PREFERENCES_SAVE_ERROR);
      
      // Track form error
      trackFormEvent('profile_preferences', 'error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="profile-preferences-form"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-pairup-darkBlue">{PROFILE_COPY.PREFERENCES.TITLE}</h3>
        <p className="text-sm text-pairup-darkBlue/70">{PROFILE_COPY.PREFERENCES.DESCRIPTION}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="fun-fact" className="block text-sm font-medium text-pairup-darkBlue/80 mb-2">
            {PROFILE_COPY.PREFERENCES.FUN_FACT_LABEL}
          </label>
          <Textarea
            id="fun-fact"
            value={funFact}
            onChange={event => setFunFact(event.target.value)}
            disabled={isDisabled}
            className="h-24"
            placeholder={PROFILE_COPY.PREFERENCES.FUN_FACT_PLACEHOLDER}
            data-testid="profile-preferences-fun-fact"
          />
        </div>

        <div>
          <label htmlFor="likes" className="block text-sm font-medium text-pairup-darkBlue/80 mb-2">
            {PROFILE_COPY.PREFERENCES.LIKES_LABEL}
          </label>
          <Textarea
            id="likes"
            value={likes}
            onChange={event => setLikes(event.target.value)}
            disabled={isDisabled}
            className="h-24"
            placeholder={PROFILE_COPY.PREFERENCES.LIKES_PLACEHOLDER}
            data-testid="profile-preferences-likes"
          />
        </div>

        <div>
          <label htmlFor="dislikes" className="block text-sm font-medium text-pairup-darkBlue/80 mb-2">
            {PROFILE_COPY.PREFERENCES.DISLIKES_LABEL}
          </label>
          <Textarea
            id="dislikes"
            value={dislikes}
            onChange={event => setDislikes(event.target.value)}
            disabled={isDisabled}
            className="h-24"
            placeholder={PROFILE_COPY.PREFERENCES.DISLIKES_PLACEHOLDER}
            data-testid="profile-preferences-dislikes"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="hobbies" className="block text-sm font-medium text-pairup-darkBlue/80 mb-2">
            {PROFILE_COPY.PREFERENCES.HOBBIES_LABEL}
          </label>
          <Textarea
            id="hobbies"
            value={hobbies}
            onChange={event => setHobbies(event.target.value)}
            disabled={isDisabled}
            className="h-24"
            placeholder={PROFILE_COPY.PREFERENCES.HOBBIES_PLACEHOLDER}
            data-testid="profile-preferences-hobbies"
          />
        </div>
      </div>


      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          variant="secondary"
          size="md"
          loading={isSaving}
          loadingText={PROFILE_COPY.PREFERENCES.SUBMIT_LOADING}
          data-testid="profile-preferences-submit"
        >
          {PROFILE_COPY.PREFERENCES.SUBMIT_IDLE}
        </Button>
      </div>
    </form>
  );
};

export default ProfilePreferencesForm;
