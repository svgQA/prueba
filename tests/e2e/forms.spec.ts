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

test.describe('Forms', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  }); test.skip('renders forms metrics and disables unavailable views', async ({ page }) => {
  await page.getByRole('link', { name: translationRegex('t_inspect') }).click();
  await expect(page).toHaveURL(/.*forms/);
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
  }); test('create smart group', async ({ page }) => {
    test.setTimeout(120000);
    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();
    await page.getByRole('link', { name: /groups/i }).click();
    const newRoleButton = page.locator('#user\\:groups\\:state\\:new');
    await expect(newRoleButton).toBeVisible({ timeout: 15000 });
    await newRoleButton.click();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.6; });
    await page.locator('input[name="Nombre"]').fill('GIP');
    await page.locator('textarea[name="Nombre"]').fill('GrupoInteligentePrueba');
    await page.locator('button[name="btn-dd-condition"]').dblclick();
    await page.locator('button[name="field"]').first().waitFor({ state: 'visible' });
    await page.locator('input[name="int-selection"]').first().fill('Andres');
    await page.locator('button[name="btn-dd-condition"]').click();
    await page.locator('button[name="field"]').nth(1).waitFor({ state: 'visible' });
    await page.locator('button[name="field"]').nth(1).click();
    await page.locator('li[data-name="alias"]').click();
    await page.locator('input[name="int-selection"]').nth(1).fill('Lopez');
    await page.locator('button[name="btn-dd-group"]').click();
    await page.locator('button[name="btn-add-condition"]').waitFor({ state: 'visible' });
    await page.locator('button[name="btn-add-condition"]').click();
    await page.locator('input[name="int-selection"]').nth(2).fill('Luis');
    await page.locator('button[name="id-save-marcup"]').click();
    await expect(page.getByText(/grupo creado|success|éxito/i)).toBeVisible({ timeout: 10000 });
 });
});
