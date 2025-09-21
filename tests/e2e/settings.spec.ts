import { test, expect } from '@playwright/test';
import { login, appUrl } from './utils';

const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe('Profile & settings', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('shows settings page', async ({ page }) => {
    await page.goto(`${appUrl}/dashboard/setting`);
    await expect(page).toHaveTitle(/TY Configuración|TY Settings/);
  });
});
