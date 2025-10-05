import React from 'react';
import { User } from 'firebase/auth';
import { Mail, Calendar, User as UserIcon } from 'lucide-react';

import { formatDate } from '@/utils/profileHelpers';

export type ProfileSectionProps = {
  user: User;
};

const ProfileSection: React.FC<ProfileSectionProps> = React.memo(({ user }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4 flex items-center">
        <UserIcon className="h-5 w-5 mr-2 text-pairup-cyan" />
        Account Information
      </h3>

      <div className="space-y-4">
        <div className="flex items-center">
          <Mail className="h-5 w-5 mr-3 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-pairup-darkBlue">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-3 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Account Created</p>
            <p className="text-pairup-darkBlue">{formatDate(user.metadata?.creationTime)}</p>
          </div>
        </div>

        {user.metadata?.lastSignInTime && (
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-3 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Last Sign In</p>
              <p className="text-pairup-darkBlue">{formatDate(user.metadata.lastSignInTime)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ProfileSection.displayName = 'ProfileSection';

export default ProfileSection;
