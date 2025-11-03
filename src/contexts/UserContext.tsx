import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'
import {
  loadPrivateUserData,
  loadPublicUserData,
  savePrivateUserData,
  savePublicUserData,
  type SaveResult,
} from '@/entities/user/user-service'
import type { UserProfileData, PrivateUserData, PublicUserData } from '@/entities/user'
import { calculateAgeFromBirthDate } from '@/entities/user/user-data-helpers'

/**
 * User context state interface
 */
interface UserContextState {
  /** User profile data from Firestore (null if not loaded or user not logged in) */
  userProfile: UserProfileData | null
  /** Whether profile is currently being loaded */
  loading: boolean
  /** Error that occurred while loading/updating profile */
  error: Error | null
  /** Manually refresh the user profile from Firestore */
  refreshProfile: () => Promise<void>
  /** Update user profile in Firestore and local state */
  updateProfile: (updates: { private?: Partial<PrivateUserData>; public?: Partial<PublicUserData> }) => Promise<void>
}

/**
 * User context - provides user profile state and methods
 */
const UserContext = createContext<UserContextState | null>(null)

/**
 * Custom hook to access user profile context
 *
 * @throws {Error} If used outside UserProvider
 * @returns {UserContextState} User profile state and methods
 *
 * @example
 * ```tsx
 * const { userProfile, loading, updateProfile } = useUserProfile()
 *
 * if (loading) return <LoadingSpinner />
 * if (!userProfile) return <div>No profile</div>
 *
 * return <div>Welcome, {userProfile.public.firstName}!</div>
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useUserProfile = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserProfile must be used within UserProvider')
  }
  return context
}

/**
 * Provider component that manages user profile state
 *
 * Automatically loads user profile when user logs in and clears it on logout.
 * Wraps useAuth hook to listen to auth state changes.
 *
 * @example
 * ```tsx
 * <UserProvider>
 *   <App />
 * </UserProvider>
 * ```
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const isRefreshingRef = useRef(false)

  /**
   * Load user profile from Firestore
   */
  const loadProfile = useCallback(async (userId: string) => {
    if (isRefreshingRef.current) {
      return // Prevent concurrent loads
    }

    try {
      isRefreshingRef.current = true
      setLoading(true)
      setError(null)

      // Load both collections in parallel
      const [privateResult, publicResult] = await Promise.all([loadPrivateUserData(userId), loadPublicUserData(userId)])

      // Extract data from results
      const privateData = privateResult.success ? privateResult.data : null
      const publicData = publicResult.success ? publicResult.data : null

      // If both failed with not-found, user doesn't exist
      if (!privateResult.success && !publicResult.success) {
        // TypeScript narrows types inside if block
        const privateError = privateResult as Extract<typeof privateResult, { success: false }>
        const publicError = publicResult as Extract<typeof publicResult, { success: false }>
        if (privateError.errorType === 'not-found' && publicError.errorType === 'not-found') {
          setUserProfile(null)
          return
        }
      }

      // Log errors but still set profile if at least one succeeded
      if (!privateResult.success) {
        const error = privateResult as Extract<typeof privateResult, { success: false }>
        if (error.errorType !== 'not-found') {
          console.error(`Failed to load private user data: ${error.error}`)
        }
      }
      if (!publicResult.success) {
        const error = publicResult as Extract<typeof publicResult, { success: false }>
        if (error.errorType !== 'not-found') {
          console.error(`Failed to load public user data: ${error.error}`)
        }
      }

      setUserProfile({
        private: privateData,
        public: publicData,
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load user profile')
      setError(error)
      console.error('Failed to load user profile:', err)
      setUserProfile(null)
    } finally {
      setLoading(false)
      isRefreshingRef.current = false
    }
  }, [])

  /**
   * Refresh profile from Firestore
   */
  const refreshProfile = useCallback(async () => {
    if (!user?.uid) {
      setUserProfile(null)
      setError(null)
      return
    }

    await loadProfile(user.uid)
  }, [user?.uid, loadProfile])

  /**
   * Update user profile in Firestore and local state
   */
  const updateProfile = useCallback(
    async (updates: { private?: Partial<PrivateUserData>; public?: Partial<PublicUserData> }) => {
      if (!user?.uid) {
        throw new Error('User must be authenticated to update profile')
      }

      try {
        setError(null)

        // Prepare updates
        const privateUpdates = updates.private || {}
        const publicUpdates = updates.public || {}

        // Handle derived fields: if birthDate is updated, recalculate age for public collection
        if (privateUpdates.birthDate instanceof Date) {
          publicUpdates.age = calculateAgeFromBirthDate(privateUpdates.birthDate)
        }

        // Save both collections in parallel
        const savePromises: Promise<SaveResult>[] = []

        if (Object.keys(privateUpdates).length > 0) {
          savePromises.push(savePrivateUserData(user.uid, privateUpdates, user.uid))
        }

        if (Object.keys(publicUpdates).length > 0) {
          savePromises.push(savePublicUserData(user.uid, publicUpdates, user.uid))
        }

        if (savePromises.length > 0) {
          const results = await Promise.all(savePromises)

          // Check for failures
          const failures = results.filter(
            (result): result is Extract<SaveResult, { success: false }> => !result.success
          )
          if (failures.length > 0) {
            const errorMessages = failures.map(f => f.error).join('; ')
            throw new Error(errorMessages)
          }
        }

        // Update local state optimistically using functional update to prevent race conditions
        setUserProfile(prevProfile => {
          if (!prevProfile) {
            // If no profile exists, return as-is (will refresh after)
            return prevProfile
          }

          return {
            private: prevProfile.private ? { ...prevProfile.private, ...privateUpdates } : null,
            public: prevProfile.public ? { ...prevProfile.public, ...publicUpdates } : null,
          }
        })

        // If profile wasn't loaded, refresh it
        if (!userProfile) {
          await refreshProfile()
        }

        toast.success('Profile updated successfully')
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update profile')
        setError(error)
        console.error('Failed to update profile:', err)

        // Show user-friendly error message
        const errorMessage = error.message || 'Failed to update profile'
        toast.error(errorMessage)
        throw error
      }
    },
    [user?.uid, userProfile, refreshProfile]
  )

  /**
   * Load profile when user logs in
   */
  useEffect(() => {
    if (authLoading) {
      // Still determining auth state
      return
    }

    if (user?.uid) {
      // User is logged in - load their profile
      loadProfile(user.uid)
    } else {
      // User is logged out - clear profile
      setUserProfile(null)
      setError(null)
      setLoading(false)
    }
    // loadProfile is stable (empty deps), safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, authLoading])

  const value: UserContextState = {
    userProfile,
    loading: loading || authLoading,
    error,
    refreshProfile,
    updateProfile,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
