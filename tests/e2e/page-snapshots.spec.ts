import { test, expect } from '@playwright/test'
import { setupConsoleErrorMonitoring, takePageSnapshot, authenticateUser, logout } from './helpers'
import { TEST_TIMEOUTS } from './constants'

/**
 * Page Snapshot E2E Tests
 *
 * Comprehensive test suite that validates all application pages in their base state.
 * Each test captures a full-page screenshot for visual regression testing and monitors
 * for console errors.
 *
 * Features:
 * - Full-page screenshots for visual regression
 * - Console error monitoring
 * - Authentication flow validation for protected pages
 * - Protected page redirect validation
 *
 * @see {@link ./helpers.ts} for shared helper functions
 */

test.describe('Page Snapshots - Public Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we start with a clean state (not logged in)
    await page.goto('/')
  })

  test('Landing Page (Index) - snapshot and console check', async ({ page }) => {
    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/')
    await expect(page).toHaveURL('/')

    await takePageSnapshot(page, 'index-page')

    await expect(page.getByTestId('main-navigation')).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
  })

  test('Login Page - snapshot and console check', async ({ page }) => {
    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/login')
    await expect(page).toHaveURL('/login')

    await takePageSnapshot(page, 'login-page')

    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: TEST_TIMEOUTS.NAVIGATION })
    await expect(page.locator('input[type="password"]')).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
  })

  test('Signup Page - snapshot and console check', async ({ page }) => {
    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/signup')
    await expect(page).toHaveURL('/signup')

    await takePageSnapshot(page, 'signup-page')

    await expect(page.getByTestId('signup-first-name')).toBeVisible({ timeout: TEST_TIMEOUTS.NAVIGATION })
    await expect(page.getByTestId('signup-email')).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
  })

  test('Terms of Service Page - snapshot and console check', async ({ page }) => {
    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/terms-of-service')
    await expect(page).toHaveURL('/terms-of-service')

    await takePageSnapshot(page, 'terms-of-service-page')

    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
  })

  test('Privacy Policy Page - snapshot and console check', async ({ page }) => {
    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/privacy-policy')
    await expect(page).toHaveURL('/privacy-policy')

    await takePageSnapshot(page, 'privacy-policy-page')

    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
  })

  test('Not Found Page (404) - snapshot and console check', async ({ page }) => {
    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/this-path-does-not-exist')

    await takePageSnapshot(page, 'not-found-page')

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)
  })
})

test.describe('Page Snapshots - Protected Pages', () => {
  test('Profile Page - snapshot and console check', async ({ page }) => {
    await authenticateUser(page)

    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/profile')
    await expect(page).toHaveURL('/profile')

    await takePageSnapshot(page, 'profile-page')

    await expect(page.getByRole('heading', { name: 'Your Profile', exact: true })).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)

    await logout(page)
  })

  test('Events Page - snapshot and console check', async ({ page }) => {
    await authenticateUser(page)

    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/events')
    await expect(page).toHaveURL('/events')

    await takePageSnapshot(page, 'events-page')

    await page.waitForLoadState('networkidle')

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)

    await logout(page)
  })

  test('Events Create Page - snapshot and console check', async ({ page }) => {
    await authenticateUser(page)

    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/events/create')
    await expect(page).toHaveURL('/events/create')

    await takePageSnapshot(page, 'events-create-page')

    await page.waitForLoadState('networkidle')

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)

    await logout(page)
  })

  test('Messenger Page - snapshot and console check', async ({ page }) => {
    await authenticateUser(page)

    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/messenger')
    await expect(page).toHaveURL('/messenger')

    await takePageSnapshot(page, 'messenger-page')

    await page.waitForLoadState('networkidle')

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)

    await logout(page)
  })

  test('Settings Page - snapshot and console check', async ({ page }) => {
    await authenticateUser(page)

    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/settings')
    await expect(page).toHaveURL('/settings')

    await takePageSnapshot(page, 'settings-page')

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)

    await logout(page)
  })

  test('Invite Page - snapshot and console check', async ({ page }) => {
    await authenticateUser(page)

    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/invite')
    await expect(page).toHaveURL('/invite')

    await takePageSnapshot(page, 'invite-page')

    await expect(page.getByRole('heading', { name: 'Invite a Friend' })).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)

    await logout(page)
  })

  test('Contact Us Page - snapshot and console check', async ({ page }) => {
    await authenticateUser(page)

    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/contact-us')
    await expect(page).toHaveURL('/contact-us')

    await takePageSnapshot(page, 'contact-us-page')

    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)

    await logout(page)
  })

  test('About Page - snapshot and console check', async ({ page }) => {
    await authenticateUser(page)

    const { consoleErrors } = setupConsoleErrorMonitoring(page)

    await page.goto('/about')
    await expect(page).toHaveURL('/about')

    await takePageSnapshot(page, 'about-page')

    await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible()

    expect(consoleErrors, 'Page should not have console errors').toHaveLength(0)

    await logout(page)
  })
})

test.describe('Protected Page Redirect Behavior', () => {
  test('Protected pages redirect to login when not authenticated', async ({ page }) => {
    const protectedPages = [
      '/profile',
      '/events',
      '/events/create',
      '/messenger',
      '/settings',
      '/invite',
      '/contact-us',
      '/about',
    ]

    for (const path of protectedPages) {
      await page.goto(path)

      const currentUrl = page.url()
      expect(currentUrl).toMatch(/login|\//)

      await page.goto('/')
    }
  })
})
