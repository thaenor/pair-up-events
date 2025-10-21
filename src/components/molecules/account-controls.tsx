import React, { useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Key, LogOut, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, LoadingSpinner, Modal, ModalActions, ModalContent, Button } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { PROFILE_MESSAGES } from '@/constants/profile';

export type AccountControlsProps = {
  user: User;
};

const AccountControls: React.FC<AccountControlsProps> = React.memo(({ user }) => {
  const { signOut, sendPasswordReset, deleteUserAccount } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/');
    } catch {
      // Error is handled by AuthProvider and will be caught by ErrorBoundary if needed
    }
  }, [signOut, navigate]);

  const handleResetPassword = useCallback(async () => {
    if (!user?.email) return;

    setIsResettingPassword(true);
    try {
      await sendPasswordReset(user.email);
      toast.success(PROFILE_MESSAGES.ALERTS.PASSWORD_RESET_SUCCESS);
    } catch {
      // Error is handled by AuthProvider and will be caught by ErrorBoundary if needed
      toast.error(PROFILE_MESSAGES.ALERTS.PASSWORD_RESET_ERROR);
    } finally {
      setIsResettingPassword(false);
    }
  }, [user, sendPasswordReset]);

  const handleDeleteAccountClick = useCallback(() => {
    setShowDeleteConfirmation(true);
  }, []);

  const handleDeleteAccountConfirm = useCallback(async () => {
    if (!user) return;

    setShowDeleteConfirmation(false);
    setIsDeleting(true);
    try {
      await deleteUserAccount();
      toast.success(PROFILE_MESSAGES.ALERTS.ACCOUNT_DELETE_SUCCESS);
      navigate('/');
    } catch {
      // Error is handled by AuthProvider and will be caught by ErrorBoundary if needed
      toast.error(PROFILE_MESSAGES.ALERTS.ACCOUNT_DELETE_ERROR);
    } finally {
      setIsDeleting(false);
    }
  }, [user, deleteUserAccount, navigate]);

  const handleDeleteAccountCancel = useCallback(() => {
    setShowDeleteConfirmation(false);
  }, []);


  return (
    <Card
      variant="glass"
      className="mb-8"
      data-testid="account-controls"
    >
      <CardHeader>
        <CardTitle>Account Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
        <button
          onClick={handleResetPassword}
          disabled={isResettingPassword}
          className="w-full flex items-center justify-center px-4 py-3 border border-pairup-darkBlue text-pairup-darkBlue rounded-lg hover:bg-pairup-darkBlue/10 focus:outline-none focus:ring-2 focus:ring-pairup-darkBlue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="account-controls-reset-password"
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
          data-testid="account-controls-sign-out"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>

        <button
          onClick={handleDeleteAccountClick}
          disabled={isDeleting}
          className="w-full flex items-center justify-center px-4 py-3 border border-red-500 text-red-600 rounded-lg hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          data-testid="account-controls-delete"
        >
          {isDeleting ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          Delete Account
        </button>
        </div>
      </CardContent>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteAccountCancel}
        title="Delete Account"
        description="This action cannot be undone"
        variant="destructive"
        size="md"
        data-testid="delete-confirmation-modal"
      >
        <ModalContent>
          <p className="text-gray-700 leading-relaxed">
            {PROFILE_MESSAGES.ALERTS.DELETE_CONFIRMATION}
          </p>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> All your data, preferences, and account information will be permanently deleted.
            </p>
          </div>
        </ModalContent>
        <ModalActions>
          <Button
            variant="outline"
            onClick={handleDeleteAccountCancel}
            disabled={isDeleting}
            className="flex-1"
            data-testid="delete-confirmation-cancel"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccountConfirm}
            disabled={isDeleting}
            loading={isDeleting}
            loadingText="Deleting..."
            className="flex-1"
            data-testid="delete-confirmation-confirm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </ModalActions>
      </Modal>
    </Card>
  );
});

AccountControls.displayName = 'AccountControls';

export default AccountControls;
