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

test.describe('Correspondence', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

  test('displays correspondence summary and columns', async ({ page }) => {
    await page.goto(`${appUrl}/dashboard/correspondence`);
    await expect(page).toHaveTitle(/TY Correspondencia|TY Correspondence/);

    for (const summaryKey of [
      'h_correspondence_total',
      'h_correspondence_in_progress',
      'h_correspondence_completed',
    ]) {
      await expectSummaryCard(page, summaryKey);
    }

    await expectTableHeaders(page, [
      'h_sender',
      'h_owner',
      'h_house_number',
      'h_package_type',
      'h_status',
    ]);

    await openSearchInput(page);
  });
});
