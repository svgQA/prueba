import { test, expect } from '@playwright/test';
import {
  ensureDashboardLoaded,
  expectSummaryCard,
  translationRegex,
} from './utils';

const baseURL = 'http://localhost:3050';

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

    await page.getByRole('link', { name: 'Sign In' }).click();
    
    await page
      .locator('input[name="email"], input[name="username"]')
      .first()
      .fill(email!);
    await page.locator('input[name="password"]').fill(password!);
    await page.locator('button[type="submit"]').click();
    await ensureDashboardLoaded(page);
    await expect(page).toHaveURL(/dashboard/);

    await expectSummaryCard(page, 'h_memos_total');

    const userMenu = page.locator('button[name="user"]');
    await userMenu.click();
    await expect(
      page
        .locator('li')
        .filter({ hasText: translationRegex('t_setting') })
        .first()
    ).toBeVisible();
    await userMenu.click();
  });
});
