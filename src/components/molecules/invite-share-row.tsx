import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShareButton } from '@/components';

export type InviteShareRowProps = {
  eventId: string | null;
  isDisabled: boolean;
  inviteMessage: string;
};

export const InviteShareRow: React.FC<InviteShareRowProps> = ({
  eventId,
  isDisabled,
  inviteMessage,
}) => {
  const inviteLink = eventId
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${eventId}`
    : 'Your invite link will appear after saving Tab 1';

  const handleCopyLink = async () => {
    if (eventId && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(inviteLink);
        alert('Invite link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link: ', err);
        alert('Failed to copy link.');
      }
    }
  };

  const handleShare = async () => {
    if (eventId && navigator.share) {
      try {
        await navigator.share({
          title: 'PairUp Event Invite',
          text: inviteMessage,
          url: inviteLink,
        });
      } catch (err) {
        console.error('Failed to share link: ', err);
      }
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white/70 p-4">
      <h4 className="text-sm font-semibold text-pairup-darkBlue flex items-center mb-2">
        🔗 Invite your duo
      </h4>
      <p className="text-sm text-pairup-darkBlue/70 mb-3">
        Send an invite link to your partner so they can confirm this duo. You can share it via your preferred app.
      </p>
      <div className="flex flex-col md:flex-row gap-2 md:items-center">
        <input
          type="text"
          readOnly
          value={inviteLink}
          className={twMerge(clsx(
            "w-full rounded-lg border px-3 py-2 text-sm text-pairup-darkBlue bg-gray-50",
            !eventId && "opacity-60"
          ))}
          aria-label="Invite link"
          data-testid="invite-link-input"
        />
        <div className="flex gap-2">
          <ShareButton
            variant="copy"
            onClick={handleCopyLink}
            disabled={!eventId || isDisabled}
            aria-label="Copy invite link"
            data-testid="invite-copy-btn"
          >
            Copy link
          </ShareButton>
          <ShareButton
            variant="share"
            onClick={handleShare}
            disabled={!eventId || isDisabled}
            aria-label="Share invite link"
            data-testid="invite-share-btn"
          >
            Share…
          </ShareButton>
        </div>
      </div>
    </div>
  );
};

export default InviteShareRow;


