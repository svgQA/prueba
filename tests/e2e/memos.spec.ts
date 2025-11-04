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
      });

      test('shows memos dashboard controls and allows switching views', async ({ page }) => {
        //await page.goto(`${appUrl}/dashboard`);
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
    });test('Cover memo attachments & predefined replies', async ({ page }) => {
      await page.getByRole('link', { name: translationRegex('t_memo') }).click();
      await page.waitForURL(/.*memos/);
      await page.waitForLoadState('networkidle');
      const firstMemoRow = page.getByText('Robo en el lugar').first();
      await expect(firstMemoRow).toBeVisible({ timeout: 10000 });
      await firstMemoRow.click();
      const composer = page.getByPlaceholder(/Escribe tu comentario aquí|Escribe tu descripción del Memo aquí/i);
      await expect(composer).toBeVisible({ timeout: 10000 });
      const predefinedButton = page.getByRole('button', { name: 'TY Acciones' }); 
      await expect(predefinedButton).toBeVisible();
      await predefinedButton.click();
      const predefinedOption = page.getByText('Gracias, lo revisaré').first(); 
      await expect(predefinedOption).toBeVisible();
      await predefinedOption.click();
      await expect(composer).toHaveValue('Gracias, lo revisaré');
      await composer.clear();
      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeVisible();
      await fileInput.setInputFiles(path.resolve(__dirname, 'test-file.txt'));
      await expect(page.getByText('test-file.txt')).toBeVisible({ timeout: 10000 });
  });
});
