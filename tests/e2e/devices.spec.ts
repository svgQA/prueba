import { test, expect } from '@playwright/test';
import { login, appUrl, ensureDashboardLoaded } from './utils';

const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe.skip('Device management', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

  test('shows devices placeholder section', async ({ page }) => {
    await page.goto(`${appUrl}/dashboard/devices`);
    await expect(page).toHaveTitle(/TY Dispositivos|TY Devices/);
    await expect(page.locator('section')).toContainText('Devices');
  });
});
