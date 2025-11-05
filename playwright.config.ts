import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // Use list reporter for non-blocking terminal output
  // Use html reporter only when explicitly requested
  reporter: process.env.E2E_REPORT === 'html' ? 'html' : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8080',
    trace: 'on-first-retry',
  },

  projects: [
    // Mobile Devices - Android Pixel 5 only
    {
      name: 'android-pixel5',
      use: {
        ...devices['Pixel 5'],
        headless: true,
      },
    },
  ],
})
