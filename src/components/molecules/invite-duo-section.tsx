import React, { useMemo, useState } from 'react';
import { LinkIcon, Share2, UserPlus, X } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { clearActiveDuoInvite, setActiveDuoInvite } from '@/lib/firebase/user-profile';
import type { ActiveDuoInvite } from '@/types/user-profile';
import {
  createDuoInviteLink,
  createDuoInviteMessage,
  generateDuoInviteToken,
  shareOrCopyToClipboard,
} from '@/utils/profileHelpers';
import { logError } from '@/utils/logger';

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const InviteDuoSectionComponent: React.FC = () => {
  const { profile, loading } = useUserProfile();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const invite = profile?.activeDuoInvite ?? null;

  const inviteLink = useMemo(() => {
    if (!profile?.id || !invite?.slug) {
      return '';
    }

    return createDuoInviteLink(profile.id, invite.slug);
  }, [invite?.slug, profile?.id]);

  const isInviteExpired = useMemo(() => {
    if (!invite) {
      return false;
    }

    return invite.expiresAt.toMillis() < Date.now();
  }, [invite]);

  const inviteStatusMessage = useMemo(() => {
    if (!invite) {
      return PROFILE_COPY.INVITE_DUO.STATUS_NONE;
    }

    if (invite.status === 'accepted') {
      return PROFILE_COPY.INVITE_DUO.STATUS_ACCEPTED;
    }

    if (isInviteExpired || invite.status === 'expired') {
      return PROFILE_COPY.INVITE_DUO.STATUS_EXPIRED;
    }

    if (invite.status === 'pending') {
      const formattedDate = invite.expiresAt.toDate().toLocaleDateString();
      return PROFILE_COPY.INVITE_DUO.STATUS_PENDING.replace('{DATE}', formattedDate);
    }

    return PROFILE_COPY.INVITE_DUO.STATUS_NONE;
  }, [invite, isInviteExpired]);

  const canShareInvite = Boolean(invite && invite.status === 'pending' && !isInviteExpired);
  const canRevokeInvite = Boolean(invite && invite.status === 'pending');

  const handleGenerateInvite = async () => {
    if (!profile?.id) {
      return;
    }

    setIsGenerating(true);

    try {
      const { rawToken, tokenHash } = await generateDuoInviteToken();
      const now = Timestamp.now();
      const expiresAt = Timestamp.fromMillis(now.toMillis() + INVITE_TTL_MS);

      const newInvite: ActiveDuoInvite = {
        slug: rawToken,
        tokenHash,
        status: 'pending',
        createdAt: now,
        expiresAt,
      };

      await setActiveDuoInvite(profile.id, newInvite);
      toast.success(PROFILE_MESSAGES.INVITE_DUO.SUCCESS);
    } catch (error) {
      logError('Failed to generate duo invite', error, {
        component: 'InviteDuoSection',
        action: 'handleGenerateInvite',
        additionalData: { userId: profile?.id },
      });
      toast.error(PROFILE_MESSAGES.INVITE_DUO.ERROR);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyInvite = async () => {
    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success(PROFILE_MESSAGES.INVITE_DUO.COPIED);
    } catch (error) {
      logError('Failed to copy invite link', error, {
        component: 'InviteDuoSection',
        action: 'handleCopyInvite',
      });
      toast.error(PROFILE_COPY.GENERAL.SHARE_FALLBACK_ERROR);
    }
  };

  const handleShareInvite = async () => {
    if (!profile?.id || !invite || !inviteLink || !canShareInvite) {
      return;
    }

    setIsSharing(true);

    try {
      const message = createDuoInviteMessage(inviteLink);
      await shareOrCopyToClipboard({
        title: PROFILE_MESSAGES.INVITE_DUO.TITLE,
        text: message,
        url: inviteLink,
      });

      toast.success(PROFILE_MESSAGES.INVITE_DUO.SHARE_SUCCESS);

      await setActiveDuoInvite(profile.id, {
        ...invite,
        lastSharedAt: Timestamp.now(),
      });
    } catch (error) {
      logError('Failed to share duo invite', error, {
        component: 'InviteDuoSection',
        action: 'handleShareInvite',
        additionalData: { userId: profile?.id },
      });
      toast.error(PROFILE_MESSAGES.INVITE_DUO.ERROR);
    } finally {
      setIsSharing(false);
    }
  };

  const handleRevokeInvite = async () => {
    if (!profile?.id || !invite || !canRevokeInvite) {
      return;
    }

    setIsRevoking(true);

    try {
      await clearActiveDuoInvite(profile.id);
      toast.success(PROFILE_MESSAGES.INVITE_DUO.REVOKED);
    } catch (error) {
      logError('Failed to revoke duo invite', error, {
        component: 'InviteDuoSection',
        action: 'handleRevokeInvite',
        additionalData: { userId: profile?.id },
      });
      toast.error(PROFILE_MESSAGES.INVITE_DUO.ERROR);
    } finally {
      setIsRevoking(false);
    }
  };

  const isActionDisabled = loading || isGenerating || isSharing || isRevoking;

  return (
    <section
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="invite-duo-section"
    >
      <div className="flex items-start gap-4 mb-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pairup-cyan/20 text-pairup-darkBlue">
          <UserPlus className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-pairup-darkBlue mb-1">
            {PROFILE_MESSAGES.INVITE_DUO.TITLE}
          </h3>
          <p className="text-sm text-pairup-darkBlue/70">
            {PROFILE_MESSAGES.INVITE_DUO.DESCRIPTION}
          </p>
        </div>
      </div>

      <label className="flex flex-col text-sm font-medium text-pairup-darkBlue/80">
        {PROFILE_COPY.INVITE_DUO.FIELD_LABEL}
        <input
          type="text"
          value={inviteLink}
          readOnly
          placeholder={PROFILE_COPY.INVITE_DUO.STATUS_NONE}
          className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-pairup-darkBlue shadow-sm focus:border-pairup-cyan focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
          data-testid="invite-duo-link"
        />
      </label>

      <p className="mt-3 text-sm text-pairup-darkBlue/70" data-testid="invite-duo-status">
        {inviteStatusMessage}
      </p>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={handleGenerateInvite}
          disabled={isActionDisabled}
          className="inline-flex items-center gap-2 rounded-lg border border-pairup-darkBlue bg-transparent px-5 py-2 text-sm font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-darkBlue hover:text-white focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="invite-duo-generate"
        >
          <LinkIcon className="h-4 w-4" />
          {isGenerating ? PROFILE_COPY.INVITE_DUO.LOADING_LABEL : PROFILE_COPY.INVITE_DUO.GENERATE_LABEL}
        </button>

        <button
          type="button"
          onClick={handleCopyInvite}
          disabled={!inviteLink || isActionDisabled || !canShareInvite}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-pairup-darkBlue transition-colors hover:border-pairup-darkBlue focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="invite-duo-copy"
        >
          <LinkIcon className="h-4 w-4" />
          {PROFILE_COPY.INVITE_DUO.COPY_LABEL}
        </button>

        <button
          type="button"
          onClick={handleShareInvite}
          disabled={!inviteLink || isActionDisabled || !canShareInvite}
          className="inline-flex items-center gap-2 rounded-lg border border-pairup-cyan bg-pairup-cyan/10 px-4 py-2 text-sm font-medium text-pairup-darkBlue transition-colors hover:bg-pairup-cyan hover:text-pairup-darkBlue focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="invite-duo-share"
        >
          <Share2 className="h-4 w-4" />
          {PROFILE_COPY.INVITE_DUO.SHARE_LABEL}
        </button>

        <button
          type="button"
          onClick={handleRevokeInvite}
          disabled={!canRevokeInvite || isActionDisabled}
          className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          data-testid="invite-duo-revoke"
        >
          <X className="h-4 w-4" />
          {PROFILE_COPY.INVITE_DUO.REVOKE_LABEL}
        </button>
      </div>
    </section>
  );
};

const InviteDuoSection = React.memo(InviteDuoSectionComponent);
InviteDuoSection.displayName = 'InviteDuoSection';

export default InviteDuoSection;
