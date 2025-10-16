import React, { useState } from 'react'
import { User, deleteUser } from 'firebase/auth'
import { Key, LogOut, Trash2, AlertTriangle, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/atoms/button'
import Modal from '@/components/atoms/Modal'
import { LabeledInput } from '@/components/molecules/Form/form-fields'
import { auth } from '@/lib/firebase'
import useAuth from '@/hooks/useAuth'

/**
 * Props for AccountControls component
 *
 * @typedef {Object} AccountControlsProps
 * @property {User | null} user - Firebase user object
 */
export type AccountControlsProps = {
  user: User | null
}

/**
 * Account management controls component
 *
 * Provides user account management features including logout, password reset,
 * and account deletion. Displays controls in a collapsible section.
 *
 * @component
 * @param {AccountControlsProps} props - Component props
 *
 * @example
 * ```tsx
 * <AccountControls user={currentUser} />
 * ```
 */
const AccountControls: React.FC<AccountControlsProps> = React.memo(({ user }) => {
  const { logout, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('')

  const handleSignOut = async () => {
    const result = await logout()

    if (result.success) {
      toast.success('Logged out successfully!')
      navigate('/login')
    } else {
      toast.error(result.error || 'Logout failed')
    }
  }

  const handlePasswordReset = () => {
    setResetEmail(user?.email || '')
    setShowPasswordResetModal(true)
  }

  const handleSubmitPasswordReset = async () => {
    if (!resetEmail) {
      toast.error('Please enter your email address')
      return
    }

    setIsResettingPassword(true)
    const result = await resetPassword(resetEmail)

    if (result.success) {
      toast.success('Password reset email sent!')
      setShowPasswordResetModal(false)
      setResetEmail('')
    } else {
      toast.error(result.error || 'Failed to send password reset email')
    }
    setIsResettingPassword(false)
  }

  const confirmDeleteAccount = async () => {
    if (!user || !auth) {
      toast.error('Unable to delete account. Please try again.')
      return
    }

    setIsDeleting(true)

    try {
      // Delete Firebase Auth user - Firestore cleanup handled by server
      await deleteUser(auth.currentUser!)

      // Sign out and redirect
      toast.success('Account deleted successfully')
      setShowDeleteConfirmation(false)
      setDeleteConfirmationText('')
      navigate('/')
    } catch (error: unknown) {
      console.error('Account deletion failed:', error)
      toast.error('Failed to delete account. Please try again or contact support.')
      setIsDeleting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-pairup-darkBlue mb-4">Account Controls</h3>

      <div className="space-y-4">
        {/* Sign Out Button */}
        <Button
          onClick={handleSignOut}
          variant="ghost"
          fullWidth
          icon={<LogOut className="w-4 h-4" />}
          className="bg-gray-100 hover:bg-gray-200 text-pairup-darkBlue rounded-lg"
          data-testid="sign-out-button"
        >
          Sign Out
        </Button>

        {/* Password Reset Button */}
        <Button
          onClick={handlePasswordReset}
          disabled={isResettingPassword}
          variant="ghost"
          fullWidth
          icon={<Key className="w-4 h-4" />}
          className="bg-gray-100 hover:bg-gray-200 text-pairup-darkBlue rounded-lg"
          data-testid="password-reset-button"
        >
          Reset Password
        </Button>

        {/* Delete Account Button */}
        <Button
          onClick={() => setShowDeleteConfirmation(true)}
          variant="danger"
          fullWidth
          icon={<Trash2 className="w-4 h-4" />}
          className="bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
          data-testid="delete-account-button"
        >
          Delete Account
        </Button>
      </div>

      {/* Password Reset Modal */}
      <Modal
        isOpen={showPasswordResetModal}
        onClose={() => {
          setShowPasswordResetModal(false)
          setResetEmail('')
        }}
        title="Reset Password"
        icon={<Key className="w-6 h-6 text-pairup-darkBlue" />}
        actions={
          <>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setShowPasswordResetModal(false)
                setResetEmail('')
              }}
              className="bg-gray-100 hover:bg-gray-200 text-pairup-darkBlue rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmitPasswordReset}
              loading={isResettingPassword}
              icon={<Mail className="w-4 h-4" />}
              className="bg-pairup-darkBlue hover:bg-pairup-darkBlue/90 text-white rounded-lg"
            >
              Send Reset Email
            </Button>
          </>
        }
      >
        <LabeledInput
          label="Email Address"
          name="resetEmail"
          type="email"
          value={resetEmail}
          onChange={e => setResetEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={isResettingPassword}
          autoFocus
        />
        <p className="text-sm text-pairup-darkBlue/60 mt-3">We'll send you a link to reset your password.</p>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false)
          setDeleteConfirmationText('')
        }}
        title="Delete Account"
        icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
        actions={
          <>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setShowDeleteConfirmation(false)
                setDeleteConfirmationText('')
              }}
              disabled={isDeleting}
              className="bg-gray-100 hover:bg-gray-200 text-pairup-darkBlue rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={confirmDeleteAccount}
              loading={isDeleting}
              disabled={deleteConfirmationText.toLowerCase() !== 'delete' || isDeleting}
              icon={<Trash2 className="w-4 h-4" />}
              className="rounded-lg"
            >
              Delete Account
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="font-medium">
            This action cannot be undone. This will permanently delete your account and remove all your data.
          </p>

          <LabeledInput
            label='Type "delete" to confirm'
            name="deleteConfirm"
            type="text"
            value={deleteConfirmationText}
            onChange={e => setDeleteConfirmationText(e.target.value)}
            placeholder="Type delete to confirm"
            disabled={isDeleting}
            autoFocus
          />

          <div className="text-sm text-red-600 space-y-1">
            <p className="font-medium">This will:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Permanently delete your account</li>
              <li>Remove all your events and data</li>
              <li>Remove your profile and preferences</li>
              <li>Delete all your conversations</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  )
})

AccountControls.displayName = 'AccountControls'

export default AccountControls
