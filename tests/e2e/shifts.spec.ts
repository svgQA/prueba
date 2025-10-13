import { test, expect } from '@playwright/test';
import {
  login,
  appUrl,
  ensureDashboardLoaded,
  expectSummaryCard,
  expectTableHeaders,
  openSearchInput,
} from './utils';

const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe('Shifts', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

  test('renders shifts summary and table controls', async ({ page }) => {
    await page.goto(`${appUrl}/dashboard/shifts`);
    await expect(page).toHaveTitle(/TY Turnos|TY Shifts/);

    for (const summaryKey of [
      'h_shifts_total',
      'h_shifts_in_progress',
      'h_shifts_completed',
    ]) {
      await expectSummaryCard(page, summaryKey);
    }

    await expectTableHeaders(page, [
      'h_user',
      'h_service',
      'h_contract',
      'h_date',
      'h_start',
      'h_end',
      'h_status',
      'h_duration',
    ]);

    const searchInput = await openSearchInput(page);
    await expect(searchInput).toBeEnabled();

    await expect(page.locator('button[name="button-create-shift"]')).toBeVisible();
  });
});
