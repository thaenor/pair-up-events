/**
 * E2E Test Helper Functions
 *
 * Shared utility functions for Playwright E2E tests.
 * Reduces code duplication and ensures consistent test behavior across suites.
 *
 * @module tests/e2e/helpers
 */

import { Page } from '@playwright/test'
import { TEST_TIMEOUTS } from './constants'
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { join } from 'path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

/**
 * Sets up route blocking for Google Tag Manager and analytics services.
 * Prevents these services from making network requests that interfere with network-idle state.
 *
 * Call this function in test beforeEach hooks or setup files.
 *
 * @param page - Playwright page object
 *
 * @example
 * test.beforeEach(async ({ page }) => {
 *   await blockTrackingServices(page)
 * })
 */
export async function blockTrackingServices(page: Page): Promise<void> {
  // Block Google Tag Manager
  await page.route('**/*googletagmanager.com/**', route => route.abort())
  await page.route('**/*google-analytics.com/**', route => route.abort())
  await page.route('**/*analytics.google.com/**', route => route.abort())
  await page.route('**/g/collect**', route => route.abort())
  await page.route('**/gtag/**', route => route.abort())
  await page.route('**/gtm.js**', route => route.abort())

  // Block Sentry (even though it's production-only, blocking it is safe)
  await page.route('**/*sentry.io/**', route => route.abort())
  await page.route('**/*ingest.sentry.io/**', route => route.abort())
}

/**
 * Determines the best element selector to wait for based on the current page URL.
 * Each page has a unique main headline or key element that indicates it's fully loaded.
 *
 * @param page - Playwright page object
 * @returns Selector string for the page's main element
 */
function getPageWaitSelector(page: Page): string {
  try {
    const url = page.url()
    const pathname = new URL(url).pathname

    // Map URL paths to their main headline/element selectors
    const pageSelectors: Record<string, string> = {
      '/': '[data-testid="main-navigation"]', // Landing page - navigation indicates page loaded
      '/login': 'input[type="email"]', // Login page - email input indicates form loaded
      '/signup': '[data-testid="signup-first-name"]', // Signup page - first name input indicates form loaded
      '/terms-of-service': 'h1:has-text("Terms of Service")', // Terms page - main heading
      '/privacy-policy': 'h1:has-text("Privacy Policy")', // Privacy page - main heading
      '/profile': 'h1:has-text("Your Profile")', // Profile page - main heading
      '/events': 'h1:has-text("My Events")', // Events page - main heading
      '/events/create': 'h1:has-text("Create Event")', // Events create page - main heading
      '/messenger': 'h1:has-text("Messenger")', // Messenger page - main heading
      '/settings': 'h1:has-text("Settings")', // Settings page - main heading
      '/invite': 'h1:has-text("Invite a Friend")', // Invite page - main heading
      '/contact-us': 'h1:has-text("Contact Us")', // Contact Us page - main heading
      '/about': 'h1:has-text("About Us")', // About page - main heading
    }

    // Check exact pathname match first
    if (pageSelectors[pathname]) {
      return pageSelectors[pathname]
    }

    // Check for 404/Not Found page
    if (pathname.includes('404') || pathname.includes('this-path-does-not-exist')) {
      return 'h1:has-text("404"), h2:has-text("Page Not Found")'
    }

    // Default fallback - wait for any h1 heading
    return 'h1'
  } catch {
    // If URL parsing fails, use fallback
    return 'h1'
  }
}

/**
 * Compares two PNG images using pixelmatch.
 * Returns the number of different pixels and optionally saves a diff image.
 *
 * @param img1Path - Path to first image
 * @param img2Path - Path to second image
 * @param diffPath - Optional path to save diff image
 * @returns Object with difference count and percentage
 */
