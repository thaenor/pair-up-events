import { test, expect } from '@playwright/test'

const TEST_USER = {
  email: `e2e-test-${Date.now()}@example.com`,
  password: 'SecurePass123!',
  firstName: 'E2E',
  lastName: 'Tester',
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

// Helper function to open sidebar and wait for animation
async function openSidebar(page) {
  await page.click('[data-testid="burger-menu-button"]')
  await page.waitForTimeout(300) // Sidebar animation time
}

test.describe('Authentication Flow', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    // Monitor console for errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text())
      }
    })
  })

  test('Complete auth flow: signup -> logout -> login', async ({ page }) => {
    // 1. SIGNUP
    await page.goto('/signup')
    await expect(page).toHaveURL('/signup')

    // Fill signup form
    await page.fill('[data-testid="signup-first-name"]', TEST_USER.firstName)
    await page.fill('[data-testid="signup-last-name"]', TEST_USER.lastName)
    await page.fill('[data-testid="signup-email"]', TEST_USER.email)
    await page.fill('[data-testid="signup-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-confirm-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-birth-date"]', TEST_USER.birthDate)
    await page.selectOption('[data-testid="signup-gender"]', TEST_USER.gender)

    // Submit signup
    await page.click('[data-testid="signup-submit-button"]')

    // Verify redirect to profile
    await expect(page).toHaveURL('/profile', { timeout: 10000 })

    // 2. LOGOUT
    // Open sidebar and logout
    await openSidebar(page)
    await dismissToasts(page)
    await page.click('[data-testid="sidebar-logout-button"]')
    await expect(page).toHaveURL('/', { timeout: 10000 })

    // 3. LOGIN
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    await page.click('[data-testid="login-submit-button"]')

    // Verify successful login
    await expect(page).toHaveURL('/profile', { timeout: 10000 })

    // Final cleanup: logout
    await openSidebar(page)
    await dismissToasts(page)
    await page.click('[data-testid="sidebar-logout-button"]')
  })

  test('Session persistence after page reload', async ({ page, context }) => {
    // Login first
    await page.goto('/login')
    await page.fill('[data-testid="login-email-input"]', TEST_USER.email)
    await page.fill('[data-testid="login-password-input"]', TEST_USER.password)
    await page.click('[data-testid="login-submit-button"]')

    await expect(page).toHaveURL('/profile', { timeout: 10000 })

    // Reload page
    await page.reload()

    // Should still be on profile (session persisted)
    await expect(page).toHaveURL('/profile')

    // Open new tab in same context
    const newPage = await context.newPage()
    await newPage.goto('/profile')

    // Should have access (shared session)
    await expect(newPage).toHaveURL('/profile')

    await newPage.close()

    // Cleanup
    await openSidebar(page)
    await dismissToasts(page)
    await page.click('[data-testid="sidebar-logout-button"]')
  })

  test('Login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[data-testid="login-email-input"]', 'wrong@example.com')
    await page.fill('[data-testid="login-password-input"]', 'wrongpassword')
    await page.click('[data-testid="login-submit-button"]')

    // Should see error toast (sonner)
    await expect(page.locator('text=/No account found|Invalid/i')).toBeVisible({ timeout: 5000 })

    // Should remain on login page
    await expect(page).toHaveURL('/login')
  })

  test('Signup with existing email shows error', async ({ page }) => {
    await page.goto('/signup')

    // Try to signup with the same email
    await page.fill('[data-testid="signup-first-name"]', 'Test')
    await page.fill('[data-testid="signup-last-name"]', 'User')
    await page.fill('[data-testid="signup-email"]', TEST_USER.email)
    await page.fill('[data-testid="signup-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-confirm-password"]', TEST_USER.password)
    await page.fill('[data-testid="signup-birth-date"]', '1990-01-01')
    await page.selectOption('[data-testid="signup-gender"]', 'male')

    await page.click('[data-testid="signup-submit-button"]')

    // Should see error
    await expect(page.locator('text=/already in use/i')).toBeVisible({ timeout: 5000 })

    // Should remain on signup page
    await expect(page).toHaveURL('/signup')
  })

  test('Check for console errors during auth flow', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    // Navigate through auth flow
    await page.goto('/login')
    await page.goto('/signup')
    await page.goto('/login')

    // Verify no errors
    expect(consoleErrors).toHaveLength(0)
  })
})
