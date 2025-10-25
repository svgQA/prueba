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

test.describe('User management', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

test('shows user stats and management table', async ({ page }) => {

    await page.getByRole('link', { name: translationRegex('t_user') }).click();

    await expect(page).toHaveURL(/.*users/);

    await expect(page).toHaveTitle(/TY Usuarios|TY Users/);

    for (const summaryKey of [
      'l_total_users',
      'l_active_connection',
      'l_inactive_connection',
    ]) {
      await expectSummaryCard(page, summaryKey);
    }

    await expectTableHeaders(page, [
      'h_user',
      'h_identification',
      'h_email',
      'h_company',
      'h_department',
    ]);

    await openSearchInput(page);
  });
});
