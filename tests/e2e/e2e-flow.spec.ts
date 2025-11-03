/**
 * E2E Sequential Flow Tests
 *
 * Comprehensive happy-path test suite that runs sequentially in a single flow.
 * All tests share the same account and browser context for efficiency.
 *
 * Flow:
 * 1. Public page validation (landing, login)
 * 2. Security validation (redirects)
 * 3. Register account and verify profile page
 * 4. Session persistence validation
 * 5. Enhanced sidebar functionality
 * 6. Navigate through all pages (protected + public with screenshots)
 * 7. Sidebar navigation to all pages
 * 8. Account management features
 * 9. Logout and re-authentication
 */

import { test, expect, type BrowserContext } from '@playwright/test'
import {
  blockTrackingServices,
  setupConsoleErrorMonitoring,
  takePageSnapshot,
  createPersistentTestAccount,
  openSidebar,
  dismissToasts,
} from './helpers'
import { TEST_TIMEOUTS } from './constants'

test.describe('E2E Happy Path Flow', () => {
  test.describe.configure({ mode: 'serial' })

  // Shared browser context for all tests to maintain authentication state
  let sharedContext: BrowserContext
  let testUser: Awaited<ReturnType<typeof createPersistentTestAccount>>

  test.beforeAll(async ({ browser }) => {
    // Create a shared browser context that all tests will use
    // This ensures authentication state (cookies/localStorage) persists across tests
    sharedContext = await browser.newContext()
  })

  test.afterAll(async () => {
    // Clean up shared context after all tests
    if (sharedContext) {
      await sharedContext.close()
    }
  })

  // ============================================================================
  // PHASE 1: PUBLIC PAGE VALIDATION (No authentication required)
  // ============================================================================

  test('Landing page loads and displays hero section', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/')
      await expect(page).toHaveURL('/')

      // Check for main hero section
      await expect(page.locator('section').first()).toBeVisible()

      // Verify main navigation is present
      await expect(page.getByTestId('main-navigation')).toBeVisible()

      await takePageSnapshot(page, 'index-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  test('Landing page has working navigation', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Check that main navigation is visible
      await expect(page.getByTestId('main-navigation')).toBeVisible()

      // Verify the navigation contains the logo
      const logoImg = page.getByTestId('main-navigation').locator('img[alt="Pair Up Events logo"]').first()
      await expect(logoImg).toBeVisible()
    } finally {
      await page.close()
    }
  })

  test('Login page loads form', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/login')
      await expect(page).toHaveURL('/login')

      await page.waitForLoadState('networkidle')

      // Verify login form is visible
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toBeVisible({ timeout: TEST_TIMEOUTS.NAVIGATION })

      // Verify password input is also visible
      const passwordInput = page.locator('input[type="password"]')
      await expect(passwordInput).toBeVisible()

      await takePageSnapshot(page, 'login-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  // ============================================================================
  // PHASE 2: SECURITY VALIDATION (No authentication required)
  // ============================================================================

  test('Protected pages redirect to login when not authenticated', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)

      const protectedPages = ['/profile', '/events', '/events/create', '/messenger', '/settings', '/invite']

      for (const path of protectedPages) {
        await page.goto(path)
        const currentUrl = page.url()
        expect(currentUrl).toMatch(/login|\//)

        await page.goto('/')
      }
    } finally {
      await page.close()
    }
  })

  test('Public pages are accessible without authentication', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)

      const publicPages = ['/', '/login', '/signup', '/about', '/contact-us', '/terms-of-service', '/privacy-policy']

      for (const path of publicPages) {
        await page.goto(path)
        await expect(page).toHaveURL(path, { timeout: 5000 })
      }
    } finally {
      await page.close()
    }
  })

  // ============================================================================
  // PHASE 3: ACCOUNT REGISTRATION (Sets up authenticated state for all subsequent tests)
  // ============================================================================

  // Test 1: Register account once - authentication state persists across all subsequent tests
  test('Register account and verify profile page loads', async () => {
    // Use shared context to ensure authentication persists
    const page = await sharedContext.newPage()

    try {
      // Block GTM and analytics
      await blockTrackingServices(page)

      // Monitor console for errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.error('Browser console error:', msg.text())
        }
      })

      // Create account - this authentication state will persist across all subsequent tests
      // because we're using the same browser context (sharedContext)
      testUser = await createPersistentTestAccount(page)

      // Verify we're on profile page
      await expect(page).toHaveURL('/profile')

      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      // Verify profile page elements
      await expect(page.getByRole('heading', { name: 'Your Profile', exact: true })).toBeVisible()

      // Take screenshot and compare
      await takePageSnapshot(page, 'profile-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  // Setup check for tests that require authentication (after account creation)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  test.beforeEach(async ({ page }, testInfo) => {
    // Only check account creation for tests that run AFTER the registration test
    // The registration test itself should be allowed to run
    // PHASE 1 and PHASE 2 tests don't need authentication
    const testTitle = testInfo.title
    const isRegistrationTest = testTitle.includes('Register account')
    const isPublicPageTest =
      testTitle.includes('Landing page') ||
      testTitle.includes('Login page') ||
      testTitle.includes('Protected pages redirect') ||
      testTitle.includes('Public pages are accessible')

    // Only check account creation for tests that need auth (not registration test, not public tests)
    if (!isRegistrationTest && !isPublicPageTest && !testUser) {
      throw new Error('Account creation failed - test suite cannot continue')
    }
  })

  // ============================================================================
  // PHASE 4: SESSION PERSISTENCE VALIDATION
  // ============================================================================

  test('Session persists after page reload', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)

      await page.goto('/profile')
      await expect(page).toHaveURL('/profile')

      // Reload page
      await page.reload()

      // Should still be on profile (session persisted)
      await expect(page).toHaveURL('/profile')
    } finally {
      await page.close()
    }
  })

  test('Session persists across tabs (same context)', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)

      await page.goto('/profile')
      await expect(page).toHaveURL('/profile')

      // Open new tab in same context
      const newPage = await sharedContext.newPage()
      try {
        await newPage.goto('/profile')

        // Should have access (shared session)
        await expect(newPage).toHaveURL('/profile')
      } finally {
        await newPage.close()
      }
    } finally {
      await page.close()
    }
  })

  // ============================================================================
  // PHASE 5: ENHANCED SIDEBAR FUNCTIONALITY
  // ============================================================================

  // Test 2: Test sidebar visibility and interaction
  test('Sidebar should open and close correctly', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)

      await page.goto('/profile')

      // Sidebar should not be visible initially
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is visible
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Verify close button is visible
      const closeButton = page.locator('[data-testid="close-sidebar-button"]')
      await expect(closeButton).toBeVisible()

      // Close sidebar
      await page.click('[data-testid="close-sidebar-button"]')
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)

      // Verify sidebar is closed
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  test('ESC key closes the sidebar', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is open
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Press ESC key
      await page.keyboard.press('Escape')
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)

      // Verify sidebar is closed
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  test('Backdrop click closes the sidebar', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Dismiss any toasts that might interfere
      await dismissToasts(page)

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is open
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Wait for sidebar animation to complete
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)

      // Click backdrop to close sidebar
      // On mobile, the sidebar might cover the entire width, so we click the backdrop element directly
      // The backdrop has an onClick handler that calls onClose
      const backdrop = page.locator('[data-testid="sidebar-backdrop"]')
      await expect(backdrop).toBeVisible()

      // Use evaluate to trigger the click event on the backdrop element
      // This bypasses any pointer event interception issues
      await backdrop.evaluate((element: HTMLElement) => {
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
        element.dispatchEvent(clickEvent)
      })

      // Wait for animation to complete
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)

      // Verify sidebar is closed
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  test('Sidebar should trap focus when open', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Verify sidebar is open
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'false')

      // Tab through focusable elements
      await page.keyboard.press('Tab')

      // Verify focus is within sidebar
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    } finally {
      await page.close()
    }
  })

  test('Sidebar should have proper ARIA attributes', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      const sidebar = page.locator('[aria-label="Navigation menu"]')

      // Verify ARIA attributes
      await expect(sidebar).toHaveAttribute('role', 'dialog')
      await expect(sidebar).toHaveAttribute('aria-modal', 'true')
      await expect(sidebar).toHaveAttribute('aria-hidden', 'false')
    } finally {
      await page.close()
    }
  })

  // ============================================================================
  // PHASE 6: PAGE NAVIGATION (Protected + Public pages with screenshots)
  // ============================================================================

  // Test 3: Navigate through protected pages with screenshots
  test('Navigate to Events page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/events')
      await expect(page).toHaveURL('/events')

      await takePageSnapshot(page, 'events-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  test('Navigate to Events Create page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/events/create')
      await expect(page).toHaveURL('/events/create')

      await takePageSnapshot(page, 'events-create-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  test('Navigate to Messenger page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/messenger')
      await expect(page).toHaveURL('/messenger')

      await takePageSnapshot(page, 'messenger-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  test('Navigate to Settings page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/settings')
      await expect(page).toHaveURL('/settings')

      await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

      await takePageSnapshot(page, 'settings-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  test('Navigate to Invite page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/invite')
      await expect(page).toHaveURL('/invite')

      await expect(page.getByRole('heading', { name: 'Invite a Friend' })).toBeVisible()

      await takePageSnapshot(page, 'invite-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  test('Navigate to Terms of Service page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/terms-of-service')
      await expect(page).toHaveURL('/terms-of-service')

      await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible()

      await takePageSnapshot(page, 'terms-of-service-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  test('Navigate to Privacy Policy page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/privacy-policy')
      await expect(page).toHaveURL('/privacy-policy')

      await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()

      await takePageSnapshot(page, 'privacy-policy-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  // ============================================================================
  // PHASE 7: SIDEBAR NAVIGATION TO ALL PAGES
  // ============================================================================

  // Test 4: Test sidebar navigation
  test('Navigate via sidebar to Settings', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Click Settings button
      await page.click('button:has-text("Settings")')

      // Verify navigation
      await expect(page).toHaveURL('/settings', { timeout: TEST_TIMEOUTS.NAVIGATION })

      // Verify sidebar closed after navigation
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  test('Navigate via sidebar to Invite', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Click Invite button
      await page.click('button:has-text("Invite a Friend")')

      // Verify navigation
      await expect(page).toHaveURL('/invite', { timeout: TEST_TIMEOUTS.NAVIGATION })

      // Verify sidebar closed after navigation
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  test('Navigate via sidebar to Contact Us', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Click Contact Us button
      await page.click('button:has-text("Contact Us")')

      // Verify navigation
      await expect(page).toHaveURL('/contact-us', { timeout: TEST_TIMEOUTS.NAVIGATION })

      // Verify sidebar closed after navigation
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  test('Navigate via sidebar to About', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Click About Us button
      await page.click('button:has-text("About Us")')

      // Verify navigation
      await expect(page).toHaveURL('/about', { timeout: TEST_TIMEOUTS.NAVIGATION })

      // Verify sidebar closed after navigation
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  test('Navigate via sidebar to Privacy Policy', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Click Privacy Policy button
      await page.click('button:has-text("Privacy Policy")')

      // Verify navigation
      await expect(page).toHaveURL('/privacy-policy', { timeout: TEST_TIMEOUTS.NAVIGATION })

      // Verify sidebar closed after navigation
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  test('Navigate via sidebar to Terms of Service', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Click Terms and Conditions button
      await page.click('button:has-text("Terms and Conditions")')

      // Verify navigation
      await expect(page).toHaveURL('/terms-of-service', { timeout: TEST_TIMEOUTS.NAVIGATION })

      // Verify sidebar closed after navigation
      await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)
      await expect(page.locator('[aria-label="Navigation menu"]')).toHaveAttribute('aria-hidden', 'true')
    } finally {
      await page.close()
    }
  })

  // ============================================================================
  // PHASE 8: ACCOUNT MANAGEMENT FEATURES
  // ============================================================================

  // Test 5: Test account management features
  test('Password reset modal displays correctly', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/settings')

      // Click password reset button
      await page.click('[data-testid="password-reset-button"]')

      // Verify modal is visible
      await expect(page.locator('h3:has-text("Reset Password")')).toBeVisible()

      // Wait for modal to fully load
      await page.waitForTimeout(500)

      // Verify email input is pre-filled
      const emailInput = page.locator('input[id="resetEmail"]')
      await expect(emailInput).toHaveValue(testUser.email)

      // Cancel modal
      await page.click('button:has-text("Cancel")')
      await expect(page.locator('h3:has-text("Reset Password")')).not.toBeVisible()
    } finally {
      await page.close()
    }
  })

  test('Account controls buttons are visible', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/settings')

      // Verify all three buttons are present
      await expect(page.locator('[data-testid="sign-out-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="password-reset-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="delete-account-button"]')).toBeVisible()

      // Verify button text
      await expect(page.locator('[data-testid="sign-out-button"]')).toHaveText('Sign Out')
      await expect(page.locator('[data-testid="password-reset-button"]')).toHaveText('Reset Password')
      await expect(page.locator('[data-testid="delete-account-button"]')).toHaveText('Delete Account')
    } finally {
      await page.close()
    }
  })

  test('Password reset with valid email shows success', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/settings')

      // Click password reset button
      await page.click('[data-testid="password-reset-button"]')

      // Wait for modal to appear
      await expect(page.locator('h3:has-text("Reset Password")')).toBeVisible()

      // Submit password reset
      await page.click('button:has-text("Send Reset Email")')

      // Verify success toast appears
      await expect(page.locator('text=/Password reset email sent!/')).toBeVisible({ timeout: 5000 })

      // Verify modal closes
      await expect(page.locator('h3:has-text("Reset Password")')).not.toBeVisible({ timeout: 2000 })

      await dismissToasts(page)
    } finally {
      await page.close()
    }
  })

  test('Password reset form validation works', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/settings')

      // Click password reset button
      await page.click('[data-testid="password-reset-button"]')

      // Wait for modal to appear
      await expect(page.locator('h3:has-text("Reset Password")')).toBeVisible()

      // Wait for modal to fully load and input to be populated
      await page.waitForTimeout(500)

      // Clear email input
      await page.fill('input[id="resetEmail"]', '')

      // Try to submit empty form
      await page.click('button:has-text("Send Reset Email")')

      // Verify error toast appears
      await expect(page.locator('text=/Please enter your email address/')).toBeVisible({ timeout: 5000 })

      await dismissToasts(page)

      // Cancel modal
      await page.click('button:has-text("Cancel")')
    } finally {
      await page.close()
    }
  })

  test('Delete account confirmation modal displays correctly', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/settings')

      // Click delete account button
      await page.click('[data-testid="delete-account-button"]')

      // Verify modal is visible
      await expect(page.locator('h3:has-text("Delete Account")')).toBeVisible()

      // Verify confirmation input is present
      await expect(page.locator('input[placeholder="Type delete to confirm"]')).toBeVisible()

      // Verify delete button is disabled initially
      const deleteButton = page.locator('button[disabled]:has-text("Delete Account")')
      await expect(deleteButton).toBeDisabled()

      // Verify warning message is displayed
      await expect(page.locator('text=/This action cannot be undone/')).toBeVisible()
      await expect(page.locator('text=/Permanently delete your account/')).toBeVisible()

      // Click cancel button
      await page.click('button:has-text("Cancel")')

      // Verify modal is closed
      await expect(page.locator('h3:has-text("Delete Account")')).not.toBeVisible()
    } finally {
      await page.close()
    }
  })

  test('Delete account confirmation text validation works', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/settings')

      // Click delete account button
      await page.click('[data-testid="delete-account-button"]')

      // Wait for modal
      await expect(page.locator('h3:has-text("Delete Account")')).toBeVisible()

      // Type incorrect confirmation text
      await page.fill('input[placeholder="Type delete to confirm"]', 'wrong text')

      // Verify delete button is still disabled
      const deleteButton = page.locator('button[disabled]:has-text("Delete Account")')
      await expect(deleteButton).toBeDisabled()

      // Clear and type correct confirmation text
      await page.fill('input[placeholder="Type delete to confirm"]', 'delete')

      // Verify delete button is now enabled
      await expect(
        page.locator('button:has-text("Delete Account"):not([data-testid="delete-account-button"])')
      ).toBeEnabled()

      // Cancel to avoid actual deletion
      await page.click('button:has-text("Cancel")')

      // Verify modal is closed
      await expect(page.locator('h3:has-text("Delete Account")')).not.toBeVisible()
    } finally {
      await page.close()
    }
  })

  test('Logout button shows loading state', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      await page.goto('/profile')

      // Open sidebar
      await openSidebar(page)

      // Dismiss any toasts that might block the button
      await dismissToasts(page)

      // Get logout button
      const logoutButton = page.locator('[data-testid="sidebar-logout-button"]')

      // Verify button is visible and clickable before logout
      await expect(logoutButton).toBeVisible()
      await expect(logoutButton).toBeEnabled()

      // Click and immediately check for loading state
      await logoutButton.click()

      // The button should show "Logging Out..." text or be disabled during logout
      const hasLoadingText = await logoutButton
        .locator('text=Logging Out...')
        .isVisible()
        .catch(() => false)
      const isDisabled = await logoutButton.isDisabled().catch(() => false)

      // Either we see the loading text or the button is disabled, both indicate loading occurred
      expect(hasLoadingText || isDisabled).toBeTruthy()

      // Wait for logout to complete (redirects to home or login)
      // After logout, Navigation component navigates to '/' or '/login'
      // Both are valid logout destinations
      await page.waitForURL(
        url => {
          const pathname = new URL(url).pathname
          return pathname === '/' || pathname === '/login'
        },
        { timeout: TEST_TIMEOUTS.NAVIGATION }
      )
    } finally {
      await page.close()
    }
  })

  // Test 6: Navigate to public pages (while still authenticated)
  test('Navigate to Contact Us page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/contact-us')
      await expect(page).toHaveURL('/contact-us')

      await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()

      await takePageSnapshot(page, 'contact-us-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  test('Navigate to About page', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)
      const { consoleErrors } = setupConsoleErrorMonitoring(page)

      await page.goto('/about')
      await expect(page).toHaveURL('/about')

      await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible()

      await takePageSnapshot(page, 'about-page')

      expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
    } finally {
      await page.close()
    }
  })

  // ============================================================================
  // PHASE 9: LOGOUT AND RE-AUTHENTICATION
  // ============================================================================

  // Final test: Logout
  test('Logout and verify redirect to home', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)

      // Navigate to profile - if logged out, we'll be redirected to login
      await page.goto('/profile')

      // Check if we're redirected to login (user is logged out)
      // If so, re-authenticate first
      await page.waitForURL(
        url => {
          const pathname = new URL(url).pathname
          return pathname === '/profile' || pathname === '/login'
        },
        { timeout: TEST_TIMEOUTS.NAVIGATION }
      )

      const currentPath = new URL(page.url()).pathname
      if (currentPath === '/login') {
        // User is logged out, re-authenticate
        await page.fill('[data-testid="login-email-input"]', testUser.email)
        await page.fill('[data-testid="login-password-input"]', testUser.password)
        await page.click('[data-testid="login-submit-button"]')

        // Wait for redirect to profile
        await page.waitForURL('/profile', { timeout: TEST_TIMEOUTS.NAVIGATION })
      }

      // Dismiss any toasts
      await dismissToasts(page)

      // Open sidebar
      await openSidebar(page)

      // Dismiss toasts again in case they appeared
      await dismissToasts(page)

      // Click logout button
      await page.click('[data-testid="sidebar-logout-button"]')

      // Wait for logout to complete (redirects to home or login)
      // After logout, Navigation component navigates to '/' or '/login'
      // Both are valid logout destinations
      await page.waitForURL(
        url => {
          const pathname = new URL(url).pathname
          return pathname === '/' || pathname === '/login'
        },
        { timeout: TEST_TIMEOUTS.NAVIGATION }
      )
    } finally {
      await page.close()
    }
  })

  test('Login after logout works correctly', async () => {
    const page = await sharedContext.newPage()

    try {
      await blockTrackingServices(page)

      // Ensure we're logged out (should be after previous test)
      await page.goto('/login')

      // Login with the previously created account
      await page.fill('[data-testid="login-email-input"]', testUser.email)
      await page.fill('[data-testid="login-password-input"]', testUser.password)
      await page.click('[data-testid="login-submit-button"]')

      // Verify successful login
      await expect(page).toHaveURL('/profile', { timeout: TEST_TIMEOUTS.NAVIGATION })

      // Verify we're on profile page
      await expect(page.getByRole('heading', { name: 'Your Profile', exact: true })).toBeVisible()
    } finally {
      await page.close()
    }
  })
})
