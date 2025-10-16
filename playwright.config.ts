import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
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
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
  ],

  webServer: [
    {
      command: 'firebase emulators:start --only auth',
      port: 9099,
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:8080',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
})
