import React, { useRef, useState } from 'react'
import { Camera, Upload, User, Trash2 } from 'lucide-react'

export type ProfilePictureUploadProps = {
  currentPhotoUrl?: string | null
  onPhotoUpdate: (photoUrl: string | null) => Promise<void>
  isLoading?: boolean
  className?: string
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentPhotoUrl,
  isLoading = false,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Upload functionality removed
    console.log('File selected:', file.name)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleDeletePhoto = () => {
    // Delete functionality removed
    console.log('Delete photo requested')
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
          disabled={isLoading || isUploading}
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-pairup-cyan text-pairup-darkBlue rounded-full flex items-center justify-center hover:bg-pairup-cyan/90 transition-colors disabled:opacity-50"
          aria-label="Upload profile picture"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        disabled={isLoading || isUploading}
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
          disabled={isLoading || isUploading}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Remove Photo
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
    </div>
  )
}

export default ProfilePictureUpload