function compareScreenshots(
  img1Path: string,
  img2Path: string,
  diffPath?: string
): { diffPixels: number; diffPercentage: number; width: number; height: number } {
  const img1 = PNG.sync.read(readFileSync(img1Path))
  const img2 = PNG.sync.read(readFileSync(img2Path))

  const { width, height } = img1
  if (img2.width !== width || img2.height !== height) {
    throw new Error(`Image dimensions don't match: ${width}x${height} vs ${img2.width}x${img2.height}`)
  }

  const diff = new PNG({ width, height })
  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,
  })

  const totalPixels = width * height
  const diffPercentage = numDiffPixels / totalPixels

  // Save diff image if differences found and diffPath provided
  if (numDiffPixels > 0 && diffPath) {
    const diffDir = join(diffPath, '..')
    if (!existsSync(diffDir)) {
      mkdirSync(diffDir, { recursive: true })
    }
    writeFileSync(diffPath, PNG.sync.write(diff))
  }

  return { diffPixels: numDiffPixels, diffPercentage, width, height }
}

/**
 * Takes a full-page screenshot snapshot for visual regression testing.
 * Compares against archived screenshot and reports significant differences.
 * Uses element-based waiting instead of network-idle to avoid timeouts from
 * third-party services (GTM, analytics) that prevent network-idle state.
 *
 * @param page - Playwright page object
 * @param pageName - Name for the screenshot file (without extension)
 * @param threshold - Percentage threshold for significant differences (default: 1%)
 *
 * @example
 * await takePageSnapshot(page, 'profile-page')
 */
