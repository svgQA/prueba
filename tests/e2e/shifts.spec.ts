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

    const shiftsLink = page.getByRole('link', { name: translationRegex('t_shift') });  
    await expect(shiftsLink).toBeVisible({ timeout: 15000 });
    await shiftsLink.click();

    await page.waitForURL(/.*shifts.*|.*turnos.*/i, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test('renders shifts summary and table controls', async ({ page }) => {
    const shiftsLink = page.getByRole('link', { name: translationRegex('t_shift') });
    await page.waitForLoadState('networkidle');
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
      test('Create Task Prerequisite', async ({ page }) => {
        try {
        await page.getByRole('button', { name: 'Ʌ' }).click();
        await page.locator('#setting-dropdown-element').click();
        await page.getByRole('link', { name: /Tareas|Tasks/i }).click();
        const taskSection = page.locator('div').filter({ hasText: /Tareas|Tasks/i }).nth(4); 
        const newTaskButton = page.locator('#shift\\:tasks\\:state\\:create');
        await expect(newTaskButton).toBeVisible({ timeout: 20000 });
        await newTaskButton.click(); 
        await page.getByRole('textbox', { name: /Nombre|Name/i }).fill('Tareaprueba');
        await page.getByRole('textbox', { name: /Seleccione|Select/i }).click();
        await page.getByText('General').nth(1).click();
        await page.getByRole('textbox', { name: /Hora|Time/i }).fill('12:00');
        await page.getByRole('textbox', { name: /Descripción|Description/i }).fill('TareaDescripcionPrueba');
        await page.getByRole('button', { name: /save|guardar/i }).click();
        await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 15000 });
        } catch (error) {
        await page.screenshot({ path: `test-results/ERROR-TASK-SCREENSHOT.png`, fullPage: true });
        throw error;
      }
        try { 
        await page.getByRole('link', { name: /Horarios|Schedules/i }).click();
        await page.waitForURL(/.*schedule/, { timeout: 15000 });
        const scheduleSection = page.locator('div').filter({ hasText: /Horarios|Schedules/i }).nth(4);
        await page.waitForLoadState('networkidle');
        await page.locator('#shift\\:schedules\\:state\\:create').click();
        await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
        await page.locator('.general-cell').first().click(); 
        await page.locator('div:nth-child(18)').click(); 
        await page.locator('div:nth-child(26)').click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('textbox', { name: /Nombre|Name/i }).fill('HorarioPrueba2');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /save|guardar/i }).click();
        await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible();
      } catch (error) {
        await page.screenshot({ path: `test-results/ERROR-SCHEDULE-SCREENSHOT.png`, fullPage: true });
        throw error;
      }
        await page.getByRole('link', { name: /Servicios|Services/i }).click();
        await page.waitForURL(/.*service/);
        await page.waitForLoadState('networkidle');
        await page.getByRole('link', { name: /Nuevo|New/i }).click();
        await page.getByRole('textbox', { name: /Nombre|Name/i }).fill('PruebaServicio2');
        await page.getByRole('textbox', { name: /Ingrese descripción|Enter description/i }).fill('Prueba Descripcion');
        await page.getByRole('textbox', { name: /Horario|Schedule/i }).click();
        await page.getByText('HorarioPrueba2').first().click();
        await page.getByRole('textbox', { name: /Tareas|Tasks/i }).click(); 
        await page.getByText('Tareaprueba').first().click(); 
        await page.getByRole('button', { name: /save|guardar/i }).click();
        await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible();
    });
        test('Create a new shift', async ({ page }) => {
        await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
        const createButton = page.locator('button[name="button-create-shift"]').first();
        await expect(createButton).toBeVisible({ timeout: 10000 });
        await createButton.click();
        await expect(page.getByRole('heading', { name: /Crear|Create/i })).toBeVisible({ timeout: 10000 });
        await page.getByRole('textbox', { name: /Empleado|Employee/i }).click();
        await page.getByText('Juan Pablo Fernandez').last().click();
        await page.getByRole('textbox', { name: /Servicio|Service/i }).click();
        await page.getByText('PruebaServicio2').last().click();
        await page.getByRole('textbox', { name: /Horario|Schedule/i }).click();
        await page.getByText('HorarioPrueba2').last().click(); 
        await page.getByLabel(/Tipo|Type/i ).selectOption('EXTERNAL');
        await page.getByRole('textbox', { name: /Fecha de inicio|Start date/i }).fill('2025-10-29T10:24');
        await page.getByRole('textbox', { name: /Fecha de fin|End date/i }).fill('2025-10-30T10:24');
        await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).click();
        await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).fill('5');
        await page.getByRole('textbox', { name: /Palabras clave|Keywords/i }).click();
        await page.getByText('Prueba').last().click();
        await page.getByRole('textbox', { name: /Tareas|Tasks/i }).click(); 
        await page.getByText('Tareaprueba').last().click(); 
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /save|guardar/i }).click();
        await page.waitForSelector('role=heading[name=/Crear|Create/i]', { state: 'hidden', timeout: 20000 });
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/creado con éxito|created successfully/i)).toBeVisible({ timeout: 20000 });
  });
        test('Validate shift scheduler view toggles', async ({ page }) => {
        await page.evaluate(() => { (document.body.style as any).zoom = 0.8; }); 
        await page.getByRole('button', { name: '˂' }).click();
        await page.getByRole('cell', { name: 'Juan Pablo Fernandez' }).locator('span').first().click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'ʣ' }).click();
        await page.waitForLoadState('networkidle');
        await page.getByText('Prueba LA PUTA').nth(1).click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Ů' }).click();
        await page.getByRole('button', { name: 'Zoom in' }).dblclick();
        await page.getByRole('button', { name: 'Zoom in' }).click();
        await page.waitForURL(/.*shifts.*|.*turnos.*/i, { timeout: 10000 });
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /Notificaciones Supervisión|Remote Supervision/i }).click();
        await page.getByRole('row', { name: /Juan Pablo/i }).first().getByRole('checkbox').check();
        await page.getByRole('button', { name: /Notificaciones Supervisión|Remote Supervision/i }).click();
  });
        test('Edit an existing shift', async ({ page }) => {
        const testRow = page.getByRole('row')
        .filter({ hasText: /Juan Pablo Fernandez/i })
        .filter({ hasText: /Creado|Created/i })
        .first();
        await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });        
        await expect(testRow).toBeVisible();
        await testRow.getByRole('cell', { name: 'ˎ' }).locator('span').click();
        await page.getByRole('button', { name: 'Ƃ edit' }).click();
        await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).click();
        await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).fill('50');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /save|guardar/i }).click();
        await page.waitForSelector('role=heading[name=/Crear|Create/i]', { state: 'hidden', timeout: 20000 });
        await page.waitForLoadState('networkidle');
  }); 
      test('Send a notification from Supervision panel', async ({ page }) => {
      const testRow = page.getByRole('row')
        .filter({ hasText: /Juan Pablo Fernandez/i })
        .filter({ hasText: /Creado|Created/i })
        .first();
      await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
      const notifButton = page.getByRole('button', { name: /Notificaciones Supervisión|Remote Supervision/i });
      await notifButton.click();
      const userRow = page.getByRole('row', { name: /Juan Pablo Fernandez/i }).first();
      await expect(userRow).toBeVisible({ timeout: 15000 });
      const checkbox = userRow.getByRole('checkbox');
      await expect(checkbox).toBeEnabled(); 
      await checkbox.check();
      await notifButton.click(); 
      const titleInput = page.getByRole('textbox', { name: /Título personalizado|Custom Title/i });
      await expect(titleInput).toBeVisible({ timeout: 15000 });
      await titleInput.fill('Prueba01');
      const descTextarea = page.locator('textarea[name="input-custom-description"]');
      await descTextarea.fill('pruebadescripcion');
      const sendButton = page.getByRole('button', { name: /Enviar notificación|Send Notification/i });
      await sendButton.scrollIntoViewIfNeeded();
      await sendButton.click();   
      await expect(page.getByText(/Enviado con éxito|Sent successfully/i)).toBeVisible({ timeout: 20000 });
  }); 
      test('Delete an existing shift', async ({ page }) => {
      const testRow = page.getByRole('row')
        .filter({ hasText: /Juan Pablo Fernandez/i })
        .filter({ hasText: /Creado|Created/i })
        .first();
      await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
      await page.locator('.vox-icon.vx-icon-options').first().click();
      await page.getByRole('button', { name: 'ļ delete' }).click();
      await page.waitForLoadState('networkidle');
      await page.getByRole('button', { name: 'Confirmar' }).click();
      await expect(page.getByText(/Eliminado con éxito|deleted successfully/i)).toBeVisible({ timeout: 20000 });
      await page.waitForLoadState('networkidle');
  });
      test('Guard mention pickers for shifts', async ({ page }) => {
      const createButton = page.locator('button[name="button-create-shift"]').first();
      await expect(createButton).toBeVisible({ timeout: 10000 });
      await createButton.click();
      await expect(page.getByRole('heading', { name: /Crear|Create/i })).toBeVisible({ timeout: 10000 });
      const employeeInput = page.getByRole('textbox', { name: /Empleado|Employee/i });
      await employeeInput.fill('Juan Pablo Fernandez');
      const option = page.getByText('Juan Pablo Fernandez').last();
      await expect(option).toBeVisible();
      await option.click();
      const serviceInput = page.getByRole('textbox', { name: /Servicio|Service/i });
      await serviceInput.click();
      const firstServiceOption = page.getByText('PruebaServicio').last(); 
      await expect(firstServiceOption).toBeVisible({ timeout: 5000 });
      await firstServiceOption.click();
    });
  });