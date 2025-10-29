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
  test.skip('renders shifts summary and table controls', async ({ page }) => {
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
  test('Create Place Prerequisite', async ({ page }) => {
  try {
    test.setTimeout(120000); 
    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();
    await page.getByRole('link', { name: /Lugares|Places/i }).click();
    await page.waitForURL(/.*places/);
    await page.waitForLoadState('networkidle');
    const newPlaceButton = page.locator('#shift\\:places\\:state\\:create');
    await expect(newPlaceButton).toBeVisible({ timeout: 15000 });
    await newPlaceButton.click();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.8; });
    const codeInput = page.getByPlaceholder(/Enter code...|Ingrese código.../i);
    await expect(codeInput).toBeVisible({ timeout: 10000 });
    await codeInput.fill('1900');
    const nombreInput = page.getByRole('textbox', { name: /Nombre|Name/i });
    await expect(nombreInput).toBeVisible({ timeout: 10000 });
    await nombreInput.fill('PruebaLugar01');
    const addressInput = page.getByRole('textbox', { name: /Ingrese dirección\.\.\.|Enter address\.\.\./i });
    await expect(addressInput).toBeVisible({ timeout: 10000 });
    await addressInput.click();
    await addressInput.fill('Calle # 56 - 43');
    const countryInput = page.locator('input[name="countryId"]');
    await expect(countryInput).toBeVisible({ timeout: 10000 });
    await countryInput.click();
    await countryInput.fill('colombia');
    await page.getByText('Colombia', { exact: false }).click();
    await page.waitForTimeout(800);
    const departmentInput = page.locator('input[name="departmentId"]');
    await expect(departmentInput).toBeVisible({ timeout: 10000 });
    await departmentInput.click();
    await departmentInput.fill('cauca');
    await page.getByText('CAUCA', { exact: true }).click();
    await page.waitForTimeout(800);
    const municipalityInput = page.getByRole('textbox', { name: /Seleccione municipio\.\.\.|Select municipality\.\.\./i });
    await expect(municipalityInput).toBeVisible({ timeout: 10000 });
    await municipalityInput.click();
    await municipalityInput.fill('popay');
    await page.getByText('POPAYÁN').click();
    const locationTypeSelect = page.getByLabel(/Estado|Location type/i).first();
    await expect(locationTypeSelect).toBeVisible({ timeout: 10000 });
    await locationTypeSelect.selectOption('INDUSTRIAL');
    const statusSelect = page.locator('select[name="state"]');
    await expect(statusSelect).toBeVisible({ timeout: 10000 });
    await statusSelect.selectOption('ACTIVE');
    const zipInput = page.getByPlaceholder(/Ingrese código ZIP\.\.\.|Enter zip code\.\.\./i);
    await expect(zipInput).toBeVisible({ timeout: 10000 });
    await zipInput.click();
    await zipInput.fill('19001');
    const radiusSlider = page.getByRole('slider');
    await expect(radiusSlider).toBeVisible({ timeout: 10000 });
    await radiusSlider.fill('126');
    await page.getByRole('button', { name: /save|guardar/i }).click();
    await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 15000 });
  } catch (error) {
    await page.screenshot({ path: `test-results/ERROR-PLACES-SCREENSHOT.png`, fullPage: true });
    throw error;
  }
    });
        test.skip('Create Task Prerequisite 2', async ({ page }) => {
        try {
        test.setTimeout(60000); 
        await page.getByRole('button', { name: 'Ʌ' }).click();
        await page.locator('#setting-dropdown-element').click();
        await page.getByRole('link', { name: /Clientes|Clients/i }).click();
        await page.waitForURL(/.*clients/); 
        await page.waitForLoadState('networkidle'); 
        const newClientButton = page.locator('#trybook\\:notices\\:state\\:create');
        await expect(newClientButton).toBeVisible({ timeout: 15000 });
        await newClientButton.click();
        const nombreInput = page.getByRole('textbox', { name: /Nombre Email Teléfono|Name Email Phone/i });
        await expect(nombreInput).toBeVisible({ timeout: 10000 }); 
        await nombreInput.fill('NuevoclientePrueba');
        const emailInput = page.getByRole('textbox', { name: /Ingrese email...|Enter email.../i });
        await emailInput.fill('Clientedy596665r@gmail.com');
        const telefonoInput = page.getByRole('textbox', { name: /Ingrese teléfono...|Enter phone number.../i });
        await telefonoInput.fill('31124567');
        const descripcionInput = page.getByRole('textbox', { name: /Ingrese Descripción...|Enter Description.../i });
        await descripcionInput.fill('PruebaCliente');
        await page.getByRole('button', { name: /Guardar|Save/i }).click();
        await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 15000 });
        } catch (error) {
        await page.screenshot({ path: `test-results/ERROR-CLIENT-SCREENSHOT.png`, fullPage: true });
        throw error;
        }
        try {
        test.setTimeout(60000); 
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
      });
        test.skip('Create Task Prerequisite 3', async ({ page }) => {
        test.setTimeout(60000); 
         try { 
        await page.getByRole('button', { name: 'Ʌ' }).click();
        await page.locator('#setting-dropdown-element').click();
        await page.getByRole('link', { name: /Horarios|Schedules/i }).click();
        await page.waitForURL(/.*schedule/, { timeout: 15000 });
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
        await page.waitForTimeout(2000);
        } catch (error) {
        await page.screenshot({ path: `test-results/ERROR-SCHEDULE-SCREENSHOT.png`, fullPage: true });
        throw error;
      }
        try { 
        await page.getByRole('link', { name: 'š Services' }).click();
        await page.waitForURL(/.*service/, { timeout: 15000 });
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        try {
        await page.getByRole('button', { name: /nuevo|new|create|añadir|add/i }).click({ timeout: 5000 });
        } catch {
        await page.waitForSelector('#shift\\:services\\:state\\:create', { 
        state: 'visible', 
        timeout: 10000 
      });
        await page.locator('#shift\\:services\\:state\\:create').click();
      }
        await page.waitForSelector('input[name*="nombre"], input[name*="name"]', { 
        state: 'visible',
        timeout: 10000  
    });
        await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
        await page.getByRole('textbox', { name: /Nombre|Name/i }).fill('PruebaServicio2');
        await page.waitForTimeout(500);
        await page.getByRole('textbox', { name: /Ingrese descripción|Enter description/i }).fill('Prueba Descripcion');
        await page.waitForTimeout(500);
        await page.getByRole('textbox', { name: /Horario|Schedule/i }).click();
        await page.waitForSelector('text=HorarioPrueba2', { state: 'visible' });
        await page.getByText('HorarioPrueba2').first().click();
        await page.waitForTimeout(500);
        await page.getByRole('textbox', { name: /Tareas|Tasks/i }).click(); 
        await page.waitForSelector('text=Tareaprueba', { state: 'visible' });
        await page.getByText('Tareaprueba').first().click(); 
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: /save|guardar/i }).click();
        await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 10000 });
        } catch (error) {
        await page.screenshot({ path: `test-results/ERROR-SERVICE-SCREENSHOT.png`, fullPage: true });
        throw error;
    }
      });
        test.skip('Create a new shift', async ({ page }) => {
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
        test.skip('Validate shift scheduler view toggles', async ({ page }) => {
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
        test.skip('Edit an existing shift', async ({ page }) => {
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
        test.skip('Send a notification from Supervision panel', async ({ page }) => {
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
      test.skip('Delete an existing shift', async ({ page }) => {
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
      test.skip('Guard mention pickers for shifts', async ({ page }) => {
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