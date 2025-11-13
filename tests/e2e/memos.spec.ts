import { test, expect } from '@playwright/test';
import * as path from 'path';
import {
  login,
  //appUrl,
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
    }); test.skip('shows memos dashboard controls and allows switching views', async ({ page }) => {
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
    }); test.skip('Protect memo exports and reporting hooks', async ({ page }) => {
        test.setTimeout(60000);        
        await page.click('span.text-primary.left-0.px-1.size-sm.vx-icon.vx-icon-306.hidden.sm\\:inline');
        await page.waitForLoadState('networkidle');
        await page.getByText('Interno').click();
        await page.getByRole('textbox', { name: 'Start Date' }).click();
        await page.getByRole('textbox', { name: 'Start Date' }).fill('2025-08-01T14:43');
        await page.getByRole('textbox', { name: 'End Date' }).click();
        await page.getByRole('textbox', { name: 'End Date' }).fill('2025-11-12T18:43');
        await page.getByRole('button', { name: 'Save' }).click();
        await page.getByText('downloaded successfully').click();
    }); test.skip('Verify service and user breakdown tabs', async ({ page }) => {
        test.setTimeout(60000);   
        await page.locator('button[name="button-change-scheduler"]').click();  
        await page.waitForLoadState('networkidle'); 
        await page.locator('button[name="view-mode"]').click();  
        await page.locator('li[data-name="h_user"]').click();
        await page.waitForLoadState('networkidle');
        await page.getByText('Juan Pablo Fernandez').click();
        const userMemoContent = page.getByText('Prueba offline').first();
        await expect(userMemoContent).toBeVisible({ timeout: 10000 });
        await page.locator('button[name="view-mode"]').click();
        await page.waitForLoadState('networkidle');
        await page.locator('li[data-name="h_service"]').click();
        await page.waitForTimeout(2000);
        await expect(userMemoContent).not.toBeVisible({ timeout: 10000 });
    }); test.skip('Validate memo chat live messaging (send/receive)', async ({ page }) => {
        test.setTimeout(60000);   
        await page.evaluate(() => { (document.body.style as any).zoom = 0.6; });
        await page.locator('span[data-row-id="0"][data-id="history"]').click();
        const commentField = page.getByPlaceholder('Write your comment here');
        await commentField.click();
        await commentField.fill('PruebaMEM01');
        await page.waitForLoadState('networkidle');
        await page.locator('button[name="memo-send-response"]').click();
        await page.getByText('Se a envió la respuesta').click();
        await page.waitForLoadState('networkidle');
        const commentsSection = page.locator('div.rounded-lg.px-3.py-2.relative');
        const comment = commentsSection.locator('text=PruebaMEM01').last();
        await comment.scrollIntoViewIfNeeded();
        await expect(comment).toBeVisible();
        await expect(comment).toHaveText('PruebaMEM01');
  });
});