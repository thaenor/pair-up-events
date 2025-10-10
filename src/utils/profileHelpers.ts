import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

import { PROFILE_MESSAGES } from '@/constants/profile';
import { logError } from '@/utils/logger';

/**
 * Formats a timestamp into a readable date string
 */
export const formatDate = (timestamp: string | number | Date | Timestamp | undefined): string => {
  if (!timestamp) return 'Unknown';

  try {
    let date: Date;

    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'object' && 'toDate' in timestamp) {
      date = (timestamp as { toDate: () => Date }).toDate();
    } else {
      date = new Date(String(timestamp));
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    logError('Error formatting date', error, {
      component: 'profileHelpers',
      action: 'formatDate',
      additionalData: { timestamp }
    });
    return 'Invalid date';
  }
};

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
      toast.error('Unable to share or copy to clipboard');
      throw new Error('Unable to share or copy to clipboard');
    }
  }
};
