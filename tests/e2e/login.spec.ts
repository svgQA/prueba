import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://dev.tryvoo.com';

/**
 * E2E test for login functionality.
 * Credentials must be provided via E2E_EMAIL and E2E_PASSWORD env vars.
 */
test.describe('Login flow', () => {
  test('user can sign in with valid credentials', async ({ page }) => {
    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;
    test.skip(!email || !password, 'E2E_EMAIL and E2E_PASSWORD must be set');

    await page.goto(baseURL);
    await page
      .locator('input[name="email"], input[name="username"]')
      .first()
      .fill(email!);
    await page.locator('input[name="password"]').fill(password!);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/dashboard/);
  });
});
