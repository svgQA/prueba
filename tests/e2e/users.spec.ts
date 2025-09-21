import { test, expect } from '@playwright/test';
import { login, appUrl } from './utils';

const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe('User management', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows users page', async ({ page }) => {
    await page.goto(`${appUrl}/dashboard/users`);
    await expect(page).toHaveTitle(/TY Usuarios|TY Users/);
  });
});
