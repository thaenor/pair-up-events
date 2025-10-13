import React, { useCallback } from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import { createInviteMessage, shareOrCopyToClipboard } from '@/utils/profileHelpers';
import { logError } from '@/utils/logger';

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
      logError('Share failed', error, {
        component: 'InviteFriendSection',
        action: 'shareOrCopyToClipboard',
        additionalData: { shareData }
      });
      toast.error(PROFILE_MESSAGES.INVITE_FRIEND.ERROR_SHARE);
    }
  }, []);

  return (
    <div
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="invite-friend-section"
    >
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-3 flex items-center">
        <Share2 className="h-5 w-5 mr-2 text-pairup-cyan" />
        {PROFILE_COPY.INVITE_FRIEND.TITLE}
      </h3>
      <p className="text-gray-600 mb-4">{PROFILE_COPY.INVITE_FRIEND.DESCRIPTION}</p>
      <button
        onClick={handleInviteFriend}
        className="inline-flex items-center px-6 py-3 bg-pairup-cyan text-pairup-darkBlue font-medium rounded-lg hover:bg-pairup-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pairup-cyan transition-colors"
        data-testid="invite-friend-button"
      >
        <Share2 className="h-4 w-4 mr-2" />
        {PROFILE_COPY.INVITE_FRIEND.CTA}
      </button>
    </div>
  );
});

InviteFriendSection.displayName = 'InviteFriendSection';

export default InviteFriendSection;
