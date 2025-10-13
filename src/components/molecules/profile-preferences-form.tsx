import React, { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import type { UserProfile, UserProfileUpdate } from '@/types/user-profile';

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
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    setFunFact(profile?.funFact ?? '');
    setLikes(profile?.likes ?? '');
    setDislikes(profile?.dislikes ?? '');
    setHobbies(profile?.hobbies ?? '');
    setEmailNotifications(Boolean(profile?.settings?.emailNotifications));
    setPushNotifications(Boolean(profile?.settings?.pushNotifications));
  }, [profile]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();

    const updates: UserProfileUpdate = {
      funFact: funFact.trim() || null,
      likes: likes.trim() || null,
      dislikes: dislikes.trim() || null,
      hobbies: hobbies.trim() || null,
      settings: {
        emailNotifications,
        pushNotifications,
      },
    };

    try {
      await onSubmit(updates);
      toast.success(PROFILE_MESSAGES.ALERTS.PREFERENCES_SAVE_SUCCESS);
    } catch {
      toast.error(PROFILE_MESSAGES.ALERTS.PREFERENCES_SAVE_ERROR);
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
        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80 md:col-span-2">
          {PROFILE_COPY.PREFERENCES.FUN_FACT_LABEL}
          <textarea
            value={funFact}
            onChange={event => setFunFact(event.target.value)}
            disabled={isDisabled}
            className="mt-2 h-24 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.PREFERENCES.FUN_FACT_PLACEHOLDER}
            data-testid="profile-preferences-fun-fact"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          {PROFILE_COPY.PREFERENCES.LIKES_LABEL}
          <textarea
            value={likes}
            onChange={event => setLikes(event.target.value)}
            disabled={isDisabled}
            className="mt-2 h-24 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.PREFERENCES.LIKES_PLACEHOLDER}
            data-testid="profile-preferences-likes"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
          {PROFILE_COPY.PREFERENCES.DISLIKES_LABEL}
          <textarea
            value={dislikes}
            onChange={event => setDislikes(event.target.value)}
            disabled={isDisabled}
            className="mt-2 h-24 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.PREFERENCES.DISLIKES_PLACEHOLDER}
            data-testid="profile-preferences-dislikes"
          />
        </label>

        <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80 md:col-span-2">
          {PROFILE_COPY.PREFERENCES.HOBBIES_LABEL}
          <textarea
            value={hobbies}
            onChange={event => setHobbies(event.target.value)}
            disabled={isDisabled}
            className="mt-2 h-24 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            placeholder={PROFILE_COPY.PREFERENCES.HOBBIES_PLACEHOLDER}
            data-testid="profile-preferences-hobbies"
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 p-4 md:grid-cols-2">
        <label className="flex items-start space-x-3 text-sm text-pairup-darkBlue">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={event => setEmailNotifications(event.target.checked)}
            disabled={isDisabled}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            data-testid="profile-preferences-email"
          />
          <span>
            <span className="block font-semibold">{PROFILE_COPY.PREFERENCES.EMAIL_NOTIFICATIONS_LABEL}</span>
            <span className="block text-pairup-darkBlue/70">{PROFILE_COPY.PREFERENCES.EMAIL_NOTIFICATIONS_DESCRIPTION}</span>
          </span>
        </label>

        <label className="flex items-start space-x-3 text-sm text-pairup-darkBlue">
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={event => setPushNotifications(event.target.checked)}
            disabled={isDisabled}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-pairup-cyan focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
            data-testid="profile-preferences-push"
          />
          <span>
            <span className="block font-semibold">{PROFILE_COPY.PREFERENCES.PUSH_NOTIFICATIONS_LABEL}</span>
            <span className="block text-pairup-darkBlue/70">{PROFILE_COPY.PREFERENCES.PUSH_NOTIFICATIONS_DESCRIPTION}</span>
          </span>
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center rounded-lg border border-pairup-cyan bg-white px-5 py-2 text-sm font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-cyan/20 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="profile-preferences-submit"
        >
          {isSaving ? PROFILE_COPY.PREFERENCES.SUBMIT_LOADING : PROFILE_COPY.PREFERENCES.SUBMIT_IDLE}
        </button>
      </div>
    </form>
  );
};

export default ProfilePreferencesForm;
