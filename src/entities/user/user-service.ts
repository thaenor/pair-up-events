import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ZodError } from 'zod'
import { db } from '@/lib/firebase'
import type { PrivateUserData, PublicUserData } from '@/entities/user'
import { privateUserDataSchema, publicUserDataSchema } from '@/entities/user'
import { parseFirestorePrivateData, toFirestorePrivateData, toFirestorePublicData } from './user-data-helpers'

/**
 * Result type for service operations.
 * Provides explicit success/error states with type-safe error categorization.
 */
export type LoadResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; errorType: 'not-found' | 'validation' | 'network' }

export type SaveResult =
  | { success: true }
  | { success: false; error: string; errorType: 'permission' | 'validation' | 'network' | 'not-found' }

/**
 * Loads private user data from Firestore users/{userId} collection.
 *
 * @param userId - The unique identifier of the user.
 * @returns A Promise that resolves to LoadResult indicating success with data or failure with error details.
 */
export async function loadPrivateUserData(userId: string): Promise<LoadResult<PrivateUserData>> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'User document not found', errorType: 'not-found' }
    }

    const data = docSnap.data()
    const parsed = parseFirestorePrivateData(data)

    try {
      const validated = privateUserDataSchema.parse(parsed)
      return { success: true, data: validated as PrivateUserData }
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        const errorMsg = validationError.issues.map(e => e.message).join(', ')
        console.error(`Validation failed for private user data (userId: ${userId}):`, validationError.issues)
        return {
          success: false,
          error: `Invalid user data structure: ${errorMsg}`,
          errorType: 'validation',
        }
      }
      throw validationError
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to load private user data for userId: ${userId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}

/**
 * Loads public user data from Firestore publicProfiles/{userId} collection.
 *
 * @param userId - The unique identifier of the user.
 * @returns A Promise that resolves to LoadResult indicating success with data or failure with error details.
 */
export async function loadPublicUserData(userId: string): Promise<LoadResult<PublicUserData>> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  try {
    const docRef = doc(db, 'publicProfiles', userId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return { success: false, error: 'Public profile document not found', errorType: 'not-found' }
    }

    const data = docSnap.data()

    try {
      const validated = publicUserDataSchema.parse(data)
      return { success: true, data: validated as PublicUserData }
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        const errorMsg = validationError.issues.map(e => e.message).join(', ')
        console.error(`Validation failed for public user data (userId: ${userId}):`, validationError.issues)
        return {
          success: false,
          error: `Invalid public profile data structure: ${errorMsg}`,
          errorType: 'validation',
        }
      }
      throw validationError
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to load public user data for userId: ${userId}`, error)
    return { success: false, error: errorMsg, errorType: 'network' }
  }
}

/**
 * Creates a new private user data document in Firestore users/{userId} collection.
 * Uses setDoc without merge for document creation (registration).
 *
 * @param userId - The unique identifier of the user.
 * @param data - PrivateUserData to create.
 * @param currentUserId - Current user ID from authenticated context.
 *                        Required to prevent race conditions when auth state changes during async operations.
 * @returns A Promise that resolves to SaveResult indicating success or failure with error details.
 */
export async function createPrivateUserData(
  userId: string,
  data: Partial<PrivateUserData>,
  currentUserId: string
): Promise<SaveResult> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  // Verify user is authenticated and matches userId
  if (!currentUserId || currentUserId !== userId) {
    return {
      success: false,
      error: 'You do not have permission to create this profile',
      errorType: 'permission',
    }
  }

  try {
    // Validate data
    if (Object.keys(data).length > 0) {
      try {
        privateUserDataSchema.partial().parse(data)
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const errorMsg = validationError.issues.map(e => e.message).join(', ')
          console.error(`Validation failed for private user data (userId: ${userId}):`, validationError.issues)
          return {
            success: false,
            error: `Invalid data structure: ${errorMsg}`,
            errorType: 'validation',
          }
        }
        throw validationError
      }
    }

    // Convert Dates to Timestamps and filter undefined values
    const firestoreData = toFirestorePrivateData(data)

    if (Object.keys(firestoreData).length > 0) {
      const docRef = doc(db, 'users', userId)
      await setDoc(docRef, firestoreData)
    }

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'permission-denied') {
        return {
          success: false,
          error: 'Permission denied: You do not have permission to create this profile.',
          errorType: 'permission',
        }
      }
    }
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Failed to create private user data: ${errorMsg}`, errorType: 'network' }
  }
}

/**
 * Creates a new public user data document in Firestore publicProfiles/{userId} collection.
 * Uses setDoc without merge for document creation (registration).
 *
 * @param userId - The unique identifier of the user.
 * @param data - PublicUserData to create.
 * @param currentUserId - Current user ID from authenticated context.
 *                        Required to prevent race conditions when auth state changes during async operations.
 * @returns A Promise that resolves to SaveResult indicating success or failure with error details.
 */
