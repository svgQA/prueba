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

test.describe('Notifications', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

  test('shows notification dashboard analytics and history table', async ({ page }) => {
    await page.goto(`${appUrl}/dashboard/history`);
    await expect(page).toHaveTitle(/TY Historial|TY History/);

    for (const summaryKey of [
      'history.cards.notificationShifts',
      'history.cards.openRate',
      'history.cards.monthlyNotifications',
    ]) {
      await expectSummaryCard(page, summaryKey);
    }

    await expectTableHeaders(page, [
      'h_title',
      'h_description',
      'h_type',
      'h_sent_date',
      'h_recipient',
      'h_open_rate',
    ]);

    await openSearchInput(page);
  });
});
