import { test, expect } from '@playwright/test';
import * as path from 'path';
import {
  login,
  appUrl,
  ensureDashboardLoaded,
  expectSummaryCard,
  expectTableHeaders,
  translationRegex,
  openSearchInput,
} from './utils';

    const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

    test.describe('Memos', () => {
      test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

      test.beforeEach(async ({ page }) => {
        await login(page);
        await ensureDashboardLoaded(page);
    });test.skip('shows memos dashboard controls and allows switching views', async ({ page }) => {
      await expect(page).toHaveTitle(/TY Chat/);

      for (const summaryKey of [
        'h_memos_total',
        'h_memos_unresolved',
        'h_memos_resolved',
      ]) {
        await expectSummaryCard(page, summaryKey);
      }

      await expectTableHeaders(page, [
        'h_user',
        'h_novelty',
        'h_description',
        'h_status',
        'h_priority',
        'h_history',
    ]);
      const searchInput = await openSearchInput(page);
      await searchInput.fill('memo');
      await expect(searchInput).toHaveValue('memo');
      const panicButton = page.locator('button[name="button-change-panic"]');
      await panicButton.click();
      await expect(panicButton).toHaveClass(/bg-primary/);
      const tableButton = page.locator('button[name="button-change-table"]');
      await tableButton.click();
      await expect(tableButton).toHaveClass(/bg-primary/);
  });
});