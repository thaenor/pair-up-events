import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import InviteDuoSection from '../invite-duo-section';
import { PROFILE_COPY, PROFILE_MESSAGES } from '@/constants/profile';
import type { ActiveDuoInvite } from '@/types/user-profile';
import type { DuoInviteAcceptance } from '@/types/duo-invite-acceptance';

type MockedUseUserProfileReturn = {
  profile: {
    id: string;
    activeDuoInvite: ActiveDuoInvite | null;
  } | null;
  loading: boolean;
  isSaving: boolean;
  error: string | null;
  saveProfile: () => Promise<void>;
};

const mockUseUserProfileValue: MockedUseUserProfileReturn = {
  profile: {
    id: 'user-123',
    activeDuoInvite: null,
  },
  loading: false,
  isSaving: false,
  error: null,
  saveProfile: async () => undefined,
};

const mockSetActiveDuoInvite = vi.fn();
const mockClearActiveDuoInvite = vi.fn();
const mockFinalizeDuoInviteForInviter = vi.fn();
const mockSubscribeToPendingDuoInviteAcceptances = vi
  .fn<(inviterId: string, onNext: (requests: DuoInviteAcceptance[]) => void) => () => void>()
  .mockReturnValue(() => undefined);
const mockMarkProcessed = vi.fn();
const mockMarkFailed = vi.fn();
const mockGenerateDuoInviteToken = vi.fn(async () => ({
  rawToken: 'token123',
  tokenHash: 'hash123',
}));
const mockHashDuoInviteToken = vi.fn(async () => 'hash123');
const mockCreateDuoInviteLink = vi.fn(() => 'https://pairup.test/invite/user-123/token123');
const mockCreateDuoInviteMessage = vi.fn(() => 'Join me on PairUp! https://pairup.test/invite/user-123/token123');
const mockShareOrCopyToClipboard = vi.fn(async () => undefined);
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockLogError = vi.fn();

vi.mock('@/hooks/useUserProfile', () => ({
  useUserProfile: () => mockUseUserProfileValue,
}));

vi.mock('@/lib/firebase/user-profile', () => ({
  setActiveDuoInvite: (...args: unknown[]) => mockSetActiveDuoInvite(...args),
  clearActiveDuoInvite: (...args: unknown[]) => mockClearActiveDuoInvite(...args),
  finalizeDuoInviteForInviter: (...args: unknown[]) => mockFinalizeDuoInviteForInviter(...args),
}));

vi.mock('@/lib/firebase/duo-invite-acceptances', () => ({
  subscribeToPendingDuoInviteAcceptances: (
    ...args: Parameters<typeof mockSubscribeToPendingDuoInviteAcceptances>
  ) => mockSubscribeToPendingDuoInviteAcceptances(...args),
  markDuoInviteAcceptanceProcessed: (...args: unknown[]) => mockMarkProcessed(...args),
  markDuoInviteAcceptanceFailed: (...args: unknown[]) => mockMarkFailed(...args),
}));

vi.mock('@/utils/profileHelpers', () => ({
  generateDuoInviteToken: (...args: unknown[]) => mockGenerateDuoInviteToken(...args),
  hashDuoInviteToken: (...args: unknown[]) => mockHashDuoInviteToken(...args),
  createDuoInviteLink: (...args: unknown[]) => mockCreateDuoInviteLink(...args),
  createDuoInviteMessage: (...args: unknown[]) => mockCreateDuoInviteMessage(...args),
  shareOrCopyToClipboard: (...args: unknown[]) => mockShareOrCopyToClipboard(...args),
}));

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

vi.mock('@/utils/logger', () => ({
  logError: (...args: unknown[]) => mockLogError(...args),
}));

