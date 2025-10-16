import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { clearPendingInvite, readPendingInvitePayload } from '@/utils/pendingInvite';

const PendingInviteRedirector: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) {
      return;
    }

    const payload = readPendingInvitePayload();
    if (!payload) {
      return;
    }

    if (!user) {
      return;
    }

    const targetPath = `/invite/${payload.inviterId}/${payload.token}`;
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const payload = readPendingInvitePayload();
    if (!payload) {
      clearPendingInvite();
    }
  }, [user]);

  return null;
};

export default PendingInviteRedirector;
