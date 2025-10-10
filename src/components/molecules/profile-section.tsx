import React from 'react';
import { Calendar, Globe, Mail, User as UserIcon } from 'lucide-react';

import type { UserProfile } from '@/types/user-profile';
import { formatDate } from '@/utils/profileHelpers';

export type ProfileSectionProps = {
  profile: UserProfile | null;
};

const ProfileSection: React.FC<ProfileSectionProps> = React.memo(({ profile }) => {
  const displayName = profile?.displayName?.trim() || 'Add your display name';
  const email = profile?.email ?? 'Add your email address';
  const timezone = profile?.timezone ?? 'Set your timezone';
  const createdAtLabel = profile?.createdAt ? formatDate(profile.createdAt) : 'Pending';

  return (
    <section
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="profile-section"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-pairup-darkBlue mb-2 flex items-center">
            <UserIcon className="mr-2 h-5 w-5 text-pairup-cyan" />
            Account snapshot
          </h3>
          <p className="text-2xl font-semibold text-pairup-darkBlue" data-testid="profile-display-name">
            {displayName}
          </p>
        </div>
        {profile?.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt="Profile avatar"
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="flex items-center rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 px-4 py-3">
          <Mail className="mr-3 h-5 w-5 text-pairup-darkBlue/60" />
          <div>
            <p className="text-xs uppercase tracking-wide text-pairup-darkBlue/60">Email</p>
            <p className="text-sm font-medium text-pairup-darkBlue" data-testid="profile-email">
              {email}
            </p>
          </div>
        </div>
        <div className="flex items-center rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 px-4 py-3">
          <Globe className="mr-3 h-5 w-5 text-pairup-darkBlue/60" />
          <div>
            <p className="text-xs uppercase tracking-wide text-pairup-darkBlue/60">Timezone</p>
            <p className="text-sm font-medium text-pairup-darkBlue" data-testid="profile-timezone">
              {timezone}
            </p>
          </div>
        </div>
        <div className="flex items-center rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 px-4 py-3">
          <Calendar className="mr-3 h-5 w-5 text-pairup-darkBlue/60" />
          <div>
            <p className="text-xs uppercase tracking-wide text-pairup-darkBlue/60">Joined</p>
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
