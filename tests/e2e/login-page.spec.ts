import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('should load login form', async ({ page }) => {
    await page.goto('/login')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Verify login form is visible by checking for email input
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible({ timeout: 10000 })

    // Verify password input is also visible
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()

    // Take screenshot for visual regression
    await page.screenshot({ path: 'tests/e2e/screenshots/login-page.png' })
  })
})
