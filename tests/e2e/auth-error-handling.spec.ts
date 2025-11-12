/**
 * Authentication Error Handling Tests
 *
 * Tests for authentication error scenarios and edge cases.
 * Each test uses its own account to avoid interference.
 *
 * Coverage:
 * - Invalid login credentials
 * - Duplicate signup attempts
 * - Form validation errors
 */

import { test, expect } from '@playwright/test'
import { blockTrackingServices, dismissToasts } from './helpers'
import { TEST_TIMEOUTS } from './constants'

test.describe('Authentication Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    await blockTrackingServices(page)

    // Monitor console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text())
      }
    })
  })

  test('Login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[data-testid="login-email-input"]', 'wrong@example.com')
    await page.fill('[data-testid="login-password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-submit-button"]')

    // Should see error in AuthErrorDisplay component
    await expect(page.locator('[data-testid="auth-error-display"]')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=/No account found|Invalid/i')).toBeVisible({ timeout: 5000 })

    // Should remain on login page
    await expect(page).toHaveURL('/login')

    // Should not show retry button for non-retryable errors
    await expect(page.locator('text=/Try Again/i')).not.toBeVisible()

    await dismissToasts(page)
  })

  test('Signup with existing email shows error', async ({ page }) => {
    // First, create an account
    const existingUser = {
      email: `existing-${Date.now()}@example.com`,
      password: 'ExistingPass123!',
      firstName: 'Existing',
      lastName: 'User',
      birthDate: '1990-01-01',
      gender: 'prefer-not-to-say',
    }

    await page.goto('/signup')
    await page.fill('[data-testid="signup-first-name"]', existingUser.firstName)
    await page.fill('[data-testid="signup-last-name"]', existingUser.lastName)
    await page.fill('[data-testid="signup-email"]', existingUser.email)
    await page.fill('[data-testid="signup-password"]', existingUser.password)
    await page.fill('[data-testid="signup-confirm-password"]', existingUser.password)
    await page.fill('[data-testid="signup-birth-date"]', existingUser.birthDate)
    await page.selectOption('[data-testid="signup-gender"]', existingUser.gender)
    await page.click('[data-testid="signup-submit-button"]')

    // Wait for either successful signup (navigate to /profile) or error message
    // Handle both success and failure cases
    try {
      await expect(page).toHaveURL('/profile', { timeout: TEST_TIMEOUTS.NAVIGATION })
    } catch {
      // If signup failed, check for various error indicators
      // Wait a bit for error messages to appear
      await page.waitForTimeout(2000)

      const authErrorVisible = await page
        .locator('[data-testid="auth-error-display"]')
        .isVisible({ timeout: 3000 })
        .catch(() => false)
      const signupErrorVisible = await page
        .locator('text=/signup failed|failed to create|Account created but failed/i')
        .isVisible({ timeout: 3000 })
        .catch(() => false)
      const validationErrorVisible = await page
        .locator('text=/Invalid data structure|Can only contain letters/i')
        .isVisible({ timeout: 3000 })
        .catch(() => false)

      // Check console for error messages that might indicate the issue
      const consoleErrors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('Failed to create user profile')) {
          consoleErrors.push(msg.text())
        }
      })

      if (authErrorVisible || signupErrorVisible || validationErrorVisible) {
        const errorType = validationErrorVisible ? 'validation' : 'Firestore emulator connection'
        throw new Error(
          `Signup failed - ${errorType} issue. Error visible: ${authErrorVisible || signupErrorVisible || validationErrorVisible}. Ensure Firestore emulator is running and CORS is configured.`
        )
      }

      // If still on signup page after timeout, check if form is still visible (indicates signup didn't proceed)
      const signupFormVisible = await page
        .locator('[data-testid="signup-submit-button"]')
        .isVisible({ timeout: 2000 })
        .catch(() => false)
      if (signupFormVisible) {
        throw new Error(
          'Signup did not complete - form still visible after submission. This may indicate Firestore emulator connection issues preventing profile creation.'
        )
      }

      // If no error visible but still on signup page, re-throw original timeout error
      throw new Error('Signup did not complete - navigation to /profile timed out without clear error indication')
    }

    // Logout
    await page.goto('/profile')
    await dismissToasts(page)
    await page.click('[data-testid="burger-menu-button"]')
    await page.waitForTimeout(300)
    await dismissToasts(page)
    await page.click('[data-testid="sidebar-logout-button"]')

    // Wait for logout to complete and navigation away from protected page
    // After logout, Navigation component navigates to '/' or '/login'
    // Both are valid logout destinations
    await page.waitForURL(
      url => {
        const pathname = new URL(url).pathname
        return pathname === '/' || pathname === '/login'
      },
      { timeout: TEST_TIMEOUTS.NAVIGATION }
    )

    // Dismiss any toasts that appear after logout
    await dismissToasts(page)

    // Verify we're on a public page (not protected)
    const currentPath = new URL(page.url()).pathname
    expect(currentPath === '/' || currentPath === '/login').toBe(true)

    // Now try to signup with the same email
    await page.goto('/signup')

    await page.fill('[data-testid="signup-first-name"]', 'Test')
    await page.fill('[data-testid="signup-last-name"]', 'User')
    await page.fill('[data-testid="signup-email"]', existingUser.email)
    await page.fill('[data-testid="signup-password"]', existingUser.password)
    await page.fill('[data-testid="signup-confirm-password"]', existingUser.password)
    await page.fill('[data-testid="signup-birth-date"]', '1990-01-01')
    await page.selectOption('[data-testid="signup-gender"]', 'male')

    await page.click('[data-testid="signup-submit-button"]')

    // Should see error
    await expect(page.locator('text=/already in use/i')).toBeVisible({ timeout: 5000 })

    // Should remain on signup page
    await expect(page).toHaveURL('/signup')

    // Should not show retry button for non-retryable errors
    await expect(page.locator('text=/Try Again/i')).not.toBeVisible()

    await dismissToasts(page)
  })
})
