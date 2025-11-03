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

    // Wait for successful signup
    await expect(page).toHaveURL('/profile', { timeout: TEST_TIMEOUTS.NAVIGATION })

    // Logout
    await page.goto('/profile')
    await dismissToasts(page)
    await page.click('[data-testid="burger-menu-button"]')
    await page.waitForTimeout(300)
    await dismissToasts(page)
    await page.click('[data-testid="sidebar-logout-button"]')
    await expect(page).toHaveURL('/', { timeout: TEST_TIMEOUTS.NAVIGATION })

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
