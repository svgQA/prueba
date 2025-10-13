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

test.describe('Forms', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

  test('renders forms metrics and disables unavailable views', async ({ page }) => {
    await page.goto(`${appUrl}/dashboard/forms`);
    await expect(page).toHaveTitle(/TY Formulario|TY Form/);

    for (const summaryKey of [
      'h_forms_total',
      'h_forms_active',
      'h_forms_archived',
    ]) {
      await expectSummaryCard(page, summaryKey);
    }

    await expectTableHeaders(page, [
      'h_user',
      'h_title',
      'h_created',
      'h_updated',
      'h_status',
    ]);

    const searchInput = await openSearchInput(page);
    await expect(searchInput).toBeEnabled();

    const schedulerButton = page.locator('button[name="button-change-scheduler"]');
    await expect(schedulerButton).toBeDisabled();
  });
});