export async function takePageSnapshot(page: Page, pageName: string, threshold: number = 0.01): Promise<void> {
  // Wait for page to load (DOM and resources)
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')

  // Wait for the page-specific main element to be visible
  const selector = getPageWaitSelector(page)
  try {
    await page.waitForSelector(selector, {
      state: 'visible',
      timeout: TEST_TIMEOUTS.NAVIGATION,
    })
  } catch {
    // Fallback: if specific selector fails, just wait a bit for animations
    console.warn(`Warning: Could not find selector "${selector}" for page snapshot ${pageName}. Using fallback.`)
  }

  // Wait for animations to complete
  await page.waitForTimeout(TEST_TIMEOUTS.NETWORK_IDLE)

  const screenshotsDir = 'tests/e2e/screenshots'
  const archivedScreenshotPath = join(screenshotsDir, `${pageName}.png`)
  const tempScreenshotPath = join(screenshotsDir, `${pageName}.tmp.png`)

  // Take new screenshot to temp location
  await page.screenshot({
    path: tempScreenshotPath,
    fullPage: true,
  })

  // Compare with archived screenshot if it exists
  if (existsSync(archivedScreenshotPath)) {
    try {
      const diffDir = join(screenshotsDir, 'diffs')
      const diffPath = join(diffDir, `${pageName}-diff.png`)

      const { diffPixels, diffPercentage } = compareScreenshots(tempScreenshotPath, archivedScreenshotPath, diffPath)

      if (diffPercentage > threshold) {
        const diffPercent = (diffPercentage * 100).toFixed(2)
        console.warn(`⚠️  Screenshot comparison failed for ${pageName}:`)
        console.warn(`   ${diffPixels} different pixels (${diffPercent}%)`)
        console.warn(`   Threshold: ${(threshold * 100).toFixed(2)}%`)
        console.warn(`   Diff image saved to: ${diffPath}`)

        // Replace archived with new screenshot for future comparisons
        writeFileSync(archivedScreenshotPath, readFileSync(tempScreenshotPath))
      } else {
        // Screenshots match within threshold - remove any old diff images
        if (existsSync(diffPath)) {
          try {
            unlinkSync(diffPath)
          } catch {
            // Ignore errors deleting old diff
          }
        }
        // Clean up temp screenshot since it matches
        try {
          unlinkSync(tempScreenshotPath)
        } catch {
          // Ignore cleanup errors
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not compare screenshot for ${pageName}:`, error)
      // Move temp to archived on error
      writeFileSync(archivedScreenshotPath, readFileSync(tempScreenshotPath))
    }
  } else {
    // No archived screenshot exists - this is the first run
    // Move temp to archived location
    writeFileSync(archivedScreenshotPath, readFileSync(tempScreenshotPath))
    try {
      unlinkSync(tempScreenshotPath)
    } catch {
      // Ignore cleanup errors
    }
    console.log(`📸 First screenshot saved for ${pageName}`)
  }
}

/**
 * Dismisses any visible toast notifications by clicking their close buttons.
 * This prevents toasts from blocking interactions in tests.
 *
 * @param page - Playwright page object
 */
export async function dismissToasts(page: Page): Promise<void> {
  try {
    const closeButtons = page.locator('[data-close-button]')
    const count = await closeButtons.count()
    for (let i = 0; i < count; i++) {
      await closeButtons
        .first()
        .click()
        .catch(() => {})
    }
    await page.waitForTimeout(TEST_TIMEOUTS.TOAST_DISMISSAL)
  } catch {
    // Silently ignore if no toasts present
  }
}

/**
 * Opens the sidebar menu by clicking the burger menu button.
 * Includes proper wait for animation completion.
 *
 * @param page - Playwright page object
 */
export async function openSidebar(page: Page): Promise<void> {
  await page.click('[data-testid="burger-menu-button"]')
  await page.waitForTimeout(TEST_TIMEOUTS.ANIMATION)
}

/**
 * Sets up console error and warning monitoring for a page.
 * Returns arrays that collect errors and warnings for assertion.
 * Filters out expected network errors from blocked tracking services.
 *
 * @param page - Playwright page object
 * @returns Object containing consoleErrors and consoleWarnings arrays
 *
 * @example
 * const { consoleErrors } = setupConsoleErrorMonitoring(page)
 * // ... perform actions
 * expect(consoleErrors).toHaveLength(0)
 */
export function setupConsoleErrorMonitoring(page: Page) {
  const consoleErrors: string[] = []
  const consoleWarnings: string[] = []

  // Patterns for expected/ignored errors from blocked services and emulator issues
  const ignoredErrorPatterns = [
    /Failed to load resource: net::ERR_FAILED/i, // Network errors from blocked resources
    /Failed to load resource: the server responded with a status of 400/i, // Bad request from blocked resources
    /Failed to load resource: the server responded with a status of 403/i, // Forbidden from blocked resources
    /Failed to load resource: the server responded with a status of 429/i, // Rate limiting from blocked resources
    /Failed to fetch/i, // Fetch errors from blocked resources
    /CORS policy/i, // CORS errors from emulator (expected when app and emulator on different ports)
    /Access to fetch.*has been blocked by CORS policy/i, // CORS errors from Firestore emulator
    /Could not reach Cloud Firestore backend/i, // Firestore emulator connection issues
    /Failed to get document because the client is offline/i, // Firestore offline mode (expected when emulator not connected)
    /FirebaseError.*unavailable/i, // Firebase unavailable errors (emulator connection issues)
    /operate in offline mode/i, // Firestore offline mode messages
  ]

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const errorText = msg.text()
      // Filter out expected errors from blocked tracking services
      const shouldIgnore = ignoredErrorPatterns.some(pattern => pattern.test(errorText))
      if (!shouldIgnore) {
        consoleErrors.push(errorText)
      }
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text())
    }
  })

  return { consoleErrors, consoleWarnings }
}

/**
 * Authenticates a test user by creating a new account via the signup flow.
 * Returns to the signup page and waits for redirect to profile upon completion.
 *
 * @param page - Playwright page object
 * @returns Test user object that was created
 *
 * @example
 * const user = await authenticateUser(page)
 * // User is now logged in
 */
export async function authenticateUser(page: Page) {
  const testUser = {
    email: `e2e-snapshot-${Date.now()}@example.com`,
    password: 'SecurePass123!',
    firstName: 'E2E',
    lastName: 'Snapshot',
    birthDate: '1995-06-15',
    gender: 'prefer-not-to-say',
  }

  // Go to signup
  await page.goto('/signup')

  // Fill signup form
  await page.fill('[data-testid="signup-first-name"]', testUser.firstName)
  await page.fill('[data-testid="signup-last-name"]', testUser.lastName)
  await page.fill('[data-testid="signup-email"]', testUser.email)
  await page.fill('[data-testid="signup-password"]', testUser.password)
  await page.fill('[data-testid="signup-confirm-password"]', testUser.password)
  await page.fill('[data-testid="signup-birth-date"]', testUser.birthDate)
  await page.selectOption('[data-testid="signup-gender"]', testUser.gender)

  // Submit signup
  await page.click('[data-testid="signup-submit-button"]')

  // Wait for redirect to profile
  await page.waitForURL('/profile', { timeout: TEST_TIMEOUTS.NAVIGATION })

  return testUser
}

/**
 * Logs out the current user by opening the sidebar and clicking the logout button.
 * Includes proper handling of toast dismissals and sidebar animations.
 *
 * @param page - Playwright page object
 */
export async function logout(page: Page): Promise<void> {
  await dismissToasts(page)
  await openSidebar(page)
  await dismissToasts(page)

  // Click logout button and wait for navigation
  await page.click('[data-testid="sidebar-logout-button"]')

  // Wait for navigation away from current protected page
  // The Navigation component navigates to '/' after logout
  // Use waitForNavigation to handle any redirects
  await page.waitForURL(
    url => {
      const pathname = new URL(url).pathname
      // Accept either '/' or '/login' as valid logout destinations
      // Some flows might redirect to login after logout
      return pathname === '/' || pathname === '/login'
    },
    { timeout: TEST_TIMEOUTS.NAVIGATION }
  )

  // Dismiss any toasts that appear after logout
  await dismissToasts(page)
}

/**
 * Creates a persistent test account once for use throughout E2E tests.
 * This account is created once and reused across all tests in the flow.
 *
 * @param page - Playwright page object
 * @returns Test user object with credentials
 *
 * @example
 * const user = await createPersistentTestAccount(page)
 * // User is now logged in and account persists across tests
 */
export async function createPersistentTestAccount(page: Page) {
  const testUser = {
    email: `e2e-flow-${Date.now()}@example.com`,
    password: 'SecurePass123!',
    firstName: 'E2E',
    lastName: 'Flow',
    birthDate: '1995-06-15',
    gender: 'prefer-not-to-say',
  }

  // Go to signup
  await page.goto('/signup')

  // Fill signup form
  await page.fill('[data-testid="signup-first-name"]', testUser.firstName)
  await page.fill('[data-testid="signup-last-name"]', testUser.lastName)
  await page.fill('[data-testid="signup-email"]', testUser.email)
  await page.fill('[data-testid="signup-password"]', testUser.password)
  await page.fill('[data-testid="signup-confirm-password"]', testUser.password)
  await page.fill('[data-testid="signup-birth-date"]', testUser.birthDate)
  await page.selectOption('[data-testid="signup-gender"]', testUser.gender)

  // Submit signup
  await page.click('[data-testid="signup-submit-button"]')

  // Wait for redirect to profile
  await page.waitForURL('/profile', { timeout: TEST_TIMEOUTS.NAVIGATION })

  return testUser
}

/**
 * Creates a test image buffer for E2E profile picture upload tests.
 * Returns a valid 1x1 PNG image buffer that can be used with setInputFiles.
 *
 * @returns Buffer containing a valid PNG image
 *
 * @example
 * const testImage = createTestImageBuffer()
 * await fileInput.setInputFiles({
 *   name: 'test-profile.png',
 *   mimeType: 'image/png',
 *   buffer: testImage,
 * })
 */
export function createTestImageBuffer(): Buffer {
  // Base64-encoded 1x1 transparent PNG (valid PNG format)
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  )
}
