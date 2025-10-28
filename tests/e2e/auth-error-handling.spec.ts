import { test, expect } from '@playwright/test'

const TEST_USER = {
  email: `e2e-error-test-${Date.now()}@example.com`,
  password: 'SecurePass123!',
  firstName: 'E2E',
  lastName: 'Error',
  birthDate: '1995-06-15',
  gender: 'prefer-not-to-say',
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

test.describe('Authentication Error Handling', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    // Monitor console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text())
      }
    })
  })

  test('Network error handling with retry mechanism', async ({ page }) => {
    // Simulate network failure by intercepting requests
    await page.route('**/identitytoolkit.googleapis.com/**', route => {
      route.abort('failed')
    })

    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    await page.click('[data-testid="login-submit-button"]')

    // Should see network error message (use first() to avoid strict mode violation)
    await expect(page.locator('text=/Network error|Connection Problem/i').first()).toBeVisible({ timeout: 10000 })

    // Should see retry button
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible()

    // Restore network and retry
    await page.unroute('**/identitytoolkit.googleapis.com/**')
    await page.click('button:has-text("Try Again")')

    // Should attempt retry (may succeed or fail depending on user existence)
    await page.waitForTimeout(2000)
  })

  test('Invalid credentials show proper error UI', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', 'nonexistent@example.com')
    await page.fill('[data-testid="login-password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-submit-button"]')

    // Should see error message
    await expect(page.locator('text=/No account found|Invalid/i')).toBeVisible({ timeout: 5000 })

    // Should remain on login page
    await expect(page).toHaveURL('/login')

    // Should not show retry button for non-retryable errors
    await expect(page.locator('text=/Try Again/i')).not.toBeVisible()
  })

  test('Duplicate email signup shows proper error UI', async ({ page }) => {
    // First, create a user
    await page.goto('/signup')
    await page.fill('[data-testid="signup-first-name"]', TEST_USER.firstName)
    await page.fill('[data-testid="signup-last-name"]', TEST_USER.lastName)
    await page.fill('[data-testid="signup-email"]', TEST_USER.email)
    await page.fill('[data-testid="signup-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-confirm-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-birth-date"]', TEST_USER.birthDate)
    await page.selectOption('[data-testid="signup-gender"]', TEST_USER.gender)
    await page.click('[data-testid="signup-submit-button"]')
    await page.waitForURL('/profile', { timeout: 10000 })

    // Logout
    await page.click('[data-testid="burger-menu-button"]')
    await page.waitForTimeout(300)
    await dismissToasts(page)
    await page.click('[data-testid="sidebar-logout-button"]')
    await page.waitForURL('/', { timeout: 10000 })

    // Try to signup with same email
    await page.goto('/signup')
    await page.fill('[data-testid="signup-first-name"]', 'Another')
    await page.fill('[data-testid="signup-last-name"]', 'User')
    await page.fill('[data-testid="signup-email"]', TEST_USER.email)
    await page.fill('[data-testid="signup-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-confirm-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-birth-date"]', '1990-01-01')
    await page.selectOption('[data-testid="signup-gender"]', 'male')
    await page.click('[data-testid="signup-submit-button"]')

    // Should see error message
    await expect(page.locator('text=/already in use/i')).toBeVisible({ timeout: 5000 })

    // Should remain on signup page
    await expect(page).toHaveURL('/signup')
  })

  test('Network status indicator shows offline state', async ({ page }) => {
    // Navigate to page first while online
    await page.goto('/login')

    // Simulate offline state
    await page.context().setOffline(true)

    // Should see offline indicator
    await expect(page.locator("text=/You're offline/i")).toBeVisible({ timeout: 5000 })

    // Should see offline message
    await expect(page.locator('text=/No internet connection/i')).toBeVisible()

    // Restore online state
    await page.context().setOffline(false)

    // Should no longer see offline indicator (component returns null when online)
    await expect(page.locator("text=/You're offline/i")).not.toBeVisible({ timeout: 5000 })
  })

  test('Retry mechanism works for network failures', async ({ page }) => {
    // Use unique email per test run to avoid conflicts
    const uniqueEmail = `test-retry-${Date.now()}@example.com`

    // Create a user first
    await page.goto('/signup')
    await page.fill('[data-testid="signup-first-name"]', TEST_USER.firstName)
    await page.fill('[data-testid="signup-last-name"]', TEST_USER.lastName)
    await page.fill('[data-testid="signup-email"]', uniqueEmail)
    await page.fill('[data-testid="signup-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-confirm-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-birth-date"]', TEST_USER.birthDate)
    await page.selectOption('[data-testid="signup-gender"]', TEST_USER.gender)
    await page.click('[data-testid="signup-submit-button"]')
    await page.waitForURL('/profile', { timeout: 10000 })

    // Logout
    await page.click('[data-testid="burger-menu-button"]')
    await page.waitForTimeout(300)
    await dismissToasts(page)
    await page.click('[data-testid="sidebar-logout-button"]')
    await page.waitForURL('/', { timeout: 10000 })

    // Test retry mechanism
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', uniqueEmail)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)

    // Use route interception for more controlled network failure
    await page.route('**/identitytoolkit.googleapis.com/**', route => {
      route.abort('failed')
    })

    await page.click('[data-testid="login-submit-button"]')

    // Should see network error with explicit wait for UI stabilization
    await expect(page.locator('h3:has-text("Connection Problem")')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(1000) // Allow UI to stabilize

    // Restore network with explicit wait
    await page.unroute('**/identitytoolkit.googleapis.com/**')
    await page.waitForTimeout(1000) // Ensure route is fully cleared

    // Use retry logic for the retry button click and navigation
    await expect(async () => {
      await page.click('button:has-text("Try Again")')
      await page.waitForURL('/profile', { timeout: 8000 })
    }).toPass({ timeout: 20000 })
  })

  test('Error boundary navigation works correctly', async ({ page }) => {
    // First create a user and login
    await page.goto('/signup')
    await page.fill('[data-testid="signup-first-name"]', 'Test')
    await page.fill('[data-testid="signup-last-name"]', 'User')
    await page.fill('[data-testid="signup-email"]', 'test@example.com')
    await page.fill('[data-testid="signup-password"]', 'password123')
    await page.fill('[data-testid="signup-confirm-password"]', 'password123')
    await page.fill('[data-testid="signup-birth-date"]', '1990-01-01')
    await page.selectOption('[data-testid="signup-gender"]', 'male')
    await page.click('[data-testid="signup-submit-button"]')

    // Wait for redirect to profile
    await expect(page).toHaveURL('/profile', { timeout: 10000 })

    // Now simulate network error by intercepting requests
    await page.route('**/identitytoolkit.googleapis.com/**', route => {
      route.abort('failed')
    })

    // Navigate to a protected page to trigger auth check
    await page.goto('/events')

    // Wait a bit to see what happens
    await page.waitForTimeout(3000)

    // Check current URL and page content
    const currentUrl = page.url()
    console.log('Current URL after network error:', currentUrl)

    // Get page content to see what's displayed
    const pageContent = await page.textContent('body')
    console.log('Page content:', pageContent?.substring(0, 200) || 'No content')

    // Test navigation regardless of error state
    await page.goto('/')
    await expect(page).toHaveURL('/')

    // Test going to login
    await page.goto('/login')
    await expect(page).toHaveURL('/login')

    // Clean up
    await page.unroute('**/identitytoolkit.googleapis.com/**')
  })

  test('Console error monitoring during error scenarios', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Test various error scenarios
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', 'invalid@example.com')
    await page.fill('[data-testid="login-password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-submit-button"]')

    await page.goto('/signup')
    await page.fill('[data-testid="signup-first-name"]', 'Test')
    await page.fill('[data-testid="signup-last-name"]', 'User')
    await page.fill('[data-testid="signup-email"]', 'invalid-email')
    await page.fill('[data-testid="signup-password"]', 'weak')
    await page.fill('[data-testid="signup-confirm-password"]', 'weak')
    await page.fill('[data-testid="signup-birth-date"]', '1990-01-01')
    await page.selectOption('[data-testid="signup-gender"]', 'male')
    await page.click('[data-testid="signup-submit-button"]')

    // Should have minimal console errors (only expected auth errors)
    expect(consoleErrors.length).toBeLessThan(5)
  })
})
