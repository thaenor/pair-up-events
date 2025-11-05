/**
 * Field categorization for routing user data updates to the correct Firestore collections.
 */

/**
 * Fields that exist in both private (users/{userId}) and public (publicProfiles/{userId}) collections.
 * Updates to these fields should be saved to both collections.
 */
export const publicFields = ['firstName', 'lastName', 'photoURL', 'city', 'bio', 'gender'] as const

/**
 * Fields that exist only in the private collection (users/{userId}).
 * Updates to these fields should only be saved to the private collection.
 */
export const privateFields = [
  'email',
  'birthDate',
  'createdAt',
  'preferences',
  'funFact',
  'likes',
  'dislikes',
  'hobbies',
] as const

/**
 * Fields that are immutable and cannot be updated through profile updates.
 * These fields are enforced by Firestore security rules.
 */
export const immutableFields = ['email', 'createdAt'] as const

/**
 * Check if a field is a public field (exists in both collections)
 */
export function isPublicField(field: string): boolean {
  return publicFields.includes(field as (typeof publicFields)[number])
}

/**
 * Check if a field is a private field (exists only in private collection)
 */
export function isPrivateField(field: string): boolean {
  return privateFields.includes(field as (typeof privateFields)[number])
}

/**
 * Check if a field is immutable
 */
export function isImmutableField(field: string): boolean {
  return immutableFields.includes(field as (typeof immutableFields)[number])
}