export async function createPublicUserData(
  userId: string,
  data: Partial<PublicUserData>,
  currentUserId: string
): Promise<SaveResult> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  // Verify user is authenticated and matches userId
  if (!currentUserId || currentUserId !== userId) {
    return {
      success: false,
      error: 'You do not have permission to create this profile',
      errorType: 'permission',
    }
  }

  try {
    // Validate data
    if (Object.keys(data).length > 0) {
      try {
        publicUserDataSchema.partial().parse(data)
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const errorMsg = validationError.issues.map(e => e.message).join(', ')
          console.error(`Validation failed for public user data (userId: ${userId}):`, validationError.issues)
          return {
            success: false,
            error: `Invalid data structure: ${errorMsg}`,
            errorType: 'validation',
          }
        }
        throw validationError
      }
    }

    // Filter undefined values
    const firestoreData = toFirestorePublicData(data)

    if (Object.keys(firestoreData).length > 0) {
      const docRef = doc(db, 'publicProfiles', userId)
      await setDoc(docRef, firestoreData)
    }

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'permission-denied') {
        return {
          success: false,
          error: 'Permission denied: You do not have permission to create this profile.',
          errorType: 'permission',
        }
      }
    }
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Failed to create public user data: ${errorMsg}`, errorType: 'network' }
  }
}

/**
 * Saves private user data to Firestore users/{userId} collection.
 * Uses setDoc with merge: true to support both create and update operations.
 *
 * @param userId - The unique identifier of the user.
 * @param data - Partial PrivateUserData to save.
 * @param currentUserId - Current user ID from authenticated context.
 *                        Required to prevent race conditions when auth state changes during async operations.
 * @returns A Promise that resolves to SaveResult indicating success or failure with error details.
 */
export async function savePrivateUserData(
  userId: string,
  data: Partial<PrivateUserData>,
  currentUserId: string
): Promise<SaveResult> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  // Verify user is authenticated and matches userId
  if (!currentUserId || currentUserId !== userId) {
    return {
      success: false,
      error: 'You do not have permission to update this profile',
      errorType: 'permission',
    }
  }

  try {
    // Validate data
    if (Object.keys(data).length > 0) {
      try {
        privateUserDataSchema.partial().parse(data)
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const errorMsg = validationError.issues.map(e => e.message).join(', ')
          console.error(`Validation failed for private user data (userId: ${userId}):`, validationError.issues)
          return {
            success: false,
            error: `Invalid data structure: ${errorMsg}`,
            errorType: 'validation',
          }
        }
        throw validationError
      }
    }

    // Convert Dates to Timestamps and filter undefined values
    const firestoreData = toFirestorePrivateData(data)

    if (Object.keys(firestoreData).length > 0) {
      const docRef = doc(db, 'users', userId)
      await setDoc(docRef, firestoreData, { merge: true })
    }

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'permission-denied') {
        return {
          success: false,
          error:
            'Permission denied: You do not have permission to update this profile. ' +
            'This may happen if you try to update immutable fields like email or createdAt.',
          errorType: 'permission',
        }
      }
      if (error.code === 'not-found') {
        return {
          success: false,
          error:
            'Document not found: Profile documents may not exist yet. ' +
            'Please ensure your profile has been created through registration.',
          errorType: 'not-found',
        }
      }
    }
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Failed to save private user data: ${errorMsg}`, errorType: 'network' }
  }
}

/**
 * Saves public user data to Firestore publicProfiles/{userId} collection.
 * Uses setDoc with merge: true to support both create and update operations.
 *
 * @param userId - The unique identifier of the user.
 * @param data - Partial PublicUserData to save.
 * @param currentUserId - Current user ID from authenticated context.
 *                        Required to prevent race conditions when auth state changes during async operations.
 * @returns A Promise that resolves to SaveResult indicating success or failure with error details.
 */
export async function savePublicUserData(
  userId: string,
  data: Partial<PublicUserData>,
  currentUserId: string
): Promise<SaveResult> {
  if (!db) {
    return { success: false, error: 'Firestore database is not initialized', errorType: 'network' }
  }

  // Verify user is authenticated and matches userId
  if (!currentUserId || currentUserId !== userId) {
    return {
      success: false,
      error: 'You do not have permission to update this profile',
      errorType: 'permission',
    }
  }

  try {
    // Validate data
    if (Object.keys(data).length > 0) {
      try {
        publicUserDataSchema.partial().parse(data)
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const errorMsg = validationError.issues.map(e => e.message).join(', ')
          console.error(`Validation failed for public user data (userId: ${userId}):`, validationError.issues)
          return {
            success: false,
            error: `Invalid data structure: ${errorMsg}`,
            errorType: 'validation',
          }
        }
        throw validationError
      }
    }

    // Filter undefined values
    const firestoreData = toFirestorePublicData(data)

    if (Object.keys(firestoreData).length > 0) {
      const docRef = doc(db, 'publicProfiles', userId)
      await setDoc(docRef, firestoreData, { merge: true })
    }

    return { success: true }
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'permission-denied') {
        return {
          success: false,
          error:
            'Permission denied: You do not have permission to update this profile. ' +
            'This may happen if you try to update immutable fields like email or createdAt.',
          errorType: 'permission',
        }
      }
      if (error.code === 'not-found') {
        return {
          success: false,
          error:
            'Document not found: Profile documents may not exist yet. ' +
            'Please ensure your profile has been created through registration.',
          errorType: 'not-found',
        }
      }
    }
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: `Failed to save public user data: ${errorMsg}`, errorType: 'network' }
  }
}
