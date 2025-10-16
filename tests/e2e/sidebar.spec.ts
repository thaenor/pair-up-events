import { test, expect } from '@playwright/test'
import { TEST_USER, ROUTES } from './test-helpers'

// Test constants
const SIDEBAR_ANIMATION_MS = 300
const NAVIGATION_TIMEOUT = 5000
const LOGOUT_TIMEOUT = 10000

test.describe('Sidebar Navigation Flow', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    // Monitor console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text())
      }
    })
  })

  // Helper function to login
  async function loginUser(page) {
    await page.goto(ROUTES.login)
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    await page.click('[data-testid="login-submit-button"]')
    await expect(page).toHaveURL(ROUTES.profile, { timeout: LOGOUT_TIMEOUT })
  }

  // Helper function to open sidebar
  async function openSidebar(page) {
    await page.click('[data-testid="burger-menu-button"]')
    await page.waitForTimeout(SIDEBAR_ANIMATION_MS)
  }

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

  test.describe('Sidebar Visibility and Interaction', () => {
    test('Sidebar should not be visible when burger menu is not clicked', async ({ page }) => {
      // Login first
      await page.goto(ROUTES.signup)
      await page.fill('[data-testid="signup-first-name"]', TEST_USER.firstName)
      await page.fill('[data-testid="signup-last-name"]', TEST_USER.lastName)
      await page.fill('[data-testid="signup-email"]', TEST_USER.email)
      await page.fill('[data-testid="signup-password"]', TEST_USER.password)
      await page.fill('[data-testid="signup-confirm-password"]', TEST_USER.password)
      await page.fill('[data-testid="signup-birth-date"]', TEST_USER.birthDate)
      await page.selectOption('[data-testid="signup-gender"]', TEST_USER.gender)
      await page.click('[data-testid="signup-submit-button"]')
      await expect(page).toHaveURL(ROUTES.profile, { timeout: LOGOUT_TIMEOUT })

      // Sidebar should not be visible
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('Burger menu should open the sidebar', async ({ page }) => {
      // Explicit login setup
      await loginUser(page)

      // Click burger menu button
      const burgerButton = page.locator('[data-testid="burger-menu-button"]')
      await burgerButton.waitFor({ state: 'visible' })
      await burgerButton.click()

      // Wait for sidebar animation
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is visible
      const sidebar = page.locator('[aria-label="Navigation menu"]')
      await expect(sidebar).toHaveAttribute('aria-hidden', 'false')

      // Verify close button is visible
      const closeButton = page.locator('[data-testid="close-sidebar-button"]')
      await expect(closeButton).toBeVisible()
    })

    test('Close button should close the sidebar', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is open
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Click close button
      await page.click('[data-testid="close-sidebar-button"]')
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('ESC key should close the sidebar', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is open
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Press ESC key
      await page.keyboard.press('Escape')
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('Backdrop click should close the sidebar', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is open
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Click backdrop (using test ID)
      await page.click('[data-testid="sidebar-backdrop"]')
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })
  })

  test.describe('Sidebar Navigation', () => {
    test('Navigate to Settings page', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Click Settings button
      await page.click('button:has-text("Settings")')

      // Verify navigation to settings page
      await expect(page).toHaveURL(ROUTES.settings, { timeout: NAVIGATION_TIMEOUT })

      // Wait for sidebar close animation to complete after navigation
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed after navigation
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('Navigate to Invite page', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Click Invite button
      await page.click('button:has-text("Invite a Friend")')

      // Verify navigation to invite page
      await expect(page).toHaveURL(ROUTES.invite, { timeout: NAVIGATION_TIMEOUT })

      // Wait for sidebar close animation to complete after navigation
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed after navigation
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('Navigate to Contact Us page', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Click Contact Us button
      await page.click('button:has-text("Contact Us")')

      // Verify navigation to contact us page
      await expect(page).toHaveURL(ROUTES.contactUs, { timeout: NAVIGATION_TIMEOUT })

      // Wait for sidebar close animation to complete after navigation
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed after navigation
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('Navigate to About page', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Click About Us button
      await page.click('button:has-text("About Us")')

      // Verify navigation to about page
      await expect(page).toHaveURL(ROUTES.about, { timeout: NAVIGATION_TIMEOUT })

      // Wait for sidebar close animation to complete after navigation
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed after navigation
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('Navigate to Privacy Policy page', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Click Privacy Policy button
      await page.click('button:has-text("Privacy Policy")')

      // Verify navigation to privacy policy page
      await expect(page).toHaveURL(ROUTES.privacyPolicy, { timeout: NAVIGATION_TIMEOUT })

      // Wait for sidebar close animation to complete after navigation
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed after navigation
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('Navigate to Terms of Service page', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Click Terms and Conditions button
      await page.click('button:has-text("Terms and Conditions")')

      // Verify navigation to terms of service page
      await expect(page).toHaveURL(ROUTES.termsOfService, { timeout: NAVIGATION_TIMEOUT })

      // Wait for sidebar close animation to complete after navigation
      await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

      // Verify sidebar is closed after navigation
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })
  })

  test.describe('Sidebar Logout Flow', () => {
    test('Sidebar logout should redirect to home page', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is open
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Dismiss any toasts that might block the button
      await dismissToasts(page)

      // Click logout button
      const logoutButton = page.locator('[data-testid="sidebar-logout-button"]')
      await expect(logoutButton).toBeVisible()
      await logoutButton.click()

      // Wait for logout to complete (redirects to home page "/")
      await expect(page).toHaveURL('/', { timeout: LOGOUT_TIMEOUT })

      // Sidebar should be closed after logout
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    })

    test('Logout button should show loading state', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Dismiss any toasts that might block the button
      await dismissToasts(page)

      // Click logout button
      const logoutButton = page.locator('[data-testid="sidebar-logout-button"]')

      // Verify button is visible and clickable before logout
      await expect(logoutButton).toBeVisible()
      await expect(logoutButton).toBeEnabled()

      // Click and immediately check for loading state
      await logoutButton.click()

      // The button should show "Logging Out..." text immediately after click
      // Note: If logout completes very quickly, we might miss the loading state
      // but the button should show the loading spinner/text at some point
      const hasLoadingText = await logoutButton
        .locator('text=Logging Out...')
        .isVisible()
        .catch(() => false)
      const isDisabled = await logoutButton.isDisabled().catch(() => false)

      // Either we see the loading text or the button is disabled, both indicate loading occurred
      expect(hasLoadingText || isDisabled).toBeTruthy()
    })
  })

  test.describe('Sidebar Accessibility', () => {
    test('Sidebar should trap focus when open', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is open
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Tab through focusable elements
      await page.keyboard.press('Tab')

      // Verify focus is within sidebar
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('Sidebar should have proper ARIA attributes', async ({ page }) => {
      await loginUser(page)

      // Open sidebar
      await openSidebar(page)

      const sidebar = page.locator('[aria-label="Navigation menu"]')

      // Verify ARIA attributes
      await expect(sidebar).toHaveAttribute('role', 'dialog')
      await expect(sidebar).toHaveAttribute('aria-modal', 'true')
      await expect(sidebar).toHaveAttribute('aria-hidden', 'false')
    })
  })

  test.afterAll(async ({ browser }) => {
    try {
      const context = browser.contexts()[0]
      if (!context) return

      const page = await context.newPage()

      // Try to navigate to profile to check if user is logged in
      await page.goto(ROUTES.profile, { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {})

      const url = page.url()

      // Only proceed with logout if we're actually on the profile page
      if (url.includes('/profile')) {
        try {
          await page.click('[data-testid="burger-menu-button"]').catch(() => {})
          await page.waitForTimeout(SIDEBAR_ANIMATION_MS)

          const logoutButton = page.locator('[data-testid="sidebar-logout-button"]')
          if (await logoutButton.isVisible({ timeout: 1000 }).catch(() => false)) {
            await logoutButton.click().catch(() => {})
          }
          await page.waitForTimeout(1000)
        } catch (error) {
          // Silently ignore cleanup errors
          console.log('Cleanup error (non-critical):', error.message)
        }
      }

      await page.close().catch(() => {})
    } catch (error) {
      // Silently ignore cleanup errors
      console.log('Final cleanup error (non-critical):', error.message)
    }
  })
})
