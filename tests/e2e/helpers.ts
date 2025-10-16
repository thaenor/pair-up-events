/**
 * E2E Test Helper Functions
 *
 * Shared utility functions for Playwright E2E tests.
 * Reduces code duplication and ensures consistent test behavior across suites.
 *
 * @module tests/e2e/helpers
 */

import { Page } from '@playwright/test'
import { TEST_TIMEOUTS } from './constants'

/**
 * Dismisses any visible toast notifications by clicking their close buttons.
 * This prevents toasts from blocking interactions in tests.
 *
 * @param page - Playwright page object
 */
export async function dismissToasts(page: Page): Promise<void> {
  try {
    const closeButtons = page.locator('[data-close-button]')
    const count = await closeButtons.count()
    for (let i = 0; i < count; i++) {
      await closeButtons
        .first()
        .click()
        .catch(() => {})
    }
    await page.waitForTimeout(TEST_TIMEOUTS.TOAST_DISMISSAL)
  } catch {
    // Silently ignore if no toasts present
  }
}

/**
 * Opens the sidebar menu by clicking the burger menu button.
 * Includes proper wait for animation completion.
 *
 * @param page - Playwright page object
 */
export async function openSidebar(page: Page): Promise<void> {
  await page.click('[data-testid="burger-menu-button"]')
  await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)
}

/**
 * Sets up console error and warning monitoring for a page.
 * Returns arrays that collect errors and warnings for assertion.
 *
 * @param page - Playwright page object
 * @returns Object containing consoleErrors and consoleWarnings arrays
 *
 * @example
 * const { consoleErrors } = setupConsoleErrorMonitoring(page)
 * // ... perform actions
 * expect(consoleErrors).toHaveLength(0)
 */
export function setupConsoleErrorMonitoring(page: Page) {
  const consoleErrors: string[] = []
  const consoleWarnings: string[] = []

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text())
    }
  })

  return { consoleErrors, consoleWarnings }
}

/**
 * Takes a full-page screenshot snapshot for visual regression testing.
 * Waits for network idle and animations to complete before capturing.
 *
 * @param page - Playwright page object
 * @param pageName - Name for the screenshot file (without extension)
 */
export async function takePageSnapshot(page: Page, pageName: string): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(TEST_TIMEOUTS.NETWORK_IDLE) // Wait for animations
  await page.screenshot({
    path: `tests/e2e/screenshots/${pageName}.png`,
    fullPage: true,
  })
}

/**
 * Authenticates a test user by creating a new account via the signup flow.
 * Returns to the signup page and waits for redirect to profile upon completion.
 *
 * @param page - Playwright page object
 * @returns Test user object that was created
 *
 * @example
 * const user = await authenticateUser(page)
 * // User is now logged in
 */
export async function authenticateUser(page: Page) {
  const testUser = {
    email: `e2e-snapshot-${Date.now()}@example.com`,
    password: 'SecurePass123!',
    firstName: 'E2E',
    lastName: 'Snapshot',
    birthDate: '1995-06-15',
    gender: 'prefer-not-to-say',
  }

  // Go to signup
  await page.goto('/signup')

  // Fill signup form
  await page.fill('[data-testid="signup-first-name"]', testUser.firstName)
  await page.fill('[data-testid="signup-last-name"]', testUser.lastName)
  await page.fill('[data-testid="signup-email"]', testUser.email)
  await page.fill('[data-testid="signup-password"]', testUser.password)
  await page.fill('[data-testid="signup-confirm-password"]', testUser.password)
  await page.fill('[data-testid="signup-birth-date"]', testUser.birthDate)
  await page.selectOption('[data-testid="signup-gender"]', testUser.gender)

  // Submit signup
  await page.click('[data-testid="signup-submit-button"]')

  // Wait for redirect to profile
  await page.waitForURL('/profile', { timeout: TEST_TIMEOUTS.NAVIGATION })

  return testUser
}

/**
 * Logs out the current user by opening the sidebar and clicking the logout button.
 * Includes proper handling of toast dismissals and sidebar animations.
 *
 * @param page - Playwright page object
 */
export async function logout(page: Page): Promise<void> {
  await dismissToasts(page)
  await openSidebar(page)
  await dismissToasts(page)
  await page.click('[data-testid="sidebar-logout-button"]')
  await page.waitForURL('/', { timeout: TEST_TIMEOUTS.NAVIGATION })
}
