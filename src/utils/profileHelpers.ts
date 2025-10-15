import { Timestamp } from 'firebase/firestore';
import { toast } from 'sonner';

import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import { logError } from '@/utils/logger';

const BASE64_URL_REPLACER: Record<string, string> = {
  '+': '-',
  '/': '_',
  '=': '',
};

const PROFILE_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/**
 * Formats a timestamp into a readable date string
 */
export const formatDate = (timestamp: string | number | Date | Timestamp | undefined): string => {
  if (!timestamp) return PROFILE_COPY.GENERAL.UNKNOWN_VALUE;

  try {
    let date: Date | undefined;

    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    }

    if (!date) {
      return PROFILE_COPY.GENERAL.UNKNOWN_VALUE;
    }

    if (Number.isNaN(date.getTime())) {
      throw new Error('Invalid date value');
    }

    return PROFILE_DATE_FORMATTER.format(date);
  } catch (error) {
    logError('Error formatting date', error, {
      component: 'profileHelpers',
      action: 'formatDate',
      additionalData: { timestamp }
    });
    return PROFILE_COPY.GENERAL.INVALID_DATE;
  }
};

/**
 * Creates the invite friend message with the current origin URL
 */
export const createInviteMessage = (): string => {
  return PROFILE_MESSAGES.INVITE_FRIEND.MESSAGE.replace('{URL}', window.location.origin);
};

/**
 * Creates the invite duo message with the current origin URL
 */
export const createDuoInviteMessage = (inviteUrl: string): string => {
  return PROFILE_MESSAGES.INVITE_DUO.MESSAGE.replace('{URL}', inviteUrl);
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

const toBase64Url = (bytes: ArrayBuffer): string => {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  const base64 = btoa(binary);

  return base64
    .replace(/[+/=]/g, char => BASE64_URL_REPLACER[char] ?? char);
};

export const hashDuoInviteToken = async (rawToken: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(rawToken));
  return toBase64Url(hashBuffer);
};

export const generateDuoInviteToken = async (): Promise<{ rawToken: string; tokenHash: string }> => {
  const rawToken = crypto.randomUUID().replace(/-/g, '');

  return {
    rawToken,
    tokenHash: await hashDuoInviteToken(rawToken),
  };
};

export const createDuoInviteLink = (inviterId: string, token: string): string => {
  const baseUrl = window.location.origin.replace(/\/$/u, '');
  return `${baseUrl}/invite/${inviterId}/${token}`;
};
