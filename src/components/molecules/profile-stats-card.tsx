import React from 'react';

import { PROFILE_COPY } from '@/constants/profile';
import type { UserProfileStats } from '@/types/user-profile';

export type ProfileStatsCardProps = {
  stats?: UserProfileStats;
};

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({ stats }) => {
  const eventsCreated = stats?.eventsCreated ?? 0;
  const eventsJoined = stats?.eventsJoined ?? 0;

  return (
    <section
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="profile-stats-card"
    >
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">{PROFILE_COPY.STATS.TITLE}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 p-4 text-center">
          <p className="text-sm uppercase tracking-wide text-pairup-darkBlue/70">{PROFILE_COPY.STATS.EVENTS_CREATED_LABEL}</p>
          <p className="mt-2 text-3xl font-bold text-pairup-darkBlue" data-testid="profile-stats-created">
            {eventsCreated}
          </p>
        </div>
        <div className="rounded-lg border border-pairup-cyan/40 bg-pairup-cyan/10 p-4 text-center">
          <p className="text-sm uppercase tracking-wide text-pairup-darkBlue/70">{PROFILE_COPY.STATS.EVENTS_JOINED_LABEL}</p>
          <p className="mt-2 text-3xl font-bold text-pairup-darkBlue" data-testid="profile-stats-joined">
            {eventsJoined}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-pairup-darkBlue/70">{PROFILE_COPY.STATS.FOOTER}</p>
    </section>
  );
};

export default ProfileStatsCard;
