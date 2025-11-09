import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Firebase module with unsubscribe function
const mockUnsubscribe = vi.fn()

vi.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(() => mockUnsubscribe),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  },
}))

// Import useAuth after mocking
import useAuth from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'

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

  describe('Cleanup', () => {
    it('should cleanup auth subscription on unmount', () => {
      // auth is mocked and will always be defined in tests
      if (!auth) {
        throw new Error('Auth mock not initialized')
      }
      const mockOnAuthStateChanged = vi.mocked(auth.onAuthStateChanged)

      // Reset mock to ensure clean state
      mockUnsubscribe.mockClear()
      mockOnAuthStateChanged.mockClear()
      mockOnAuthStateChanged.mockReturnValue(mockUnsubscribe)

      const { unmount } = renderHook(() => useAuth())

      // Verify subscription was created
      expect(mockOnAuthStateChanged).toHaveBeenCalled()

      // Unmount should cleanup subscription
      unmount()

      // Verify unsubscribe was called
      expect(mockUnsubscribe).toHaveBeenCalled()
    })
  })
})
