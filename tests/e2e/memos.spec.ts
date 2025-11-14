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
    }); test('shows memos dashboard controls and allows switching views', async ({ page }) => {
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
    }); test('Protect memo exports and reporting hooks', async ({ page }) => {
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
    }); test('Verify service and user breakdown tabs', async ({ page }) => {
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
    }); test('Validate memo chat live messaging (send/receive)', async ({ page }) => {
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
    }); test('Check the What`s New panel', async ({ page }) => {
        test.setTimeout(60000);
        const initialCompanyButton = page.getByRole('button', { name: /Company 2 222/i });
        await expect(initialCompanyButton).toBeVisible();
        await initialCompanyButton.click();
        await page.getByTestId('opt-lang-15').click();
        const newCompanyButton = page.getByRole('button', { name: /Test despliegue full P1/i });
        await expect(newCompanyButton).toBeVisible();
        await page.reload();
        await expect(newCompanyButton).toBeVisible({ timeout: 10000 });
        await page.evaluate(() => { (document.body.style as any).zoom = 0.6; });
        const noveltyRow = page.getByRole('row', { name: /Jaider Mazabuel/i })
        const jaiderRow = page.locator('tr', { hasText: 'Jaider Mazabuel' }).first();
        const historyButton = jaiderRow.locator('[data-id="history"]');
        await historyButton.click();
        const chatInput = page.getByPlaceholder('Write your comment here');
        await expect(chatInput).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('TY Actions').first()).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Duration (Min)').first()).toBeVisible({ timeout: 10000 });
        await expect(page.locator('label[for="input-date-input"]')).toBeVisible({ timeout: 10000 });
        await expect(page.getByText('Attachment').first()).toBeVisible({ timeout: 10000 });
    }); test('Check the panic panel', async ({ page }) => {
        test.setTimeout(60000);
        const initialCompanyButton = page.getByRole('button', { name: /Company 2 222/i });
        await expect(initialCompanyButton).toBeVisible();
        await initialCompanyButton.click();
        await page.getByTestId('opt-lang-15').click();
        const newCompanyButton = page.getByRole('button', { name: /Test despliegue full P1/i });
        await expect(newCompanyButton).toBeVisible();
        await page.reload();
        await expect(newCompanyButton).toBeVisible({ timeout: 10000 });
        await page.evaluate(() => { (document.body.style as any).zoom = 0.6; });
        await page.getByRole('button', { name: 'ɮ' }).click();
        const panicRow = page.locator('tr', { hasText: 'Emit a Panic Alert' });
        const expandButton = panicRow.locator('span[data-id="expandable"]');
        await expandButton.click();
        const mapElement = page.locator('.maplibregl-canvas');
        await expect(mapElement).toBeVisible({ timeout: 10000 });
        const chatInput = page.getByPlaceholder('Write your comment here');
        await expect(chatInput).not.toBeVisible();
        const tyActions = page.getByText('TY Actions');
        await expect(tyActions).not.toBeVisible();
    }); test('Cover memo attachments', async ({ page }) => {
        test.setTimeout(60000);
        const initialCompanyButton = page.getByRole('button', { name: /Company 2 222/i });
        await expect(initialCompanyButton).toBeVisible();
        await initialCompanyButton.click();
        await page.getByTestId('opt-lang-15').click();
        const newCompanyButton = page.getByRole('button', { name: /Test despliegue full P1/i });
        await expect(newCompanyButton).toBeVisible();
        await page.reload();
        await expect(newCompanyButton).toBeVisible({ timeout: 10000 });
        await page.evaluate(() => { (document.body.style as any).zoom = 0.5; });
        const jaiderRow = page.locator('tr', { hasText: 'Jaider Mazabuel' }).first();
        const historyButton = jaiderRow.locator('[data-id="history"]');
        await historyButton.click();
        const commentField = page.getByPlaceholder('Write your comment here');
        await commentField.click();
        await commentField.fill('PruebaMEM01');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        const chatContainer = page.locator('[role="dialog"]') 
          .or(page.locator('.modal-body'))
          .or(page.locator('.chat-container'))
          .or(page.locator('[class*="scroll"]').first());
        await chatContainer.evaluate((el) => {
          el.scrollTop = el.scrollHeight;
        });
        await page.waitForTimeout(1000);
        let uploadInput = page.locator('input[type="file"]').first();
        if (await uploadInput.count() > 0) {
          await uploadInput.scrollIntoViewIfNeeded({ timeout: 10000 });
          await page.waitForTimeout(500);
        } else {
          const uploadButton = page.locator('button').filter({ 
            hasText: /elegir|choose|select|seleccionar|archivo|file/i 
          }).first();
          
          if (await uploadButton.count() > 0) {
            await uploadButton.scrollIntoViewIfNeeded({ timeout: 10000 });
            await page.waitForTimeout(500);
            uploadInput = uploadButton;
          } else {
            throw new Error('No se encontró el botón/input de subir archivos');
          }
        }
        const fileChooserPromise = page.waitForEvent('filechooser');
        await uploadInput.click({ force: true });
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles({
          name: 'test_file.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('Este es un archivo de prueba'),
        });
        await page.waitForTimeout(3000);
        const sendButton = page.locator('button[name="memo-send-response"]');
        await expect(sendButton).toBeVisible({ timeout: 10000 });
        await expect(sendButton).toBeEnabled({ timeout: 10000 });
        await page.waitForFunction(
          () => {
            const btn = document.querySelector('button[name="memo-send-response"]');
            return btn && !btn.hasAttribute('disabled') && !btn.classList.contains('disabled');
          },
          { timeout: 10000 }
        );
        await page.screenshot({ path: 'debug-before-send.png', fullPage: true });
        await sendButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await sendButton.click({ timeout: 5000 });
        await expect(page.getByText(/Se.*envió.*respuesta|enviado|sent/i)).toBeVisible({ timeout: 10000 });
    }); test.skip('Cover memo predefined replies (Opciones Predefinidas)', async ({ page }) => {
        test.setTimeout(60000);
        await page.locator('button[name="button-change-scheduler"]').click();
        await page.waitForLoadState('networkidle');
        await page.locator('button[name="view-mode"]').click();
        await page.locator('li[data-name="h_user"]').click();
        await page.waitForLoadState('networkidle');
        await page.getByText('Juan Pablo Fernandez').click();
        await page.locator('button[name="btn-reply-memo"]').click();
  }); 
});