import { PROFILE_MESSAGES } from '@/constants/profile';

/**
 * Formats a timestamp into a readable date string
 */
export const formatDate = (timestamp: string | number | Date | undefined): string => {
  if (!timestamp) return 'Unknown';

  try {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
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
  return !!(navigator.share && navigator.canShare?.(shareData));
};

/**
 * Attempts to share using the Web Share API, falls back to clipboard
 */
export const shareOrCopyToClipboard = async (shareData: ShareData): Promise<void> => {
  try {
    if (canUseWebShare(shareData)) {
      await navigator.share!(shareData);
      return;
    }

    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareData.text || '');
    alert(PROFILE_MESSAGES.INVITE_FRIEND.SUCCESS_COPY);
  } catch (error) {
    console.error('Share failed:', error);

    // Final fallback
    try {
      await navigator.clipboard.writeText(shareData.text || '');
      alert(PROFILE_MESSAGES.INVITE_FRIEND.SUCCESS_COPY);
    } catch (clipboardError) {
      console.error('Clipboard fallback failed:', clipboardError);
      throw new Error('Unable to share or copy to clipboard');
    }
  }
};
