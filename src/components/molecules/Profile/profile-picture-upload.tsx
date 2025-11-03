import React, { useRef, useState } from 'react'
import { Camera, Upload, User, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'
import { validateImageFile, compressImage } from '@/lib/image-utils'
import { uploadProfilePicture, deleteProfilePicture } from '@/lib/storage-service'
import Modal from '@/components/atoms/Modal'
import Button from '@/components/atoms/button'

export type ProfilePictureUploadProps = {
  currentPhotoUrl?: string | null
  onPhotoUpdate: (photoUrl: string | null) => Promise<void>
  isLoading?: boolean
  className?: string
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPhotoUrl,
  onPhotoUpdate,
  isLoading = false,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { user } = useAuth()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate user authentication
    if (!user?.uid) {
      toast.error('You must be logged in to upload a profile picture')
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    try {
      setIsUploading(true)

      // Validate image file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid image file')
        return
      }

      // Compress image
      const compressedFile = await compressImage(file)

      // Upload to Firebase Storage
      const downloadURL = await uploadProfilePicture(user.uid, compressedFile)

      // Update profile with new photo URL
      await onPhotoUpdate(downloadURL)

      toast.success('Profile picture uploaded successfully')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload profile picture'
      toast.error(errorMessage)
      console.error('Failed to upload profile picture:', error)
    } finally {
      setIsUploading(false)
      // Reset file input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDeletePhoto = () => {
    // Validate user authentication
    if (!user?.uid) {
      toast.error('You must be logged in to delete a profile picture')
      return
    }

    // Show confirmation modal
    setShowDeleteConfirmation(true)
  }

  const confirmDeletePhoto = async () => {
    if (!user?.uid) {
      return
    }

    setShowDeleteConfirmation(false)

    try {
      setIsDeleting(true)

      // Delete from Firebase Storage
      await deleteProfilePicture(user.uid)

      // Update profile to remove photo URL
      await onPhotoUpdate(null)

      toast.success('Profile picture removed successfully')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete profile picture'
      toast.error(errorMessage)
      console.error('Failed to delete profile picture:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Profile Picture Display */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {currentPhotoUrl ? (
            <img src={currentPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* Upload Overlay */}
        <button
          onClick={handleUploadClick}
          disabled={isLoading || isUploading || isDeleting}
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-pairup-cyan text-pairup-darkBlue rounded-full flex items-center justify-center hover:bg-pairup-cyan/90 transition-colors disabled:opacity-50"
          aria-label="Upload profile picture"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        disabled={isLoading || isUploading || isDeleting}
        className="flex items-center gap-2 px-4 py-2 text-sm text-pairup-darkBlue bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <div className="w-4 h-4 border-2 border-pairup-darkBlue border-t-transparent rounded-full animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload Photo
          </>
        )}
      </button>

      {/* Delete Button */}
      {currentPhotoUrl && (
        <button
          onClick={handleDeletePhoto}
          disabled={isLoading || isUploading || isDeleting}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              Removing...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Remove Photo
            </>
          )}
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Profile picture file input"
      />

      {/* Help Text */}
      <p className="text-xs text-pairup-darkBlue/60 text-center max-w-xs">
        Upload a clear photo of yourself. JPG, PNG formats supported. Max 5MB.
      </p>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Remove Profile Picture"
        icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
        actions={
          <>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setShowDeleteConfirmation(false)}
              disabled={isDeleting}
              className="bg-gray-100 hover:bg-gray-200 text-pairup-darkBlue rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={confirmDeletePhoto}
              loading={isDeleting}
              disabled={isDeleting}
              icon={<Trash2 className="w-4 h-4" />}
              className="rounded-lg"
            >
              Remove Photo
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="font-medium text-pairup-darkBlue">Are you sure you want to remove your profile picture?</p>
          <p className="text-sm text-pairup-darkBlue/80">
            This action cannot be undone. Your profile picture will be permanently deleted.
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default ProfilePictureUpload
