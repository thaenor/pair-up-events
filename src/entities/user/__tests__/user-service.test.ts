import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('firebase/firestore', () => {
  // Create a mock Timestamp class that works with instanceof
  class MockTimestamp {
    seconds: number
    nanoseconds: number

    constructor(seconds: number, nanoseconds: number = 0) {
      this.seconds = seconds
      this.nanoseconds = nanoseconds
    }

    toDate(): Date {
      return new Date(this.seconds * 1000)
    }

    static fromDate(date: Date): MockTimestamp {
      return new MockTimestamp(Math.floor(date.getTime() / 1000), 0)
    }
  }

  return {
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    Timestamp: MockTimestamp,
  }
})

import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'

vi.mock('@/lib/firebase', () => ({
  db: {},
}))

import {
  loadPrivateUserData,
  loadPublicUserData,
  savePrivateUserData,
  savePublicUserData,
} from '@/entities/user/user-service'
import { calculateAgeFromBirthDate } from '@/entities/user/user-data-helpers'

// Type the mocks properly
const mockedGetDoc = vi.mocked(getDoc)
const mockedSetDoc = vi.mocked(setDoc)
const mockedDoc = vi.mocked(doc)

function createMockDocumentSnapshot(data: unknown, exists: boolean) {
  return {
    exists: () => exists,
    data: () => data,
  }
}

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadPrivateUserData', () => {
    it('should fetch private user data successfully', async () => {
      const birthDate = new Date('1990-01-01')
      const createdAt = new Date('2024-01-01')
      const mockUserData = {
        email: 'test@example.com',
        firstName: 'Test',
        birthDate: Timestamp.fromDate(birthDate),
        gender: 'male',
        createdAt: Timestamp.fromDate(createdAt),
        preferences: {
          ageRange: { min: 18, max: 30 },
          preferredGenders: [],
          preferredVibes: [],
        },
      }
      const mockUserDoc = createMockDocumentSnapshot(mockUserData, true)

      mockedGetDoc.mockResolvedValue(mockUserDoc as any)
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const result = await loadPrivateUserData('test-user-id')

      expect(mockedDoc).toHaveBeenCalledWith({}, 'users', 'test-user-id')
      expect(mockedGetDoc).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
        expect(result.data.firstName).toBe('Test')
        expect(result.data.birthDate).toEqual(birthDate)
        expect(result.data.createdAt).toEqual(createdAt)
      }
    })

    it('should return not-found error if document does not exist', async () => {
      const mockUserDoc = createMockDocumentSnapshot(null, false)

      mockedGetDoc.mockResolvedValue(mockUserDoc as any)
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const result = await loadPrivateUserData('test-user-id')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('not-found')
      }
    })

    it('should handle Firestore errors gracefully', async () => {
      mockedGetDoc.mockRejectedValue(new Error('Firestore error'))
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const result = await loadPrivateUserData('test-user-id')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('network')
      }
    })
  })

  describe('loadPublicUserData', () => {
    it('should fetch public user data successfully', async () => {
      const mockPublicData = {
        firstName: 'Test',
        photoURL: 'http://example.com/photo.jpg',
        city: 'Lisbon',
        bio: 'Hello',
        gender: 'male',
        age: 34,
      }
      const mockPublicDoc = createMockDocumentSnapshot(mockPublicData, true)

      mockedGetDoc.mockResolvedValue(mockPublicDoc as any)
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const result = await loadPublicUserData('test-user-id')

      expect(mockedDoc).toHaveBeenCalledWith({}, 'publicProfiles', 'test-user-id')
      expect(mockedGetDoc).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.firstName).toBe('Test')
        expect(result.data.photoURL).toBe('http://example.com/photo.jpg')
        expect(result.data.city).toBe('Lisbon')
        expect(result.data.bio).toBe('Hello')
        expect(result.data.gender).toBe('male')
        expect(result.data.age).toBe(34)
      }
    })

    it('should return not-found error if document does not exist', async () => {
      const mockPublicDoc = createMockDocumentSnapshot(null, false)

      mockedGetDoc.mockResolvedValue(mockPublicDoc as any)
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const result = await loadPublicUserData('test-user-id')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('not-found')
      }
    })
  })

  describe('savePrivateUserData', () => {
    it('should save private user data successfully', async () => {
      mockedSetDoc.mockResolvedValue(undefined)
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const birthDate = new Date('1990-01-01')
      const testData = {
        email: 'new@example.com',
        firstName: 'New',
        birthDate,
        gender: 'female' as const,
      }

      const result = await savePrivateUserData('test-user-id', testData, 'test-user-id')

      expect(mockedDoc).toHaveBeenCalledWith({}, 'users', 'test-user-id')
      expect(mockedSetDoc).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(true)
    })

    it('should calculate age when birthDate is updated', async () => {
      mockedSetDoc.mockResolvedValue(undefined)
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 25)
      const testData = {
        birthDate,
      }

      const result = await savePrivateUserData('test-user-id', testData, 'test-user-id')

      expect(result.success).toBe(true)
      const setDocCall = mockedSetDoc.mock.calls[0]
      const savedData = setDocCall[1] as Record<string, unknown>
      expect(savedData.birthDate).toHaveProperty('seconds')
    })

    it('should return permission error if user is not authenticated', async () => {
      const result = await savePrivateUserData('test-user-id', { firstName: 'New' }, '')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('permission')
      }
    })

    it('should return permission error if userId does not match authenticated user', async () => {
      const result = await savePrivateUserData('test-user-id', { firstName: 'New' }, 'different-user-id')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('permission')
      }
    })

    it('should return validation error for invalid data', async () => {
      const result = await savePrivateUserData('test-user-id', { email: 'invalid-email' }, 'test-user-id')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('validation')
      }
    })

    it('should return network error if Firestore write fails', async () => {
      mockedSetDoc.mockRejectedValue(new Error('Write failed'))
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const result = await savePrivateUserData('test-user-id', { firstName: 'New' }, 'test-user-id')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('network')
      }
    })
  })

  describe('savePublicUserData', () => {
    it('should save public user data successfully', async () => {
      mockedSetDoc.mockResolvedValue(undefined)
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      const testData = {
        firstName: 'New',
        gender: 'female' as const,
        age: 25,
      }

      const result = await savePublicUserData('test-user-id', testData, 'test-user-id')

      expect(mockedDoc).toHaveBeenCalledWith({}, 'publicProfiles', 'test-user-id')
      expect(mockedSetDoc).toHaveBeenCalledTimes(1)
      expect(result.success).toBe(true)
    })

    it('should return permission error if user is not authenticated', async () => {
      const result = await savePublicUserData('test-user-id', { firstName: 'New' }, '')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('permission')
      }
    })

    it('should return validation error for invalid data', async () => {
      const result = await savePublicUserData('test-user-id', { age: 17 }, 'test-user-id')

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = result as Extract<typeof result, { success: false }>
        expect(error.errorType).toBe('validation')
      }
    })

    it('should use merge: true for updates', async () => {
      mockedSetDoc.mockResolvedValue(undefined)
      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      await savePublicUserData('test-user-id', { firstName: 'Updated' }, 'test-user-id')

      const setDocCall = mockedSetDoc.mock.calls[0]
      expect(setDocCall[2]).toEqual({ merge: true })
    })
  })

  describe('Integration: Load and Save', () => {
    it('should load and save data in sequence', async () => {
      const birthDate = new Date('1990-01-01')
      const createdAt = new Date('2024-01-01')
      const mockPrivateData = {
        email: 'test@example.com',
        firstName: 'Test',
        birthDate: Timestamp.fromDate(birthDate),
        gender: 'male',
        createdAt: Timestamp.fromDate(createdAt),
      }
      const mockPublicData = {
        firstName: 'Test',
        gender: 'male',
        age: calculateAgeFromBirthDate(birthDate),
      }

      // Mock load
      mockedGetDoc.mockImplementation((ref: { path: string }) => {
        if (ref.path === 'users/test-user-id') {
          return Promise.resolve(createMockDocumentSnapshot(mockPrivateData, true) as any)
        }
        if (ref.path === 'publicProfiles/test-user-id') {
          return Promise.resolve(createMockDocumentSnapshot(mockPublicData, true) as any)
        }
        return Promise.resolve(createMockDocumentSnapshot(null, false) as any)
      })

      mockedDoc.mockImplementation(
        (_db: unknown, collection: string, id: string) => ({ path: `${collection}/${id}` }) as any
      )

      // Load both
      const [privateResult, publicResult] = await Promise.all([
        loadPrivateUserData('test-user-id'),
        loadPublicUserData('test-user-id'),
      ])

      expect(privateResult.success).toBe(true)
      expect(publicResult.success).toBe(true)

      // Reset mocks for save
      vi.clearAllMocks()
      mockedSetDoc.mockResolvedValue(undefined)

      // Update and save
      if (privateResult.success && publicResult.success) {
        const privateUpdate = { firstName: 'Updated' }
        const publicUpdate = { firstName: 'Updated' }

        const [privateSaveResult, publicSaveResult] = await Promise.all([
          savePrivateUserData('test-user-id', privateUpdate, 'test-user-id'),
          savePublicUserData('test-user-id', publicUpdate, 'test-user-id'),
        ])

        expect(privateSaveResult.success).toBe(true)
        expect(publicSaveResult.success).toBe(true)
      }
    })
  })
})
