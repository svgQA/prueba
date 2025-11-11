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
  }); test.skip('create smart group', async ({ page }) => {
    test.setTimeout(120000);
    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();
    await page.getByRole('link', { name: /groups/i }).click();
    await page.waitForLoadState('networkidle');
    const newRoleButton = page.locator('[data-to="/setting/security/groups/create"]');
    await expect(newRoleButton).toBeVisible({ timeout: 15000 });
    await newRoleButton.click();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.8; });
    await page.locator('input[name="Nombre"]').fill('GrupoIP');
    await page.locator('textarea[name="Nombre"]').fill('GrupoInteligentePrueba');
    await page.waitForTimeout(1000);
    const conditionButton = page.getByRole('button', { name: /condition/i });
    await expect(conditionButton).toBeVisible({ timeout: 10000 });
    await conditionButton.click();
    await page.waitForTimeout(500);
    await page.locator('button[name="field"]').first().waitFor({ state: 'visible' });
    await page.locator('input[name="int-selection"]').first().fill('Andres');
    await conditionButton.click();
    await page.waitForTimeout(500);
    const secondFieldButton = page.locator('button[name="field"]').nth(1);
    await secondFieldButton.waitFor({ state: 'visible' });
    await secondFieldButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await secondFieldButton.click();
    await page.waitForTimeout(800);
    for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1);
    }
    const aliasOption = page.getByRole('listitem').filter({ hasText: 'alias' });
    await aliasOption.click({ force: true, timeout: 5000 });
    const secondInput = page.locator('input[name="int-selection"]').nth(1);
    await secondInput.waitFor({ state: 'visible', timeout: 5000 });
    await secondInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await secondInput.fill('Lopez');
    const groupButton = page.getByRole('button', { name: /group/i });
    await groupButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await groupButton.click();
    await page.waitForTimeout(500);
    for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1);
    } 
    const groupBtn = page.getByRole('button', { name: /group|grupo/i }).nth(0);
    const conditionSibling = groupBtn.locator('xpath=preceding-sibling::button[1]');
    await conditionSibling.waitFor({ state: 'visible' });
    await conditionSibling.click();
    await page.locator('input[name="int-selection"]').nth(2).fill('Luis');
    await page.getByRole('button', { name: /crear|create/i }).click();
    await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 15000 });
  }); test('create new forms', async ({ page }) => {
    test.setTimeout(120000);
    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();
    const formsLink = page.locator('[data-to="/setting/forms"]');
    await page.evaluate(() => { (document.body.style as any).zoom = 0.8; });
    await formsLink.scrollIntoViewIfNeeded();
    await formsLink.waitFor({ state: 'visible', timeout: 5000 });
    await formsLink.click();
    const newRoleButton = page.locator('[data-to="/setting/forms/create"]');
    await expect(newRoleButton).toBeVisible({ timeout: 15000 });
    await newRoleButton.click(); 
    await page.locator('input[id$="-format-title-input"]').fill('PruebaForms');
    await page.locator('[id$="-format-description-input"]').fill('PruebaDescripForms');
    await page.getByPlaceholder('Select one or more smart groups').click();
    await page.getByText('GrupoIP').click();
    await page.locator('input[id$="-page-title-input"]').fill('PruebaFormulario');
    await page.locator('input[id$="-element-title-input"]').fill('pruebaformularioTST');
    await page.locator('input[id$="-element-title-input"]').click();
    await page.getByRole('button', { name: 'element' }).click();
    await page.getByPlaceholder('Enter element title').nth(1).fill('PruebaTiempo');
    const elementRow = page.getByRole('row', { name: /PruebaTiempo/i });    
    for (let i = 0; i < 10; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1);
    }
    const answerTypeDropdown = elementRow.locator('select[id$="-element-type-select"]');
    await page.waitForLoadState('networkidle');
    await answerTypeDropdown.selectOption({ label: 'Time' });
    await page.getByRole('button', { name: /crear|create/i }).click();
  });
});
