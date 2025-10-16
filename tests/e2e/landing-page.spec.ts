import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load and display hero section', async ({ page }) => {
    await page.goto('/')

    // Check for main hero section
    await expect(page.locator('section').first()).toBeVisible()

    // Verify main navigation is present (not footer navigation)
    await expect(page.getByTestId('main-navigation')).toBeVisible()

    // Take screenshot for visual regression
    await page.screenshot({ path: 'tests/e2e/screenshots/landing-page.png' })
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')

    // Wait for navigation to load
    await page.waitForLoadState('networkidle')

    // Check that main navigation is visible
    await expect(page.getByTestId('main-navigation')).toBeVisible()

    // Verify the navigation contains the logo (there are 2 logos on the page, use first one in navigation)
    const logoImg = page.getByTestId('main-navigation').locator('img[alt="Pair Up Events logo"]').first()
    await expect(logoImg).toBeVisible()
  })
})
