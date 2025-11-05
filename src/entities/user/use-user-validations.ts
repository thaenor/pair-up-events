import { useMemo } from 'react'
import { ZodError } from 'zod'
import { calculateAge, privateUserDataSchema, publicUserDataSchema } from '../user'
import type { PrivateUserData, PublicUserData } from '../user'

/**
 * Hook providing reusable user profile validation utilities.
 *
 * Validations mirror the rules in the `userSchema` and expose
 * user-friendly error messages following the tone of `useAuth`.
 *
 * Minimum age requirement is 18 years.
 */
export const useUserValidations = () => {
  /**
   * Validate private user data using the Zod schema.
   *
   * @param data - Private user data to validate
   * @returns Validation result
   * @example
   * const { validatePrivateData } = useUserValidations()
   * const result = validatePrivateData(formData)
   */
  const validatePrivateData = (data: Partial<PrivateUserData>): { valid: boolean; errors: ZodError | null } => {
    try {
      privateUserDataSchema.partial().parse(data)
      return { valid: true, errors: null }
    } catch (err) {
      if (err instanceof ZodError) {
        return { valid: false, errors: err }
      }
      const unknown = new ZodError([])
      return { valid: false, errors: unknown }
    }
  }

  /**
   * Validate public user data using the Zod schema.
   *
   * @param data - Public user data to validate
   * @returns Validation result
   * @example
   * const { validatePublicData } = useUserValidations()
   * const result = validatePublicData(formData)
   */
  const validatePublicData = (data: Partial<PublicUserData>): { valid: boolean; errors: ZodError | null } => {
    try {
      publicUserDataSchema.partial().parse(data)
      return { valid: true, errors: null }
    } catch (err) {
      if (err instanceof ZodError) {
        return { valid: false, errors: err }
      }
      const unknown = new ZodError([])
      return { valid: false, errors: unknown }
    }
  }

  /**
   * Validate first name according to schema rules.
   *
   * @param {string} firstName - First name to validate
   * @returns {{ valid: boolean; error: string | null }} Result with message
   * @example
   * validateFirstName("O'Brien")
   */
  const validateFirstName = (firstName: string): { valid: boolean; error: string | null } => {
    if (typeof firstName !== 'string') {
      return { valid: false, error: 'Please enter your first name' }
    }
    const trimmed = firstName.trim()
    if (trimmed.length < 2) {
      return { valid: false, error: 'First name must be at least 2 characters' }
    }
    if (trimmed.length > 50) {
      return { valid: false, error: 'First name must be at most 50 characters' }
    }
    if (!/^[\p{L}\p{M} .'-]+$/u.test(trimmed)) {
      return {
        valid: false,
        error: 'First name can only contain letters (including diacritics), spaces, hyphens, apostrophes, and periods',
      }
    }
    return { valid: true, error: null }
  }

  /**
   * Calculate age and validate it against 18–120 bounds.
   *
   * @param {Date} birthDate - Birth date
   * @returns {{ valid: boolean; error: string | null; age?: number }} Result with age
   * @example
   * validateBirthDate(new Date('2000-01-01'))
   */
  const validateBirthDate = (birthDate: Date): { valid: boolean; error: string | null; age?: number } => {
    if (!(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
      return { valid: false, error: 'Please enter a valid birth date' }
    }
    const age = calculateAge(birthDate)
    if (age < 18) {
      return { valid: false, error: 'You must be at least 18 years old to register' }
    }
    if (age > 120) {
      return { valid: false, error: 'Birth date indicates an age over 120 years' }
    }
    return { valid: true, error: null, age }
  }

  /**
   * Validate gender value against allowed set.
   *
   * @param {string} gender - Gender value
   * @returns {{ valid: boolean; error: string | null }} Result with message
   */
  const validateGender = (gender: string): { valid: boolean; error: string | null } => {
    const allowed = ['male', 'female', 'non-binary', 'prefer-not-to-say'] as const
    if (!(allowed as readonly string[]).includes(gender)) {
      return { valid: false, error: 'Please select a valid option' }
    }
    return { valid: true, error: null }
  }

  /**
   * Calculate age from birth date.
   *
   * @param {Date} birthDate - Birth date
   * @returns {number} Age in years
   */
  const calculateAgePublic = (birthDate: Date): number => calculateAge(birthDate)

  return useMemo(
    () => ({
      validatePrivateData,
      validatePublicData,
      validateFirstName,
      validateBirthDate,
      validateGender,
      calculateAge: calculateAgePublic,
    }),
    []
  )
}

export type UseUserValidations = ReturnType<typeof useUserValidations>
