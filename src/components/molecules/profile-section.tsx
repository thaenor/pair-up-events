import React from 'react';
import { Calendar, Globe, Mail, User as UserIcon } from 'lucide-react';

import type { UserProfile } from '@/types/user-profile';
import { PROFILE_COPY } from '@/constants/profile';
import { formatDate } from '@/utils/profileHelpers';

export type ProfileSectionProps = {
  profile: UserProfile | null;
  authEmail?: string | null;
};

const ProfileSection: React.FC<ProfileSectionProps> = React.memo(({ profile, authEmail }) => {
  const displayName = profile?.displayName?.trim() || PROFILE_COPY.SNAPSHOT.DISPLAY_NAME_PLACEHOLDER;
  const emailLabel = profile?.email?.trim() || authEmail?.trim() || PROFILE_COPY.SNAPSHOT.EMAIL_PLACEHOLDER;
  const timezone = profile?.timezone ?? PROFILE_COPY.SNAPSHOT.TIMEZONE_PLACEHOLDER;
  const createdAtLabel = profile?.createdAt ? formatDate(profile.createdAt) : PROFILE_COPY.SNAPSHOT.CREATED_PENDING;

  return (
    <section
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="profile-section"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-pairup-darkBlue mb-2 flex items-center">
            <UserIcon className="mr-2 h-5 w-5 text-pairup-cyan" />
            {PROFILE_COPY.SNAPSHOT.TITLE}
          </h3>
          <p className="text-2xl font-semibold text-pairup-darkBlue" data-testid="profile-display-name">
            {displayName}
          </p>
        </div>
        {profile?.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={PROFILE_COPY.SNAPSHOT.AVATAR_ALT}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="flex items-start gap-3 rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 px-4 py-3 min-w-0">
          <Mail className="mt-0.5 h-5 w-5 text-pairup-darkBlue/60" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-pairup-darkBlue/60">{PROFILE_COPY.SNAPSHOT.EMAIL_LABEL}</p>
            <p className="text-sm font-medium text-pairup-darkBlue break-words" data-testid="profile-email">
              {emailLabel}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 px-4 py-3">
          <Globe className="mt-0.5 h-5 w-5 text-pairup-darkBlue/60" />
          <div>
            <p className="text-xs uppercase tracking-wide text-pairup-darkBlue/60">{PROFILE_COPY.SNAPSHOT.TIMEZONE_LABEL}</p>
            <p className="text-sm font-medium text-pairup-darkBlue" data-testid="profile-timezone">
              {timezone}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 px-4 py-3">
          <Calendar className="mt-0.5 h-5 w-5 text-pairup-darkBlue/60" />
          <div>
            <p className="text-xs uppercase tracking-wide text-pairup-darkBlue/60">{PROFILE_COPY.SNAPSHOT.CREATED_LABEL}</p>
            <p className="text-sm font-medium text-pairup-darkBlue" data-testid="profile-created-at">
              {createdAtLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

ProfileSection.displayName = 'ProfileSection';

export default ProfileSection;
