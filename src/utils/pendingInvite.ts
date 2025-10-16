import { PENDING_DUO_INVITE_STORAGE_KEY } from '@/constants/invites';

export type PendingInvitePayload = {
  inviterId: string;
  token: string;
};

const isPendingInvitePayload = (value: unknown): value is PendingInvitePayload => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.inviterId === 'string' &&
    candidate.inviterId.length > 0 &&
    typeof candidate.token === 'string' &&
    candidate.token.length > 0
  );
};

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const readPendingInvitePayload = (): PendingInvitePayload | null => {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const raw = storage.getItem(PENDING_DUO_INVITE_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (isPendingInvitePayload(parsed)) {
      return parsed;
    }
  } catch {
    // Fall through to removal
  }

  storage.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
  return null;
};

export const getPendingInvitePath = (): string | null => {
  const payload = readPendingInvitePayload();

  if (!payload) {
    return null;
  }

  return `/invite/${payload.inviterId}/${payload.token}`;
};

export const clearPendingInvite = (): void => {
  const storage = getStorage();

  storage?.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
};
