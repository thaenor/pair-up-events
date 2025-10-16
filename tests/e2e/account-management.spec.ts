import { test, expect } from '@playwright/test'
import { TEST_USER, ROUTES } from './test-helpers'

// Helper function to dismiss any visible toasts
async function dismissToasts(page) {
  try {
    const closeButtons = page.locator('[data-close-button]')
    const count = await closeButtons.count()
    for (let i = 0; i < count; i++) {
      await closeButtons
        .first()
        .click()
        .catch(() => {})
    }
    await page.waitForTimeout(100)
  } catch {
    // Silently ignore if no toasts present
  }
}

// Helper function to login
async function loginUser(page) {
  await page.goto(ROUTES.login)
  await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
  await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
  await page.click('[data-testid="login-submit-button"]')
  await expect(page).toHaveURL(ROUTES.profile, { timeout: 10000 })
}

// Helper function to open sidebar
async function openSidebar(page) {
  await page.click('[data-testid="burger-menu-button"]')
  await page.waitForTimeout(300) // Sidebar animation time
}

test.describe('Account Management', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    // Monitor console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text())
      }
    })
  })

  test('Navigate to Settings page via sidebar', async ({ page }) => {
    await loginUser(page)

    // Open sidebar
    await openSidebar(page)

    // Click Settings button
    await page.click('button:has-text("Settings")')

    // Verify navigation to settings page
    await expect(page).toHaveURL(ROUTES.settings, { timeout: 5000 })
  })

  test('Password reset modal displays correctly', async ({ page }) => {
    await loginUser(page)
    await page.goto(ROUTES.settings)

    // Click password reset button
    await page.click('[data-testid="password-reset-button"]')

    // Verify modal is visible
    await expect(page.locator('text=Reset Password')).toBeVisible()

    // Verify email input is pre-filled with user email
    const emailInput = page.locator('input[name="resetEmail"]')
    await expect(emailInput).toHaveValue(TEST_USER.email)

    // Verify modal has correct content
    await expect(page.locator("text=/We'll send you a link to reset your password/")).toBeVisible()

    // Click cancel button
    await page.click('button:has-text("Cancel")')

    // Verify modal is closed
    await expect(page.locator('text=Reset Password')).not.toBeVisible()
  })

  test('Password reset with valid email shows success', async ({ page }) => {
    await loginUser(page)
    await page.goto(ROUTES.settings)

    // Click password reset button
    await page.click('[data-testid="password-reset-button"]')

    // Wait for modal to appear
    await expect(page.locator('text=Reset Password')).toBeVisible()

    // Submit password reset
    await page.click('button:has-text("Send Reset Email")')

    // Verify success toast appears
    await expect(page.locator('text=/Password reset email sent!/')).toBeVisible({ timeout: 5000 })

    // Verify modal closes
    await expect(page.locator('text=Reset Password')).not.toBeVisible({ timeout: 2000 })

    await dismissToasts(page)
  })

  test('Password reset form validation works', async ({ page }) => {
    await loginUser(page)
    await page.goto(ROUTES.settings)

    // Click password reset button
    await page.click('[data-testid="password-reset-button"]')

    // Clear email input
    await page.fill('input[name="resetEmail"]', '')

    // Try to submit empty form
    await page.click('button:has-text("Send Reset Email")')

    // Verify error toast appears
    await expect(page.locator('text=/Please enter your email address/')).toBeVisible({ timeout: 5000 })

    await dismissToasts(page)

    // Cancel modal
    await page.click('button:has-text("Cancel")')
  })

  test('Delete account confirmation modal displays correctly', async ({ page }) => {
    await loginUser(page)
    await page.goto(ROUTES.settings)

    // Click delete account button
    await page.click('[data-testid="delete-account-button"]')

    // Verify modal is visible
    await expect(page.locator('text=Delete Account')).toBeVisible()

    // Verify confirmation input is present
    await expect(page.locator('input[name="deleteConfirm"]')).toBeVisible()

    // Verify delete button is disabled initially
    const deleteButton = page.locator('button:has-text("Delete Account")')
    await expect(deleteButton).toBeDisabled()

    // Verify warning message is displayed
    await expect(page.locator('text=/This action cannot be undone/')).toBeVisible()
    await expect(page.locator('text=/Permanently delete your account/')).toBeVisible()

    // Click cancel button
    await page.click('button:has-text("Cancel")')

    // Verify modal is closed
    await expect(page.locator('text=Delete Account')).not.toBeVisible()
  })

  test('Delete account confirmation text validation works', async ({ page }) => {
    await loginUser(page)
    await page.goto(ROUTES.settings)

    // Click delete account button
    await page.click('[data-testid="delete-account-button"]')

    // Wait for modal
    await expect(page.locator('text=Delete Account')).toBeVisible()

    // Type incorrect confirmation text
    await page.fill('input[name="deleteConfirm"]', 'wrong text')

    // Verify delete button is still disabled
    const deleteButton = page.locator('button:has-text("Delete Account")')
    await expect(deleteButton).toBeDisabled()

    // Clear and type correct confirmation text
    await page.fill('input[name="deleteConfirm"]', 'delete')

    // Verify delete button is now enabled
    await expect(deleteButton).toBeEnabled()

    // Cancel to avoid actual deletion
    await page.click('button:has-text("Cancel")')

    // Verify modal is closed
    await expect(page.locator('text=Delete Account')).not.toBeVisible()
  })

  test('Delete account works with correct confirmation', async ({ page }) => {
    // Create a second user for account deletion test
    const deleteTestUser = {
      email: `delete-test-${Date.now()}@example.com`,
      password: 'DeleteTest123!',
      firstName: 'Delete',
      lastName: 'Test',
      birthDate: '1990-01-01',
      gender: 'male',
    }

    // Signup
    await page.goto('/signup')
    await page.fill('[data-testid="signup-first-name"]', deleteTestUser.firstName)
    await page.fill('[data-testid="signup-last-name"]', deleteTestUser.lastName)
    await page.fill('[data-testid="signup-email"]', deleteTestUser.email)
    await page.fill('[data-testid="signup-password"]', deleteTestUser.password)
    await page.fill('[data-testid="signup-confirm-password"]', deleteTestUser.password)
    await page.fill('[data-testid="signup-birth-date"]', deleteTestUser.birthDate)
    await page.selectOption('[data-testid="signup-gender"]', deleteTestUser.gender)
    await page.click('[data-testid="signup-submit-button"]')

    await expect(page).toHaveURL('/profile', { timeout: 10000 })

    // Navigate to settings
    await page.goto(ROUTES.settings)

    // Click delete account button
    await page.click('[data-testid="delete-account-button"]')

    // Wait for modal
    await expect(page.locator('text=Delete Account')).toBeVisible()

    // Type correct confirmation
    await page.fill('input[name="deleteConfirm"]', 'delete')

    // Click delete button
    await page.click('button:has-text("Delete Account")')

    // Verify success toast
    await expect(page.locator('text=/Account deleted successfully/')).toBeVisible({ timeout: 5000 })

    // Verify redirect to home page
    await expect(page).toHaveURL('/', { timeout: 10000 })

    // Verify user is logged out - try to access profile
    await page.goto('/profile')
    await expect(page).toHaveURL('/login', { timeout: 5000 })
  })

  test('Account controls buttons are all visible and functional', async ({ page }) => {
    await loginUser(page)
    await page.goto(ROUTES.settings)

    // Verify all three buttons are present
    await expect(page.locator('[data-testid="sign-out-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-reset-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="delete-account-button"]')).toBeVisible()

    // Verify button text
    await expect(page.locator('[data-testid="sign-out-button"]')).toHaveText('Sign Out')
    await expect(page.locator('[data-testid="password-reset-button"]')).toHaveText('Reset Password')
    await expect(page.locator('[data-testid="delete-account-button"]')).toHaveText('Delete Account')
  })
})
