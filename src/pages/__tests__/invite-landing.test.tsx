import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import InviteLandingPage from '../invite-landing';
import { PROFILE_MESSAGES } from '@/constants/profile';
import type { ActiveDuoInvite, UserProfile } from '@/types/user-profile';

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    Link: ({ children, ...props }: React.ComponentProps<'a'>) => (
      <a {...props}>{children}</a>
    ),
  };
});

const mockUseAuthValue = {
  user: null as { uid: string; displayName?: string | null } | null,
  loading: false,
};

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuthValue,
}));

const mockGetUserProfileOnce = vi.fn<
  [string],
  Promise<UserProfile | null>
>();
const mockAcceptDuoInvite = vi.fn();

vi.mock('@/lib/firebase/user-profile', () => ({
  getUserProfileOnce: (...args: Parameters<typeof mockGetUserProfileOnce>) =>
    mockGetUserProfileOnce(...args),
  acceptDuoInvite: (...args: unknown[]) => mockAcceptDuoInvite(...args),
}));

const mockHashDuoInviteToken = vi.fn<
  [string],
  Promise<string>
>();

vi.mock('@/utils/profileHelpers', () => ({
  hashDuoInviteToken: (...args: Parameters<typeof mockHashDuoInviteToken>) =>
    mockHashDuoInviteToken(...args),
}));

vi.mock('@/utils/logger', () => ({
  logError: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('InviteLandingPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockGetUserProfileOnce.mockReset();
    mockHashDuoInviteToken.mockReset();
    mockAcceptDuoInvite.mockReset();
    mockUseParams.mockReturnValue({ inviterId: 'inviter-1', token: 'token-abc' });
    mockUseAuthValue.user = null;
    mockUseAuthValue.loading = false;
  });

  it('prompts unauthenticated visitors to sign in when Firestore denies access', async () => {
    mockHashDuoInviteToken.mockResolvedValue('hash-abc');
    mockGetUserProfileOnce.mockRejectedValue(
      new FirebaseError('permission-denied', 'Missing or insufficient permissions'),
    );

    render(<InviteLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('invite-landing-status').textContent).toBe(
        PROFILE_MESSAGES.INVITE_DUO.AUTH_REQUIRED,
      );
    });

    expect(
      screen.getByRole('button', { name: /create account & accept/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /log in to continue/i }),
    ).toBeInTheDocument();
  });

  it('retries invite verification after the user signs in', async () => {
    const now = Timestamp.now();
    const invite: ActiveDuoInvite = {
      slug: 'token-abc',
      tokenHash: 'hash-abc',
      status: 'pending',
      createdAt: now,
      expiresAt: Timestamp.fromMillis(now.toMillis() + 1000 * 60 * 60),
    };

    mockHashDuoInviteToken.mockResolvedValue('hash-abc');
    mockGetUserProfileOnce
      .mockRejectedValueOnce(new FirebaseError('permission-denied', 'denied'))
      .mockResolvedValueOnce({
        id: 'inviter-1',
        email: 'host@example.com',
        displayName: 'Host User',
        photoUrl: null,
        createdAt: now,
        timezone: null,
        settings: null,
        stats: { duosFormed: 0 },
        activeDuoInvite: invite,
        duos: [],
      });

    const { rerender } = render(<InviteLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('invite-landing-status').textContent).toBe(
        PROFILE_MESSAGES.INVITE_DUO.AUTH_REQUIRED,
      );
    });

    mockUseAuthValue.user = { uid: 'partner-1', displayName: 'Partner' };
    rerender(<InviteLandingPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept invite/i })).toBeInTheDocument();
    });

    expect(mockGetUserProfileOnce).toHaveBeenCalledTimes(2);
  });

  it('allows acceptance when metadata remains restricted after sign-in', async () => {
    mockUseAuthValue.user = { uid: 'partner-1', displayName: 'Partner' };
    mockHashDuoInviteToken.mockResolvedValue('hash-abc');
    mockGetUserProfileOnce.mockRejectedValue(
      new FirebaseError('permission-denied', 'still restricted'),
    );

    render(<InviteLandingPage />);

    await waitFor(() => {
      expect(screen.getByTestId('invite-landing-status').textContent).toBe(
        PROFILE_MESSAGES.INVITE_DUO.PERMISSION_WARNING,
      );
    });

    expect(
      screen.getByRole('button', { name: /accept invite/i }),
    ).toBeInTheDocument();
  });

  it('shows the acceptance confirmation copy after the invite is accepted', async () => {
    const now = Timestamp.now();
    const invite: ActiveDuoInvite = {
      slug: 'token-abc',
      tokenHash: 'hash-abc',
      status: 'pending',
      createdAt: now,
      expiresAt: Timestamp.fromMillis(now.toMillis() + 1000 * 60 * 60),
    };

    mockUseAuthValue.user = { uid: 'partner-1', displayName: 'Partner' };
    mockHashDuoInviteToken.mockResolvedValue('hash-abc');
    mockGetUserProfileOnce.mockResolvedValue({
      id: 'inviter-1',
      email: 'host@example.com',
      displayName: 'Host User',
      photoUrl: null,
      createdAt: now,
      timezone: null,
      settings: null,
      stats: { duosFormed: 1 },
      activeDuoInvite: invite,
      duos: [],
    });
    mockAcceptDuoInvite.mockResolvedValue({ status: 'completed' });

    render(<InviteLandingPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept invite/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /accept invite/i }));

    await waitFor(() => {
      expect(mockAcceptDuoInvite).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId('invite-landing-status').textContent).toBe(
        PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SUCCESS_COMPLETE,
      );
    });

    expect(screen.getByRole('heading', { name: 'Invite accepted! 🎉' })).toBeInTheDocument();
  });

  it('informs the user when the inviter must be notified manually', async () => {
    const now = Timestamp.now();
    const invite: ActiveDuoInvite = {
      slug: 'token-abc',
      tokenHash: 'hash-abc',
      status: 'pending',
      createdAt: now,
      expiresAt: Timestamp.fromMillis(now.toMillis() + 1000 * 60 * 60),
    };

    mockUseAuthValue.user = { uid: 'partner-1', displayName: 'Partner' };
    mockHashDuoInviteToken.mockResolvedValue('hash-abc');
    mockGetUserProfileOnce.mockResolvedValue({
      id: 'inviter-1',
      email: 'host@example.com',
      displayName: 'Host User',
      photoUrl: null,
      createdAt: now,
      timezone: null,
      settings: null,
      stats: { duosFormed: 1 },
      activeDuoInvite: invite,
      duos: [],
    });
    mockAcceptDuoInvite.mockResolvedValue({ status: 'manual-follow-up' });

    render(<InviteLandingPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept invite/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /accept invite/i }));

    await waitFor(() => {
      expect(screen.getByTestId('invite-landing-status').textContent).toBe(
        PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SUCCESS_MANUAL,
      );
    });
  });
});
