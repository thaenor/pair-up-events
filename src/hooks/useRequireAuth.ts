import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from './useAuth'

/**
 * Custom hook that requires authentication for a route
 *
 * Automatically redirects unauthenticated users to the login page.
 * Returns the same authentication state as useAuth, but with automatic
 * redirect behavior for protected routes.
 *
 * @returns {Object} Authentication state
 * @returns {User | null} returns.user - Currently authenticated user or null
 * @returns {boolean} returns.loading - Whether authentication state is loading
 *
 * @example
 * ```tsx
 * function ProfilePage() {
 *   const { user, loading } = useRequireAuth();
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (!user) return null; // Will redirect automatically
 *
 *   return <ProfileContent user={user} />;
 * }
 * ```
 */
export const useRequireAuth = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  return { user, loading }
}

export default useRequireAuth
