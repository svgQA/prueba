import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: false,
  workers: 1,
  testDir: './tests/e2e',
  use: {
    baseURL: process.env.BASE_URL || 'https://dev.tryvoo.com',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    permissions: ['geolocation'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
