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
