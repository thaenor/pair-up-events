/**
 * Image utility functions for profile picture handling
 * Provides validation and compression using native Canvas API
 */

/** Maximum file size for profile pictures: 5MB (matches Firebase Storage rules) */
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes

/** Accepted image MIME types */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

/** Maximum dimensions for compressed images */
export const MAX_IMAGE_WIDTH = 800
export const MAX_IMAGE_HEIGHT = 800

/** Image compression quality (0.0 to 1.0) */
export const IMAGE_QUALITY = 0.8

/**
 * Validation result for image files
 */
export interface ImageValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validate image file type and size
 *
 * Checks if the file is a valid image format and within size limits.
 * Used before upload to prevent invalid files from being processed.
 *
 * @param {File} file - The image file to validate
 * @returns {ImageValidationResult} Validation result with error message if invalid
 *
 * @example
 * ```ts
 * const result = validateImageFile(file);
 * if (!result.valid) {
 *   toast.error(result.error);
 *   return;
 * }
 * ```
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' }
  }

  // Check file type
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.',
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
    return {
      valid: false,
      error: `File is too large (${fileSizeMB}MB). Maximum size is ${maxSizeMB}MB.`,
    }
  }

  return { valid: true }
}

/**
 * Compress and resize image using Canvas API
 *
 * Reduces image file size and dimensions while maintaining quality.
 * Helps reduce storage costs and improve load times. If image is already
 * smaller than max dimensions, it will only be compressed.
 *
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: MAX_IMAGE_WIDTH)
 * @param {number} maxHeight - Maximum height in pixels (default: MAX_IMAGE_HEIGHT)
 * @param {number} quality - Compression quality 0.0-1.0 (default: IMAGE_QUALITY)
 * @returns {Promise<File>} Compressed image as a new File object
 * @throws {Error} If image cannot be loaded or compressed
 *
 * @example
 * ```ts
 * const compressedFile = await compressImage(file);
 * await uploadProfilePicture(userId, compressedFile);
 * ```
 */
export async function compressImage(
  file: File,
  maxWidth: number = MAX_IMAGE_WIDTH,
  maxHeight: number = MAX_IMAGE_HEIGHT,
  quality: number = IMAGE_QUALITY
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Create image element to load the file
    const img = new Image()
    let objectURL: string | null = null

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height

          if (width > height) {
            width = Math.min(width, maxWidth)
            height = width / aspectRatio
          } else {
            height = Math.min(height, maxHeight)
            width = height * aspectRatio
          }
        }

        // Create canvas with new dimensions
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        // Draw and compress image
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          // Clean up object URL before rejecting
          if (objectURL) {
            URL.revokeObjectURL(objectURL)
          }
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height)

        // Convert canvas to blob
        canvas.toBlob(
          blob => {
            // Clean up object URL after processing
            if (objectURL) {
              URL.revokeObjectURL(objectURL)
            }

            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }

            // Create new File from blob with original file name
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })

            resolve(compressedFile)
          },
          file.type,
          quality
        )
      } catch (error) {
        // Clean up object URL on error
        if (objectURL) {
          URL.revokeObjectURL(objectURL)
        }
        reject(error instanceof Error ? error : new Error('Failed to compress image'))
      }
    }

    img.onerror = () => {
      // Clean up object URL on error
      if (objectURL) {
        URL.revokeObjectURL(objectURL)
      }
      reject(new Error('Failed to load image'))
    }

    // Load image from file and store object URL for cleanup
    objectURL = URL.createObjectURL(file)
    img.src = objectURL
  })
}
