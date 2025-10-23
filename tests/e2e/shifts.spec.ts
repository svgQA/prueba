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

test.describe('Shifts', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);

    await page.waitForSelector('#sidebar-nav', { state: 'visible', timeout: 15000 });
    await page.waitForTimeout(1000); 
  });

  test('renders shifts summary and table controls', async ({ page }) => {
    const shiftsLink = page.getByRole('link', { name: translationRegex('t_shift') });
    await expect(shiftsLink).toBeVisible({ timeout: 10000 });
    await shiftsLink.click();
    
    await page.waitForURL(/.*shifts.*|.*turnos.*/i, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveTitle(/TY Turnos|TY Shifts/, { timeout: 10000 });

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

    const createButton = page.locator('button[name="button-create-shift"]').first();
    await expect(createButton).toBeVisible({ timeout: 10000 });
  });
      test('Create a new shift', async ({ page }) => {
      const shiftsLink = page.getByRole('link', { name: translationRegex('t_shift') });
      await expect(shiftsLink).toBeVisible({ timeout: 10000 });
      await shiftsLink.click();
      await page.waitForURL(/.*shifts.*|.*turnos.*/i, { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      const createButton = page.locator('button[name="button-create-shift"]').first();
      await expect(createButton).toBeVisible({ timeout: 10000 });
      await createButton.click();
      await expect(page.getByRole('heading', { name: /Crear|Create/i })).toBeVisible({ timeout: 10000 });
      await page.getByRole('textbox', { name: /Empleado|Employee/i }).click();
      await page.getByText('Juan Pablo Fernandez').last().click();
      await page.getByRole('textbox', { name: /Servicio|Service/i }).click();
      await page.getByText('PruebaServicio').last().click();
      await page.getByRole('textbox', { name: /Horario|Schedule/i }).click();
      await page.getByText('Turnos 24/7').click();
      await page.getByLabel(/Tipo|Type/i ).selectOption('EXTERNAL');
      await page.getByRole('textbox', { name: /Fecha de inicio|Start date/i }).fill('2025-10-22T12:14');
      await page.getByRole('textbox', { name: /Fecha de fin|End date/i }).fill('2025-10-23T12:14');
      await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).click();
      await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).fill('50');
      await page.getByRole('textbox', { name: /Palabras clave|Keywords/i }).click();
      await page.getByText('Prueba').last().click();
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: /save|guardar/i }).click();
      await page.waitForSelector('role=heading[name=/Crear|Create/i]', { state: 'hidden', timeout: 20000 });
      await page.waitForLoadState('networkidle');
      await expect(page.getByText(/creado con éxito|created successfully/i)).toBeVisible({ timeout: 20000 });
  });
      test('Edit an existing shift', async ({ page }) => {
      const shiftsLink = page.getByRole('link', { name: translationRegex('t_shift') });
      await expect(shiftsLink).toBeVisible({ timeout: 10000 });
      await shiftsLink.click();
      await page.waitForURL(/.*shifts.*|.*turnos.*/i, { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      const testRow = page.getByRole('row', { name: /Juan Pablo Fernandez/i }).first();
      await expect(testRow).toBeVisible();
      await page.getByRole('cell', { name: 'ˎ' }).locator('span').click();
      await page.getByRole('button', { name: 'Ƃ edit' }).click();
      await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).click();
      await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).fill('50');
      await page.waitForLoadState('networkidle');

      await page.getByRole('button', { name: /save|guardar/i }).click();
      await page.waitForSelector('role=heading[name=/Crear|Create/i]', { state: 'hidden', timeout: 20000 });
      await page.waitForLoadState('networkidle');
    }); 
      test('Delete an existing shift', async ({ page }) => {
      const shiftsLink = page.getByRole('link', { name: translationRegex('t_shift') });
      await expect(shiftsLink).toBeVisible({ timeout: 10000 });
      await shiftsLink.click();
      await page.waitForURL(/.*shifts.*|.*turnos.*/i, { timeout: 10000 });
      await page.waitForLoadState('networkidle');

      await page.getByRole('cell', { name: 'ˎ' }).locator('span').click();
      await page.getByRole('button', { name: 'ļ delete' }).click();
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: 'Confirmar' }).click();
      await expect(page.getByText(/Eliminado con éxito|deleted successfully/i)).toBeVisible({ timeout: 20000 });
      await page.waitForLoadState('networkidle');
  });
});
