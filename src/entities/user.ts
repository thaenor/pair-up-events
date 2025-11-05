import { z } from 'zod'

/**
 * UserPreferences captures a user's matching preferences used across discovery features.
 *
 * Note: UserSettings (emailNotifications, pushNotifications, language, theme, colorScheme)
 * will be added in a future implementation phase.
 */
export interface UserPreferences {
  ageRange: { min: number; max: number }
  preferredGenders: string[]
  preferredVibes: string[]
}

/**
 * Private user data stored in users/{userId} collection.
 * Only accessible by the owner.
 */
export interface PrivateUserData {
  email: string
  firstName: string
  lastName?: string
  birthDate: Date
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
  photoURL?: string
  createdAt: Date
  preferences?: UserPreferences
  funFact?: string
  likes?: string
  dislikes?: string
  hobbies?: string
}

/**
 * Public user data stored in publicProfiles/{userId} collection.
 * Accessible by all authenticated users.
 */
export interface PublicUserData {
  firstName: string
  lastName?: string
  photoURL?: string
  city?: string
  bio?: string
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
  age: number
}

/**
 * Combined user profile data structure matching Firestore collections.
 * This is the primary type used by UserContext.
 */
export type UserProfileData = {
  private: PrivateUserData | null
  public: PublicUserData | null
}

// Shared validation helpers
const nameValidation = z
  .string()
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be at most 50 characters')
  .regex(
    /^[\p{L}\p{M} .'-]+$/u,
    'Can only contain letters (including diacritics), spaces, hyphens, apostrophes, and periods'
  )

/**
 * Zod schema for private user data validation
 */
export const privateUserDataSchema = z
  .object({
    email: z.string().email('Invalid email format'),
    firstName: nameValidation,
    lastName: nameValidation.optional(),
    birthDate: z
      .union([z.date(), z.string()])
      .transform(val => new Date(val))
      .refine(date => !Number.isNaN(date.getTime()), 'Invalid birth date')
      .refine(date => calculateAge(date) >= 18, 'You must be at least 18 years old to register')
      .refine(date => calculateAge(date) <= 120, 'Birth date indicates an age over 120 years'),
    gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']),
    photoURL: z.string().url('Invalid photo URL').optional(),
    createdAt: z
      .union([z.date(), z.string()])
      .transform(val => new Date(val))
      .refine(date => !Number.isNaN(date.getTime()), 'Invalid createdAt date'),
    preferences: z
      .object({
        ageRange: z.object({
          min: z.number(),
          max: z.number(),
        }),
        preferredGenders: z.array(z.string()),
        preferredVibes: z.array(z.string()),
      })
      .optional(),
    funFact: z.string().max(1000, 'Fun fact must be at most 1000 characters').optional(),
    likes: z.string().max(1000, 'Likes must be at most 1000 characters').optional(),
    dislikes: z.string().max(1000, 'Dislikes must be at most 1000 characters').optional(),
    hobbies: z.string().max(1000, 'Hobbies must be at most 1000 characters').optional(),
  })
  .refine(
    data => {
      if (data.preferences?.ageRange) {
        const { min, max } = data.preferences.ageRange
        return min >= 18 && max <= 120 && min <= max
      }
      return true
    },
    { message: 'Preferences age range must be between 18 and 120 and min <= max' }
  )

/**
 * Zod schema for public user data validation
 */
export const publicUserDataSchema = z.object({
  firstName: nameValidation,
  lastName: nameValidation.optional(),
  photoURL: z.string().url('Invalid photo URL').optional(),
  city: z.string().max(100, 'City must be at most 100 characters').optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say']),
  age: z.number().min(18, 'You must be at least 18 years old to register').max(120, 'Age must be 120 years or less'),
})

type FirebaseUserLike = {
  uid: string
  email?: string | null
  displayName?: string | null
  photoURL?: string | null
  metadata?: { creationTime?: string }
}

/**
 * Utility to convert Firebase Auth User to UserProfileData structure
 *
 * @param firebaseUser - Firebase Auth user object
 * @returns UserProfileData with placeholder values
 */
export function fromFirebaseUser(firebaseUser: FirebaseUserLike): UserProfileData {
  const now = new Date()
  const twentyFiveYearsAgo = new Date(now)
  twentyFiveYearsAgo.setFullYear(now.getFullYear() - 25)

  const firstNameFallback =
    (firebaseUser.displayName as string | undefined)?.split(' ')?.[0] ||
    (firebaseUser.email as string | undefined)?.split('@')?.[0] ||
    'User'

  const birthDate = twentyFiveYearsAgo
  const age = calculateAge(birthDate)

  return {
    private: {
      email: firebaseUser.email || 'user@example.com',
      firstName: firstNameFallback,
      birthDate,
      gender: 'prefer-not-to-say',
      createdAt: firebaseUser.metadata?.creationTime ? new Date(firebaseUser.metadata.creationTime) : new Date(),
      preferences: undefined,
    },
    public: {
      firstName: firstNameFallback,
      gender: 'prefer-not-to-say',
      age,
      photoURL: firebaseUser.photoURL || undefined,
    },
  }
}

/**
 * Calculate age in years from a birth date.
 * Enforces correct handling around birthdays and leap years.
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
