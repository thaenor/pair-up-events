import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Key, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import LoadingSpinner from '@/components/atoms/LoadingSpinner';
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

  // Handle ESC key to close confirmation dialog and focus management
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showDeleteConfirmation && !isDeleting) {
        setShowDeleteConfirmation(false);
      }
    };

    if (showDeleteConfirmation) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Focus the modal for accessibility
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      if (modal) {
        modal.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showDeleteConfirmation, isDeleting]);

  return (
    <div
      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8"
      data-testid="account-controls"
    >
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">Account Controls</h3>

      <div className="space-y-4">
        <button
          onClick={handleResetPassword}
          disabled={isResettingPassword}
          className="w-full flex items-center justify-center px-4 py-3 border border-pairup-cyan text-pairup-cyan rounded-lg hover:bg-pairup-cyan/10 focus:outline-none focus:ring-2 focus:ring-pairup-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmation && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={handleDeleteAccountCancel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
          aria-describedby="delete-account-description"
          data-testid="delete-confirmation-overlay"
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 mx-4 transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            data-testid="delete-confirmation-modal"
          >
            {/* Modal Header */}
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 id="delete-account-title" className="text-xl font-semibold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone</p>
              </div>
            </div>

            {/* Modal Content */}
            <div id="delete-account-description" className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                {PROFILE_MESSAGES.ALERTS.DELETE_CONFIRMATION}
              </p>
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> All your data, preferences, and account information will be permanently deleted.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAccountCancel}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                data-testid="delete-confirmation-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center"
                data-testid="delete-confirmation-confirm"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
});

AccountControls.displayName = 'AccountControls';

export default AccountControls;
