import { describe, it, expect } from 'vitest'
import {
  PrivateUserData,
  PublicUserData,
  fromFirebaseUser,
  privateUserDataSchema,
  publicUserDataSchema,
  calculateAge,
} from '../user'

describe('User Entity', () => {
  describe('PrivateUserData Interface', () => {
    it('should define correct PrivateUserData interface structure', () => {
      const privateData: PrivateUserData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date('2024-01-01'),
        birthDate: new Date('1995-01-01'),
        gender: 'prefer-not-to-say',
        preferences: {
          ageRange: { min: 21, max: 40 },
          preferredGenders: ['female', 'non-binary'],
          preferredVibes: ['outdoors', 'board-games'],
        },
        funFact: 'I speak 3 languages',
        likes: 'Coffee',
        dislikes: 'Loud places',
        hobbies: 'Hiking',
      }

      expect(privateData.email).toBe('test@example.com')
      expect(privateData.firstName).toBe('Test')
      expect(privateData.photoURL).toBe('https://example.com/photo.jpg')
      expect(privateData.createdAt).toBeInstanceOf(Date)
      expect(privateData.birthDate).toBeInstanceOf(Date)
      expect(privateData.gender).toBe('prefer-not-to-say')
    })

    it('should allow optional fields to be undefined', () => {
      const privateData: PrivateUserData = {
        email: 'test@example.com',
        firstName: 'Test',
        createdAt: new Date('2024-01-01'),
        birthDate: new Date('1990-01-01'),
        gender: 'male',
      }

      expect(privateData.lastName).toBeUndefined()
      expect(privateData.photoURL).toBeUndefined()
      expect(privateData.preferences).toBeUndefined()
      expect(privateData.funFact).toBeUndefined()
      expect(privateData.likes).toBeUndefined()
      expect(privateData.dislikes).toBeUndefined()
      expect(privateData.hobbies).toBeUndefined()
    })
  })

  describe('PublicUserData Interface', () => {
    it('should define correct PublicUserData interface structure', () => {
      const publicData: PublicUserData = {
        firstName: 'Test',
        lastName: 'User',
        photoURL: 'https://example.com/photo.jpg',
        city: 'Lisbon',
        bio: 'Hello there',
        gender: 'prefer-not-to-say',
        age: 29,
      }

      expect(publicData.firstName).toBe('Test')
      expect(publicData.photoURL).toBe('https://example.com/photo.jpg')
      expect(publicData.city).toBe('Lisbon')
      expect(publicData.bio).toBe('Hello there')
      expect(publicData.gender).toBe('prefer-not-to-say')
      expect(publicData.age).toBe(29)
    })

    it('should allow optional fields to be undefined', () => {
      const publicData: PublicUserData = {
        firstName: 'Test',
        gender: 'male',
        age: 35,
      }

      expect(publicData.lastName).toBeUndefined()
      expect(publicData.photoURL).toBeUndefined()
      expect(publicData.city).toBeUndefined()
      expect(publicData.bio).toBeUndefined()
    })
  })

  describe('privateUserDataSchema', () => {
    it('should validate correct private user data', () => {
      const validData = {
        email: 'test@example.com',
        firstName: 'Test',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date('2024-01-01'),
        birthDate: new Date('1995-01-01'),
        gender: 'female' as const,
      }

      expect(() => privateUserDataSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        firstName: 'Test',
        createdAt: new Date('2024-01-01'),
        birthDate: new Date('1990-01-01'),
        gender: 'male' as const,
      }

      expect(() => privateUserDataSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid photo URL', () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'Test',
        photoURL: 'not-a-url',
        createdAt: new Date('2024-01-01'),
        birthDate: new Date('1990-01-01'),
        gender: 'male' as const,
      }

      expect(() => privateUserDataSchema.parse(invalidData)).toThrow()
    })

    it('should accept valid optional photo URL', () => {
      const validData = {
        email: 'test@example.com',
        firstName: 'Test',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: new Date('2024-01-01'),
        birthDate: new Date('1990-01-01'),
        gender: 'male' as const,
      }

      expect(() => privateUserDataSchema.parse(validData)).not.toThrow()
    })

    it('should enforce firstName length and pattern', () => {
      const base = {
        email: 'a@b.com',
        createdAt: new Date(),
        birthDate: new Date('1990-01-01'),
        gender: 'male' as const,
      }
      expect(() => privateUserDataSchema.parse({ ...base, firstName: 'A' })).toThrow()
      expect(() => privateUserDataSchema.parse({ ...base, firstName: 'X'.repeat(51) })).toThrow()
      expect(() => privateUserDataSchema.parse({ ...base, firstName: 'John123' })).toThrow()
      expect(() => privateUserDataSchema.parse({ ...base, firstName: "O'Brien" })).not.toThrow()
      expect(() => privateUserDataSchema.parse({ ...base, firstName: 'Mary-Jane' })).not.toThrow()
      expect(() => privateUserDataSchema.parse({ ...base, firstName: 'Dr. Smith' })).not.toThrow()
      expect(() => privateUserDataSchema.parse({ ...base, firstName: 'José' })).not.toThrow()
      expect(() => privateUserDataSchema.parse({ ...base, firstName: 'Zoë' })).not.toThrow()
    })

    it('should enforce birthDate with 18-120 age bounds', () => {
      const base = {
        email: 'a@b.com',
        firstName: 'John',
        createdAt: new Date(),
        gender: 'male' as const,
      }
      const today = new Date()
      const seventeenYearsAgo = new Date(today)
      seventeenYearsAgo.setFullYear(today.getFullYear() - 17)
      const oneHundredTwentyOneYearsAgo = new Date(today)
      oneHundredTwentyOneYearsAgo.setFullYear(today.getFullYear() - 121)

      expect(() => privateUserDataSchema.parse({ ...base, birthDate: seventeenYearsAgo })).toThrow()
      expect(() => privateUserDataSchema.parse({ ...base, birthDate: oneHundredTwentyOneYearsAgo })).toThrow()

      const exactlyEighteen = new Date(today)
      exactlyEighteen.setFullYear(today.getFullYear() - 18)
      expect(() => privateUserDataSchema.parse({ ...base, birthDate: exactlyEighteen })).not.toThrow()
    })
  })

  describe('publicUserDataSchema', () => {
    it('should validate correct public user data', () => {
      const validData = {
        firstName: 'Test',
        gender: 'female' as const,
        age: 29,
      }

      expect(() => publicUserDataSchema.parse(validData)).not.toThrow()
    })

    it('should enforce firstName length and pattern', () => {
      const base = {
        gender: 'male' as const,
        age: 30,
      }
      expect(() => publicUserDataSchema.parse({ ...base, firstName: 'A' })).toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, firstName: 'X'.repeat(51) })).toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, firstName: 'John123' })).toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, firstName: "O'Brien" })).not.toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, firstName: 'Mary-Jane' })).not.toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, firstName: 'Dr. Smith' })).not.toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, firstName: 'José' })).not.toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, firstName: 'Zoë' })).not.toThrow()
    })

    it('should enforce age bounds (18-120)', () => {
      const base = {
        firstName: 'John',
        gender: 'male' as const,
      }

      expect(() => publicUserDataSchema.parse({ ...base, age: 17 })).toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, age: 121 })).toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, age: 18 })).not.toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, age: 25 })).not.toThrow()
      expect(() => publicUserDataSchema.parse({ ...base, age: 120 })).not.toThrow()
    })
  })

  describe('Optional fields validations', () => {
    const privateBase = {
      email: 'a@b.com',
      firstName: 'John',
      createdAt: new Date(),
      birthDate: new Date('1990-01-01'),
      gender: 'male' as const,
    }

    const publicBase = {
      firstName: 'John',
      gender: 'male' as const,
      age: calculateAge(new Date('1990-01-01')),
    }

    it('should accept values at exact max lengths', () => {
      const privateValid = {
        ...privateBase,
        funFact: 'Z'.repeat(1000),
        likes: 'L'.repeat(1000),
        dislikes: 'D'.repeat(1000),
        hobbies: 'H'.repeat(1000),
      }
      const publicValid = {
        ...publicBase,
        city: 'X'.repeat(100),
        bio: 'Y'.repeat(500),
      }
      expect(() => privateUserDataSchema.parse(privateValid)).not.toThrow()
      expect(() => publicUserDataSchema.parse(publicValid)).not.toThrow()
    })

    it('should reject values exceeding max lengths', () => {
      const privateInvalids = [
        { ...privateBase, funFact: 'Z'.repeat(1001) },
        { ...privateBase, likes: 'L'.repeat(1001) },
        { ...privateBase, dislikes: 'D'.repeat(1001) },
        { ...privateBase, hobbies: 'H'.repeat(1001) },
      ]
      const publicInvalids = [
        { ...publicBase, city: 'X'.repeat(101) },
        { ...publicBase, bio: 'Y'.repeat(501) },
      ]
      privateInvalids.forEach(data => expect(() => privateUserDataSchema.parse(data)).toThrow())
      publicInvalids.forEach(data => expect(() => publicUserDataSchema.parse(data)).toThrow())
    })
  })

  describe('fromFirebaseUser', () => {
    it('should convert Firebase user to UserProfileData structure', () => {
      const firebaseUser = {
        uid: 'firebase-123',
        email: 'firebase@example.com',
        displayName: 'Firebase User',
        photoURL: 'https://firebase.com/photo.jpg',
        metadata: {
          creationTime: '2024-01-01T00:00:00Z',
        },
      }

      const userProfile = fromFirebaseUser(firebaseUser)

      expect(userProfile.private).not.toBeNull()
      expect(userProfile.public).not.toBeNull()
      expect(userProfile.private?.email).toBe('firebase@example.com')
      expect(userProfile.private?.firstName).toBe('Firebase')
      expect(userProfile.public?.firstName).toBe('Firebase')
      expect(userProfile.public?.photoURL).toBe('https://firebase.com/photo.jpg')
      expect(userProfile.private?.createdAt).toBeInstanceOf(Date)
      expect(userProfile.private?.birthDate).toBeInstanceOf(Date)
      expect(userProfile.private?.gender).toBe('prefer-not-to-say')
      expect(userProfile.public?.gender).toBe('prefer-not-to-say')
      expect(userProfile.public?.age).toBeGreaterThanOrEqual(18)
    })

    it('should handle missing displayName by using email prefix', () => {
      const firebaseUser = {
        uid: 'firebase-123',
        email: 'firebase@example.com',
        metadata: {
          creationTime: '2024-01-01T00:00:00Z',
        },
      }

      const userProfile = fromFirebaseUser(firebaseUser)

      expect(userProfile.private?.firstName).toBe('firebase')
      expect(userProfile.public?.firstName).toBe('firebase')
    })

    it('should handle missing email by using fallback', () => {
      const firebaseUser = {
        uid: 'firebase-123',
        metadata: {
          creationTime: '2024-01-01T00:00:00Z',
        },
      }

      const userProfile = fromFirebaseUser(firebaseUser)

      expect(userProfile.private?.firstName).toBe('User')
      expect(userProfile.public?.firstName).toBe('User')
    })

    it('should handle missing creationTime', () => {
      const firebaseUser = {
        uid: 'firebase-123',
        email: 'firebase@example.com',
        displayName: 'Firebase User',
      }

      const userProfile = fromFirebaseUser(firebaseUser)

      expect(userProfile.private?.createdAt).toBeInstanceOf(Date)
      expect(userProfile.private?.createdAt.getTime()).toBeCloseTo(Date.now(), -2) // Within 100ms
    })
  })

  describe('UserPreferences Interface', () => {
    it('should accept valid preferences object', () => {
      const valid = {
        email: 'a@b.com',
        firstName: 'John',
        createdAt: new Date(),
        birthDate: new Date('1990-01-01'),
        gender: 'male' as const,
        preferences: {
          ageRange: { min: 18, max: 35 },
          preferredGenders: ['female'],
          preferredVibes: ['outdoors'],
        },
      }
      expect(() => privateUserDataSchema.parse(valid)).not.toThrow()
    })

    it('should reject invalid age range', () => {
      const invalid = {
        email: 'a@b.com',
        firstName: 'John',
        createdAt: new Date(),
        birthDate: new Date('1990-01-01'),
        gender: 'male' as const,
        preferences: {
          ageRange: { min: 17, max: 200 },
          preferredGenders: [],
          preferredVibes: [],
        },
      }
      expect(() => privateUserDataSchema.parse(invalid)).toThrow()
    })
  })
})