describe('InviteDuoSection', () => {
  beforeEach(() => {
    mockUseUserProfileValue.profile = {
      id: 'user-123',
      activeDuoInvite: null,
    };
    mockSetActiveDuoInvite.mockReset();
    mockClearActiveDuoInvite.mockReset();
    mockGenerateDuoInviteToken.mockClear();
    mockCreateDuoInviteLink.mockClear();
    mockCreateDuoInviteMessage.mockClear();
    mockShareOrCopyToClipboard.mockClear();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockLogError.mockReset();
    mockFinalizeDuoInviteForInviter.mockReset();
    mockMarkProcessed.mockReset();
    mockMarkFailed.mockReset();
    mockSubscribeToPendingDuoInviteAcceptances.mockClear();

    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders an empty invite link when no invite exists', () => {
    render(<InviteDuoSection />);

    expect(mockSubscribeToPendingDuoInviteAcceptances).toHaveBeenCalled();

    expect(screen.getByTestId('invite-duo-link')).toHaveValue('');
    expect(screen.getByTestId('invite-duo-status')).toHaveTextContent(
      PROFILE_COPY.INVITE_DUO.STATUS_NONE,
    );
    expect(screen.getByTestId('invite-duo-share')).toBeDisabled();
    expect(screen.getByTestId('invite-duo-revoke')).toBeDisabled();
  });

  it('generates a new invite when the user requests one', async () => {
    render(<InviteDuoSection />);

    fireEvent.click(screen.getByTestId('invite-duo-generate'));

    await waitFor(() => {
      expect(mockGenerateDuoInviteToken).toHaveBeenCalled();
    });

    expect(mockSetActiveDuoInvite).toHaveBeenCalledTimes(1);
    const [userId, invitePayload] = mockSetActiveDuoInvite.mock.calls[0];

    expect(userId).toBe('user-123');
    expect(invitePayload).toEqual(
      expect.objectContaining({
        slug: 'token123',
        tokenHash: 'hash123',
        status: 'pending',
      }),
    );
    expect(invitePayload.createdAt).toBeInstanceOf(Timestamp);
    expect(invitePayload.expiresAt).toBeInstanceOf(Timestamp);
    expect(mockToastSuccess).toHaveBeenCalledWith(PROFILE_MESSAGES.INVITE_DUO.SUCCESS);
  });

  it('processes queued acceptance requests for the current user', async () => {
    const subscribers: Array<(requests: DuoInviteAcceptance[]) => void> = [];
    mockSubscribeToPendingDuoInviteAcceptances.mockImplementation((_, onNext) => {
      subscribers.push(onNext);
      return () => undefined;
    });

    render(<InviteDuoSection />);

    const request: DuoInviteAcceptance = {
      id: 'req-1',
      inviterId: 'user-123',
      partnerId: 'partner-999',
      tokenHash: 'hash-xyz',
      status: 'pending',
      partnerName: 'Partner 999',
      partnerEmail: 'partner@example.com',
      inviterName: 'Inviter',
      createdAt: Timestamp.now(),
    };

    subscribers.forEach(callback => callback([request]));

    await waitFor(() => {
      expect(mockFinalizeDuoInviteForInviter).toHaveBeenCalledWith({
        inviterId: 'user-123',
        partnerId: 'partner-999',
        tokenHash: 'hash-xyz',
        partnerDisplayName: 'Partner 999',
      });
    });

    expect(mockMarkProcessed).toHaveBeenCalledWith('req-1');
    expect(mockMarkFailed).not.toHaveBeenCalled();
  });

  it('copies the invite link to the clipboard', async () => {
    const now = Timestamp.now();
    mockUseUserProfileValue.profile = {
      id: 'user-123',
      activeDuoInvite: {
        slug: 'token123',
        tokenHash: 'hash123',
        status: 'pending',
        createdAt: now,
        expiresAt: Timestamp.fromMillis(now.toMillis() + 1_000_000),
      },
    };

    render(<InviteDuoSection />);

    fireEvent.click(screen.getByTestId('invite-duo-copy'));

    await waitFor(() => {
      expect((navigator.clipboard.writeText as vi.Mock)).toHaveBeenCalledWith(
        'https://pairup.test/invite/user-123/token123',
      );
    });
    expect(mockToastSuccess).toHaveBeenCalledWith(PROFILE_MESSAGES.INVITE_DUO.COPIED);
  });

  it('revokes an existing invite', async () => {
    const now = Timestamp.now();
    mockUseUserProfileValue.profile = {
      id: 'user-123',
      activeDuoInvite: {
        slug: 'token123',
        tokenHash: 'hash123',
        status: 'pending',
        createdAt: now,
        expiresAt: Timestamp.fromMillis(now.toMillis() + 1_000_000),
      },
    };

    render(<InviteDuoSection />);

    fireEvent.click(screen.getByTestId('invite-duo-revoke'));

    await waitFor(() => {
      expect(mockClearActiveDuoInvite).toHaveBeenCalledWith('user-123');
    });
    expect(mockToastSuccess).toHaveBeenCalledWith(PROFILE_MESSAGES.INVITE_DUO.REVOKED);
  });
});
