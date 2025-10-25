import { test, expect } from '@playwright/test';
import {
  login,
  appUrl,
  ensureDashboardLoaded,
  expectSummaryCard,
  expectTableHeaders,
  openSearchInput,
  translationRegex,
} from './utils';

const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe('Access management', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

  test('shows access metrics and table columns', async ({ page }) => {
    await page.getByRole('link', { name: translationRegex('t_access') }).click();
    await expect(page).toHaveURL(/.*access/);
    //await page.goto(`${appUrl}/dashboard/access`);
    await expect(page).toHaveTitle(/TY Acceso|TY Access/);

    for (const summaryKey of [
      'h_accessess_total',
      'h_accessess_in_progress',
      'h_accessess_completed',
    ]) {
      await expectSummaryCard(page, summaryKey);
    }

    await expectTableHeaders(page, [
      'h_resident',
      'h_visit',
      'h_entry_type',
      'h_house_number',
      //'h_status',
      'h_observation',
      'h_plate',
    ]);

    await openSearchInput(page);
  });
});
