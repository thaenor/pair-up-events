import React, { useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Key, LogOut, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { PROFILE_MESSAGES } from '@/constants/profile';
import { logError } from '@/utils/logger';

export type AccountControlsProps = {
  user: User;
};

const AccountControls: React.FC<AccountControlsProps> = React.memo(({ user }) => {
  const { signOut, sendPasswordReset, deleteUserAccount } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      logError('Sign out failed', error, {
        component: 'AccountControls',
        action: 'signOut',
        userId: user?.uid
      });
    }
  }, [signOut, navigate, user?.uid]);

  const handleResetPassword = useCallback(async () => {
    if (!user?.email) return;

    setIsResettingPassword(true);
    try {
      await sendPasswordReset(user.email);
      toast.success(PROFILE_MESSAGES.ALERTS.PASSWORD_RESET_SUCCESS);
    } catch (error) {
      logError('Password reset failed', error, {
        component: 'AccountControls',
        action: 'sendPasswordReset',
        userId: user?.uid,
        additionalData: { email: user.email }
      });
      toast.error(PROFILE_MESSAGES.ALERTS.PASSWORD_RESET_ERROR);
    } finally {
      setIsResettingPassword(false);
    }
  }, [user, sendPasswordReset]);

  const handleDeleteAccount = useCallback(async () => {
    if (!user) return;

    const confirmed = window.confirm(PROFILE_MESSAGES.ALERTS.DELETE_CONFIRMATION);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteUserAccount();
      toast.success(PROFILE_MESSAGES.ALERTS.ACCOUNT_DELETE_SUCCESS);
      navigate('/');
    } catch (error) {
      logError('Account deletion failed', error, {
        component: 'AccountControls',
        action: 'deleteUserAccount',
        userId: user?.uid,
        additionalData: { email: user.email }
      });
      toast.error(PROFILE_MESSAGES.ALERTS.ACCOUNT_DELETE_ERROR);
    } finally {
      setIsDeleting(false);
    }
  }, [user, deleteUserAccount, navigate]);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">Account Controls</h3>

      <div className="space-y-4">
        <button
          onClick={handleResetPassword}
          disabled={isResettingPassword}
          className="w-full flex items-center justify-center px-4 py-3 border border-pairup-cyan text-pairup-cyan rounded-lg hover:bg-pairup-cyan/10 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isResettingPassword ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Key className="h-4 w-4 mr-2" />
          )}
          Reset Password
        </button>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-500 text-gray-600 rounded-lg hover:bg-gray-500/10 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="w-full flex items-center justify-center px-4 py-3 border border-red-500 text-red-600 rounded-lg hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isDeleting ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Delete Account
        </button>
      </div>
    </div>
  );
});

AccountControls.displayName = 'AccountControls';

export default AccountControls;
