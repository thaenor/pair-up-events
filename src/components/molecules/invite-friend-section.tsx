import React, { useCallback } from 'react';
import { Share2 } from 'lucide-react';

import { PROFILE_MESSAGES } from '@/constants/profile';
import { createInviteMessage, shareOrCopyToClipboard } from '@/utils/profileHelpers';

const InviteFriendSection: React.FC = React.memo(() => {
  const handleInviteFriend = useCallback(async () => {
    const customMessage = createInviteMessage();

    const shareData = {
      title: PROFILE_MESSAGES.INVITE_FRIEND.TITLE,
      text: customMessage,
      url: window.location.origin
    };

    try {
      await shareOrCopyToClipboard(shareData);
    } catch (error) {
      console.error('Share failed:', error);
      alert('Unable to share. Please try again.');
    }
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-3 flex items-center">
        <Share2 className="h-5 w-5 mr-2 text-pairup-cyan" />
        Invite a Friend
      </h3>
      <p className="text-gray-600 mb-4">
        Know someone who would love PairUp Events? Share the app with them!
      </p>
      <button
        onClick={handleInviteFriend}
        className="inline-flex items-center px-6 py-3 bg-pairup-cyan text-pairup-darkBlue font-medium rounded-lg hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan transition-colors"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Invite Friend
      </button>
    </div>
  );
});

InviteFriendSection.displayName = 'InviteFriendSection';

export default InviteFriendSection;
