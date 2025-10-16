/**
 * E2E Test Constants
 *
 * Centralized timeout values and configuration constants for E2E tests.
 * Prevents magic numbers and makes timeout values easier to maintain and adjust.
 */

export const TEST_TIMEOUTS = {
  /** Animation wait time for UI transitions */
  ANIMATION: 300,
  /** Network idle wait time for page loads */
  NETWORK_IDLE: 500,
  /** Standard navigation timeout for page redirects */
  NAVIGATION: 10000,
  /** Toast dismissal wait time */
  TOAST_DISMISSAL: 100,
} as const

/**
 * Test user data for E2E authentication flows
 */
export const E2E_TEST_USER = {
  email: `e2e-test-${Date.now()}@example.com`,
  password: 'SecurePass123!',
  firstName: 'E2E',
  lastName: 'Tester',
  birthDate: '1995-06-15',
  gender: 'prefer-not-to-say',
} as const

/**
 * Snapshot test user data for visual regression tests
 */
export const SNAPSHOT_TEST_USER = {
  email: `e2e-snapshot-${Date.now()}@example.com`,
  password: 'SecurePass123!',
  firstName: 'E2E',
  lastName: 'Snapshot',
  birthDate: '1995-06-15',
  gender: 'prefer-not-to-say',
} as const
