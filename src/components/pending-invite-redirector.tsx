import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PENDING_DUO_INVITE_STORAGE_KEY } from '@/constants/invites';
import { useAuth } from '@/hooks/useAuth';

type PendingInvitePayload = {
  inviterId: string;
  token: string;
};

const PendingInviteRedirector: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) {
      return;
    }

    const payloadRaw = sessionStorage.getItem(PENDING_DUO_INVITE_STORAGE_KEY);
    if (!payloadRaw) {
      return;
    }

    if (!user) {
      return;
    }

    try {
      const payload = JSON.parse(payloadRaw) as PendingInvitePayload;
      if (!payload?.inviterId || !payload?.token) {
        sessionStorage.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
        return;
      }

      const targetPath = `/invite/${payload.inviterId}/${payload.token}`;
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    } catch {
      sessionStorage.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
    }
  }, [user, loading, navigate, location.pathname]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const payloadRaw = sessionStorage.getItem(PENDING_DUO_INVITE_STORAGE_KEY);
    if (!payloadRaw) {
      return;
    }

    try {
      const payload = JSON.parse(payloadRaw) as PendingInvitePayload;
      if (!payload?.inviterId || !payload?.token) {
        sessionStorage.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
      }
    } catch {
      sessionStorage.removeItem(PENDING_DUO_INVITE_STORAGE_KEY);
    }
  }, [user]);

  return null;
};

export default PendingInviteRedirector;
