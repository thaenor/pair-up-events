import { Timestamp } from 'firebase/firestore'
import type { PrivateUserData, PublicUserData } from '@/entities/user'
import { calculateAge } from '@/entities/user'
import { isPublicField, isPrivateField, isImmutableField } from './user-field-config'

/**
 * Converts Firestore Timestamp objects to Date objects in private user data.
 */
export function parseFirestorePrivateData(data: Record<string, unknown>): Record<string, unknown> {
  const parsed = { ...data }

  if (parsed.birthDate instanceof Timestamp) {
    parsed.birthDate = parsed.birthDate.toDate()
  }

  if (parsed.createdAt instanceof Timestamp) {
    parsed.createdAt = parsed.createdAt.toDate()
  }

  return parsed
}

/**
 * Converts Date objects to Firestore Timestamp objects in private user data.
 */
export function toFirestorePrivateData(data: Partial<PrivateUserData>): Record<string, unknown> {
  const converted: Record<string, unknown> = { ...data }

  if (converted.birthDate instanceof Date) {
    converted.birthDate = Timestamp.fromDate(converted.birthDate)
  }

  if (converted.createdAt instanceof Date) {
    converted.createdAt = Timestamp.fromDate(converted.createdAt)
  }

  // Remove undefined values - Firestore doesn't allow them
  Object.keys(converted).forEach(key => {
    if (converted[key] === undefined) {
      delete converted[key]
    }
  })

  return converted
}

/**
 * Converts Date objects to Firestore Timestamp objects in public user data.
 * Public data doesn't have Timestamp fields, so this mainly filters undefined values.
 */
export function toFirestorePublicData(data: Partial<PublicUserData>): Record<string, unknown> {
  const converted: Record<string, unknown> = { ...data }

  // Remove undefined values - Firestore doesn't allow them
  Object.keys(converted).forEach(key => {
    if (converted[key] === undefined) {
      delete converted[key]
    }
  })

  return converted
}

/**
 * Calculates age from birthDate and adds it to public data.
 * Used when updating birthDate in private data.
 */
export function calculateAgeFromBirthDate(birthDate: Date): number {
  return calculateAge(birthDate)
}

/**
 * Splits user profile updates into private and public updates based on field categorization.
 */
export function splitUserUpdates(updates: Partial<PrivateUserData & PublicUserData>): {
  private: Partial<PrivateUserData>
  public: Partial<PublicUserData>
} {
  const privateUpdates: Partial<PrivateUserData> = {}
  const publicUpdates: Partial<PublicUserData> = {}

  for (const [key, value] of Object.entries(updates)) {
    // Skip undefined values
    if (value === undefined) {
      continue
    }

    // Skip immutable fields
    if (isImmutableField(key)) {
      console.warn(`Field '${key}' is immutable and cannot be updated through profile updates. Skipping.`)
      continue
    }

    // Route fields to appropriate collections
    // Use Record type for assignment - safer than 'as never'
    if (isPublicField(key)) {
      // Public fields go to both collections
      ;(privateUpdates as Record<string, unknown>)[key] = value
      ;(publicUpdates as Record<string, unknown>)[key] = value
    } else if (isPrivateField(key)) {
      // Private fields go only to private collection
      ;(privateUpdates as Record<string, unknown>)[key] = value
    }
  }

  return { private: privateUpdates, public: publicUpdates }
}

/**
 * Adds placeholder private data when fetching another user's profile.
 * Private data is not accessible for other users, so placeholders are needed for schema validation.
 */
export function addPlaceholdersForOtherUser(
  userId: string,
  publicData: Partial<PublicUserData>,
  age?: number
): Partial<PrivateUserData> {
  const approximateAge = age || publicData.age || 25
  const approximateBirthDate = new Date(new Date().getFullYear() - approximateAge, 0, 1)

  return {
    email: `hidden-${userId}@private.local`, // Placeholder - private data not accessible
    birthDate: approximateBirthDate,
    createdAt: new Date(),
    firstName: publicData.firstName || 'User', // Ensure firstName exists
    gender: publicData.gender || 'prefer-not-to-say',
  }
}
