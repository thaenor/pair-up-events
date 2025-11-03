/**
 * Firebase Storage service for profile picture management
 * Handles upload and deletion of profile pictures
 */

import { ref, uploadBytes, getDownloadURL, deleteObject, type StorageReference } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload profile picture to Firebase Storage
 *
 * Uploads an image file to the user's profile picture storage path.
 * The file is stored at `profile-pictures/{userId}` with no file extension
 * to match Firebase Storage security rules.
 *
 * @param {string} userId - The user's unique identifier (Firebase Auth UID)
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} Download URL of the uploaded image
 * @throws {Error} If upload fails (network error, permission error, etc.)
 *
 * @example
 * ```ts
 * try {
 *   const downloadURL = await uploadProfilePicture(userId, compressedFile);
 *   await updateProfile({ public: { photoURL: downloadURL } });
 * } catch (error) {
 *   toast.error('Failed to upload profile picture');
 * }
 * ```
 */
export async function uploadProfilePicture(userId: string, file: File): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not configured')
  }

  if (!userId) {
    throw new Error('User ID is required')
  }

  if (!file) {
    throw new Error('File is required')
  }

  try {
    // Create storage reference at profile-pictures/{userId}
    // Note: No file extension to match storage rules pattern
    const storageRef: StorageReference = ref(storage, `profile-pictures/${userId}`)

    // Upload file to Firebase Storage
    await uploadBytes(storageRef, file)

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef)

    return downloadURL
  } catch (error) {
    // Handle Firebase Storage errors
    // Firebase Storage errors have a code property starting with 'storage/'
    const firebaseError = error as { code?: string; message?: string }
    const errorCode = firebaseError.code || ''

    // Check for specific Firebase Storage error codes
    if (errorCode === 'storage/unauthorized' || errorCode === 'storage/unauthenticated') {
      throw new Error('You do not have permission to upload this file')
    }
    if (errorCode === 'storage/quota-exceeded') {
      throw new Error('Storage quota exceeded. Please try again later.')
    }
    if (errorCode === 'storage/retry-limit-exceeded' || errorCode.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.')
    }

    // If no specific error code matched, throw the original error or a generic message
    throw error instanceof Error ? error : new Error('Failed to upload profile picture')
  }
}

/**
 * Delete profile picture from Firebase Storage
 *
 * Removes the user's profile picture from Firebase Storage.
 * The file is deleted from `profile-pictures/{userId}` path.
 *
 * @param {string} userId - The user's unique identifier (Firebase Auth UID)
 * @returns {Promise<void>} Resolves when deletion is complete
 * @throws {Error} If deletion fails (network error, permission error, etc.)
 *
 * @example
 * ```ts
 * try {
 *   await deleteProfilePicture(userId);
 *   await updateProfile({ public: { photoURL: null } });
 * } catch (error) {
 *   toast.error('Failed to delete profile picture');
 * }
 * ```
 */
export async function deleteProfilePicture(userId: string): Promise<void> {
  if (!storage) {
    throw new Error('Firebase Storage is not configured')
  }

  if (!userId) {
    throw new Error('User ID is required')
  }

  try {
    // Create storage reference at profile-pictures/{userId}
    const storageRef: StorageReference = ref(storage, `profile-pictures/${userId}`)

    // Delete file from Firebase Storage
    await deleteObject(storageRef)
  } catch (error) {
    // Handle Firebase Storage errors
    // Firebase Storage errors have a code property starting with 'storage/'
    const firebaseError = error as { code?: string; message?: string }
    const errorCode = firebaseError.code || ''

    // Check if file doesn't exist - this is okay, consider it success
    if (errorCode === 'storage/object-not-found') {
      // File doesn't exist, consider deletion successful
      return
    }

    // Check for permission errors
    if (errorCode === 'storage/unauthorized' || errorCode === 'storage/unauthenticated') {
      throw new Error('You do not have permission to delete this file')
    }

    // Check for network errors
    if (errorCode === 'storage/retry-limit-exceeded' || errorCode.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.')
    }

    // If no specific error code matched, throw the original error or a generic message
    throw error instanceof Error ? error : new Error('Failed to delete profile picture')
  }
}
