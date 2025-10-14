import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FirebaseError } from 'firebase/app';

import { PROFILE_MESSAGES } from '@/constants/profile';
import { PENDING_DUO_INVITE_STORAGE_KEY } from '@/constants/invites';
import { useAuth } from '@/hooks/useAuth';
import {
  acceptDuoInvite,
  getUserProfileOnce,
  type AcceptDuoInviteResult,
} from '@/lib/firebase/user-profile';
import type { ActiveDuoInvite, UserProfile } from '@/types/user-profile';
import { hashDuoInviteToken } from '@/utils/profileHelpers';
import { logError } from '@/utils/logger';

const InviteLandingPage: React.FC = () => {
  const { inviterId, token } = useParams<{ inviterId: string; token: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [status, setStatus] = useState<
    | 'loading'
    | 'invalid'
    | 'revoked'
    | 'expired'
    | 'already-accepted'
    | 'ready'
    | 'accepted'
    | 'auth-required'
  >('loading');
  const [inviterProfile, setInviterProfile] = useState<UserProfile | null>(null);
  const [activeInvite, setActiveInvite] = useState<ActiveDuoInvite | null>(null);
  const [tokenHash, setTokenHash] = useState<string | null>(null);
  const [verificationWarning, setVerificationWarning] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptOutcome, setAcceptOutcome] = useState<
    AcceptDuoInviteResult['status'] | null
  >(null);

  const inviterName = useMemo(() => {
    if (!inviterProfile) {
      return 'this';
    }

    return inviterProfile.displayName || inviterProfile.email || 'this';
  }, [inviterProfile]);

  const isSelfInvite = Boolean(user?.uid && inviterId && user.uid === inviterId);

  useEffect(() => {
    let isMounted = true;

    const verifyInvite = async () => {
      if (!inviterId || !token) {
        setStatus('invalid');
        setTokenHash(null);
        setVerificationWarning(false);
        return;
      }

      if (authLoading) {
        setStatus('loading');
        return;
      }

      setStatus('loading');

      let computedTokenHash: string | null = null;

      try {
        computedTokenHash = await hashDuoInviteToken(token);
        const profile = await getUserProfileOnce(inviterId);
        if (!profile) {
          setStatus('invalid');
          setAcceptOutcome(null);
          setInviterProfile(null);
          setActiveInvite(null);
          setTokenHash(null);
          setVerificationWarning(false);
          return;
        }

        const invite = profile.activeDuoInvite;
        if (!invite) {
          setStatus('invalid');
          setAcceptOutcome(null);
          setInviterProfile(null);
          setActiveInvite(null);
          setTokenHash(null);
          setVerificationWarning(false);
          return;
        }

        if (invite.tokenHash !== computedTokenHash) {
          setStatus('invalid');
          setAcceptOutcome(null);
          setInviterProfile(null);
          setActiveInvite(null);
          setTokenHash(null);
          setVerificationWarning(false);
          return;
        }

        let nextStatus: typeof status = 'ready';
        const now = Date.now();

        if (invite.status === 'revoked') {
          nextStatus = 'revoked';
        } else if (invite.status === 'accepted') {
          nextStatus = 'already-accepted';
        } else if (invite.expiresAt.toMillis() < now) {
          nextStatus = 'expired';
        }

        if (isMounted) {
          setInviterProfile(profile);
          setActiveInvite(invite);
          setTokenHash(nextStatus === 'ready' ? computedTokenHash : null);
          setVerificationWarning(false);
          setStatus(nextStatus);
          if (nextStatus !== 'accepted') {
            setAcceptOutcome(null);
          }
        }
      } catch (error) {
        if (error instanceof FirebaseError && error.code === 'permission-denied') {
          if (!user?.uid) {
            if (isMounted) {
              setStatus('auth-required');
              setAcceptOutcome(null);
              setInviterProfile(null);
              setActiveInvite(null);
              setTokenHash(null);
              setVerificationWarning(false);
            }
            return;
          }

          let ensuredTokenHash = computedTokenHash;
          if (!ensuredTokenHash) {
            try {
              ensuredTokenHash = await hashDuoInviteToken(token);
            } catch (hashError) {
              logError('Failed to hash duo invite token after permission error', hashError, {
                component: 'InviteLandingPage',
                action: 'verifyInvite:fallback-hash',
                additionalData: { inviterId, token },
              });
            }
          }

          if (isMounted) {
            setStatus('ready');
            setAcceptOutcome(null);
            setInviterProfile(null);
            setActiveInvite(null);
            setTokenHash(ensuredTokenHash ?? null);
            setVerificationWarning(true);
          }
          return;
        }

        logError('Failed to verify duo invite', error, {
          component: 'InviteLandingPage',
          action: 'verifyInvite',
          additionalData: { inviterId, token },
        });
        if (isMounted) {
          setStatus('invalid');
          setAcceptOutcome(null);
          setInviterProfile(null);
          setActiveInvite(null);
          setTokenHash(null);
          setVerificationWarning(false);
        }
      }
    };

    void verifyInvite();

    return () => {
      isMounted = false;
    };
  }, [authLoading, inviterId, token, user?.uid]);

  useEffect(() => {
    if (!inviterId || !token) {
      sessionStorage.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
      return;
    }

    if ((status === 'ready' || status === 'auth-required') && !user) {
      sessionStorage.setItem(
        PENDING_DUO_INVITE_STORAGE_KEY,
        JSON.stringify({ inviterId, token }),
      );
      return;
    }

    if (status !== 'loading') {
      sessionStorage.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
    }
  }, [status, inviterId, token, user]);

  const handleAcceptInvite = async () => {
    if (!inviterId || !token) {
      return;
    }

    if (!user) {
      toast.error('Please sign in to accept this invite.');
      return;
    }

    if (isSelfInvite) {
      toast.error(PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SELF);
      return;
    }

    let ensuredTokenHash = tokenHash ?? activeInvite?.tokenHash ?? null;

    if (!ensuredTokenHash) {
      try {
        ensuredTokenHash = await hashDuoInviteToken(token);
      } catch (error) {
        logError('Failed to hash duo invite token before accepting', error, {
          component: 'InviteLandingPage',
          action: 'handleAcceptInvite:hash',
          additionalData: { inviterId, token },
        });
        toast.error(PROFILE_MESSAGES.INVITE_DUO.ACCEPT_ERROR);
        return;
      }
    }

    if (activeInvite && ensuredTokenHash !== activeInvite.tokenHash) {
      toast.error(PROFILE_MESSAGES.INVITE_DUO.ACCEPT_ERROR);
      return;
    }

    setIsAccepting(true);

    try {
      const result = await acceptDuoInvite({
        inviterId,
        partnerId: user.uid,
        tokenHash: ensuredTokenHash,
        inviterDisplayName: inviterProfile?.displayName,
        partnerDisplayName: user.displayName,
      });
      let successMessage = PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SUCCESS_COMPLETE;

      if (result.status === 'queued') {
        successMessage = PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SUCCESS_QUEUED;
      } else if (result.status === 'queued-without-notification') {
        successMessage = PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SUCCESS_MANUAL;
      }

      toast.success(successMessage);
      sessionStorage.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
      setStatus('accepted');
      setAcceptOutcome(result.status);
      setTokenHash(null);
      setVerificationWarning(false);
    } catch (error) {
      logError('Failed to accept duo invite', error, {
        component: 'InviteLandingPage',
        action: 'handleAcceptInvite',
        additionalData: { inviterId, token },
      });
      setAcceptOutcome(null);
      toast.error(PROFILE_MESSAGES.INVITE_DUO.ACCEPT_ERROR);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleAuthRedirect = (path: '/login' | '/signup') => {
    if (!inviterId || !token) {
      return;
    }

    sessionStorage.setItem(
      PENDING_DUO_INVITE_STORAGE_KEY,
      JSON.stringify({ inviterId, token }),
    );
    navigate(path);
  };

  const renderStatusDescription = () => {
    switch (status) {
      case 'loading':
        return 'Checking your invite…';
      case 'invalid':
        return 'This invite is no longer valid. It might have been revoked or the link is incorrect.';
      case 'auth-required':
        return PROFILE_MESSAGES.INVITE_DUO.AUTH_REQUIRED;
      case 'revoked':
        return 'This invite was revoked by the sender. Ask them to share a new link.';
      case 'expired':
        return PROFILE_MESSAGES.INVITE_DUO.EXPIRED;
      case 'already-accepted':
        return 'This invite has already been accepted. Head to your profile to see your duos!';
      case 'accepted':
        if (acceptOutcome === 'queued-without-notification') {
          return PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SUCCESS_MANUAL;
        }

        if (acceptOutcome === 'queued') {
          return PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SUCCESS_QUEUED;
        }

        return PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SUCCESS_COMPLETE;
      case 'ready':
        if (verificationWarning) {
          return PROFILE_MESSAGES.INVITE_DUO.PERMISSION_WARNING;
        }
        return `${inviterName} wants to pair up with you on PairUp Events. Join them to start planning together!`;
      default:
        return `${inviterName} wants to pair up with you on PairUp Events. Join them to start planning together!`;
    }
  };

  const renderActions = () => {
    if ((status === 'ready' || status === 'auth-required') && !user) {
      return (
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleAuthRedirect('/signup')}
            className="inline-flex items-center justify-center rounded-lg bg-pairup-cyan px-5 py-2 text-sm font-semibold text-pairup-darkBlue shadow-sm transition-colors hover:bg-pairup-cyan/80 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
          >
            Create account & accept
          </button>
          <button
            type="button"
            onClick={() => handleAuthRedirect('/login')}
            className="inline-flex items-center justify-center rounded-lg border border-pairup-darkBlue px-5 py-2 text-sm font-semibold text-pairup-darkBlue transition-colors hover:bg-pairup-darkBlue hover:text-white focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue"
          >
            Log in to continue
          </button>
        </div>
      );
    }

    if (status === 'ready' && user && !isSelfInvite) {
      return (
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleAcceptInvite}
            disabled={isAccepting || authLoading}
            className="inline-flex items-center justify-center rounded-lg bg-pairup-darkBlue px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pairup-cyan hover:text-pairup-darkBlue focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAccepting ? 'Accepting…' : 'Accept invite'}
          </button>
        </div>
      );
    }

    if (status === 'accepted' || status === 'already-accepted') {
      return (
        <div className="mt-6 flex gap-3">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center rounded-lg bg-pairup-cyan px-6 py-2 text-sm font-semibold text-pairup-darkBlue shadow-sm transition-colors hover:bg-pairup-cyan/80 focus:outline-none focus:ring-2 focus:ring-pairup-cyan"
          >
            View your profile
          </Link>
        </div>
      );
    }

    if (isSelfInvite) {
      return (
        <div className="mt-6 text-sm text-pairup-darkBlue/70">
          {PROFILE_MESSAGES.INVITE_DUO.ACCEPT_SELF}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pairup-darkBlue via-pairup-cyan/20 to-pairup-cream">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-white/40 bg-white/90 p-8 shadow-xl backdrop-blur">
          <div className="mb-6 text-sm font-medium uppercase tracking-wide text-pairup-darkBlue/60">
            Duo invite
          </div>
          <h1 className="text-3xl font-bold text-pairup-darkBlue">
            {status === 'accepted'
              ? 'Invite accepted! 🎉'
              : `Join ${inviterName} on PairUp Events`}
          </h1>
          <p className="mt-4 text-base text-pairup-darkBlue/80" data-testid="invite-landing-status">
            {renderStatusDescription()}
          </p>

          {renderActions()}

          <div className="mt-10 text-sm text-pairup-darkBlue/60">
            Having trouble?{' '}
            <Link to="/" className="font-semibold text-pairup-darkBlue underline">
              Return home
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteLandingPage;
