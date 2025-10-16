import { toast } from 'sonner';

import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import { logError } from '@/utils/logger';


/**
 * Creates the invite friend message with the current origin URL
 */
export const createInviteMessage = (): string => {
  return PROFILE_MESSAGES.INVITE_FRIEND.MESSAGE.replace('{URL}', window.location.origin);
};


/**
 * Checks if the Web Share API is available and can share the given data
 */
export const canUseWebShare = (shareData: ShareData): boolean => {
  if (!navigator.share) return false;
  if (typeof navigator.canShare !== 'function') return false;
  return navigator.canShare(shareData);
};

/**
 * Attempts to share using the Web Share API, falls back to clipboard
 */
export const shareOrCopyToClipboard = async (shareData: ShareData): Promise<void> => {
  try {
    if (canUseWebShare(shareData)) {
      await navigator.share?.(shareData);
      return;
    }

    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareData.text || '');
    toast.success(PROFILE_MESSAGES.INVITE_FRIEND.SUCCESS_COPY);
  } catch (error) {
    logError('Share failed', error, {
      component: 'profileHelpers',
      action: 'shareOrCopyToClipboard',
      additionalData: { shareData }
    });

    // Final fallback
    try {
      await navigator.clipboard.writeText(shareData.text || '');
      toast.success(PROFILE_MESSAGES.INVITE_FRIEND.SUCCESS_COPY);
    } catch (clipboardError) {
      logError('Clipboard fallback failed', clipboardError, {
        component: 'profileHelpers',
        action: 'shareOrCopyToClipboard',
        additionalData: { shareData, fallbackAttempt: true }
      });
      toast.error(PROFILE_COPY.GENERAL.SHARE_FALLBACK_ERROR);
      throw new Error(PROFILE_COPY.GENERAL.SHARE_FALLBACK_ERROR);
    }
  }
};
