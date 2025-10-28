import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Firebase module
vi.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  },
}))

// Import useAuth after mocking
import useAuth from '@/hooks/useAuth'

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with loading true and no user', () => {
      const { result } = renderHook(() => useAuth())

      expect(result.current.loading).toBe(true)
      expect(result.current.user).toBe(null)
      expect(result.current.authError).toBe(null)
    })
  })

  describe('Error Handling', () => {
    it('should clear auth error when clearError is called', async () => {
      const { result } = renderHook(() => useAuth())

      act(() => {
        result.current.clearError()
      })

      expect(result.current.authError).toBe(null)
    })
  })
})
