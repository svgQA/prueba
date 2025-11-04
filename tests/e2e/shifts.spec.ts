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
  }); test.skip('renders shifts summary and table controls', async ({ page }) => {
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
  }); test.skip('Create Task Prerequisite 1', async ({ page }) => {
    try {
    test.setTimeout(120000); 
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
    await nombreInput.fill('PruebaClientePC');
    const emailInput = page.getByRole('textbox', { name: /Ingrese email...|Enter email.../i });
    await emailInput.fill('PCprueba@gmail.com');
    const telefonoInput = page.getByRole('textbox', { name: /Ingrese teléfono...|Enter phone number.../i });
    await telefonoInput.fill('3313173355');
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
    await page.getByRole('link', { name: /Rondas|Rounds/i }).click();
    await page.waitForURL(/.*rounds/); 
    await page.waitForLoadState('networkidle'); 
    await page.locator('[data-label="create"]').click();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
    await page.getByRole('textbox', { name: /Nombre|Name/i }).fill('PruebaRonda01');
    await page.waitForTimeout(500);
    await page.getByRole('textbox', { name: /Ingrese descripción|Enter description/i }).fill('PruebaRonda05');
    await page.waitForTimeout(500);
    await page.getByPlaceholder(/Ingrese radio|Enter radius/i ).fill('5');
    await page.waitForTimeout(500);
    await page.getByPlaceholder(/Ingrese frecuencia|Enter frequency/i ).fill('4');
    await page.waitForTimeout(500);
    await page.waitForSelector('input[placeholder="6.246631"]', { state: 'visible', timeout: 5000 });
    await page.getByPlaceholder('6.246631').click();
    await page.getByPlaceholder('6.246631').fill('4.661597770072802');
    await page.waitForSelector('input[placeholder="-75.581775"]', { state: 'visible', timeout: 5000 });
    await page.getByPlaceholder('-75.581775').click();
    await page.getByPlaceholder('-75.581775').fill('-74.11592502386705');
    await page.getByRole('button', { name: 'Į Añadir' }).click();
    await page.waitForTimeout(1000);
    await page.waitForSelector('text=Point 1', { timeout: 5000 });
    await page.waitForTimeout(1000);
    const closeButton = page.locator('button.maplibregl-popup-close-button');
    if (await closeButton.isVisible()) {
    await closeButton.click();
    await page.waitForTimeout(500);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /save|guardar/i }).click();
    await page.waitForTimeout(2000);
    await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 10000 });
    } catch (error) {
      await page.screenshot({ path: `test-results/ERROR-ROUNDS-SCREENSHOT.png`, fullPage: true });
      throw error;
    }
  }); test.skip('Create Place Prerequisite 2', async ({ page }) => {
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
    let descripcionFilled = false;
    try {
    const descripcionTextarea = page.locator('textarea[name="description"]');
      if (await descripcionTextarea.isVisible({ timeout: 2000 })) {
        await descripcionTextarea.click();
        await descripcionTextarea.fill('PruebaLugarDescripcion');
        descripcionFilled = true;
      }
    } catch {}
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
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: /save|guardar/i }).click();
    await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 15000 });
    } catch (error) {
    await page.screenshot({ path: `test-results/ERROR-PLACES-SCREENSHOT.png`, fullPage: true });
    throw error;
    }
    try {
    await page.getByRole('link', { name: /Contratos|Contracts/i }).click();
    await page.waitForURL(/.*projects|.*contracts/); 
    await page.waitForLoadState('networkidle');
    await page.locator('a[href="/dashboard/setting/shifts/projects/create"]').click();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
    const nombreInput = page.getByRole('textbox', { name: /Nombre|Name/i }); 
    await expect(nombreInput).toBeVisible({ timeout: 10000 });
    await nombreInput.fill('ContratoPrueba');
    const descripcionInput = page.locator('textarea[name="description"]');
    await expect(descripcionInput).toBeVisible({ timeout: 10000 });
    await descripcionInput.fill('ContratoPrueba01');
    const clientInput = page.getByRole('textbox', { name: /Seleccione cliente|Select client/i });
    await expect(clientInput).toBeVisible({ timeout: 10000 });
    const clientName = 'PruebaClientePC'; 
    await clientInput.fill(clientName);
    const clientOption = page.getByText(clientName, { exact: true });
    await expect(clientOption).toBeVisible({ timeout: 5000 }); 
    await clientOption.click(); 
    const prioridadSelect = page.locator('select[name="priority"]');
    await expect(prioridadSelect).toBeVisible({ timeout: 10000 });
    await prioridadSelect.selectOption('HIGH');
    const estadoSelect = page.locator('select[name="state"]');
    await expect(estadoSelect).toBeVisible({ timeout: 10000 });
    await estadoSelect.selectOption('IN_PROGRESS');
    const startDateInput = page.locator('input[name="input-startDate"]');
    await expect(startDateInput).toBeVisible({ timeout: 10000 });
    await startDateInput.fill('2025-11-01T11:15');
    const endDateInput = page.locator('input[name="input-endDate"]');
    await expect(endDateInput).toBeVisible({ timeout: 10000 });
    await endDateInput.fill('2025-11-02T11:16');
    await page.getByRole('button', { name: /save|guardar/i }).click();
    await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 15000 });
    } catch (error) {
    await page.screenshot({ path: `test-results/ERROR-CONTRACTS-SCREENSHOT.png`, fullPage: true });
    throw error;
    }
  }); test.skip('Create Task Prerequisite 3', async ({ page }) => {
    try {
    test.setTimeout(120000); 
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
    test.setTimeout(60000); 
    try { 
    await page.getByRole('link', { name: /Horarios|Schedules/i }).click();
    await page.waitForURL(/.*schedule/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.locator('#shift\\:schedules\\:state\\:create').click();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
    await page.locator('.general-cell').first().click(); 
    await page.locator('div:nth-child(11)').click();
    await page.locator('div:nth-child(12)').click();
    await page.locator('div:nth-child(13)').click();
    await page.locator('div:nth-child(14)').click();
    await page.locator('div:nth-child(15)').click();
    await page.locator('div:nth-child(16)').click();
    await page.locator('div:nth-child(17)').click();
    await page.locator('div:nth-child(18)').click();
    await page.locator('div:nth-child(19)').click();
    await page.locator('div:nth-child(20)').click();
    await page.locator('div:nth-child(21)').click();
    await page.locator('div:nth-child(22)').click();
    await page.locator('div:nth-child(23)').click();
    await page.locator('div:nth-child(24)').click();
    await page.locator('div:nth-child(25)').click();
    await page.locator('div:nth-child(26)').click();
    await page.locator('div:nth-child(27)').click();
    await page.locator('div:nth-child(28)').click();
    await page.locator('div:nth-child(29)').click();
    await page.locator('div:nth-child(30)').click();
    await page.locator('div:nth-child(31)').click();
    await page.locator('div:nth-child(32)').click();
    await page.locator('div:nth-child(33)').click();
    await page.locator('div:nth-child(34)').click();
    await page.locator('div:nth-child(35)').click();
    await page.locator('div:nth-child(36)').click();
    await page.locator('div:nth-child(37)').click();
    await page.locator('div:nth-child(38)').click();
    await page.locator('div:nth-child(39)').click();
    await page.locator('div:nth-child(40)').click();
    await page.locator('div:nth-child(41)').click();
    await page.locator('div:nth-child(42)').click();
    await page.locator('div:nth-child(43)').click();
    await page.locator('div:nth-child(44)').click();
    await page.locator('div:nth-child(45)').click();
    await page.locator('div:nth-child(46)').click();
    await page.locator('div:nth-child(47)').click();
    await page.locator('div:nth-child(48)').click();
    await page.locator('div:nth-child(49)').click();
    await page.locator('div:nth-child(50)').click();
    await page.locator('div:nth-child(51)').click();
    await page.locator('div:nth-child(52)').click();
    await page.locator('div:nth-child(53)').click();
    await page.locator('div:nth-child(54)').click();
    await page.locator('div:nth-child(55)').click();
    await page.locator('div:nth-child(56)').click();
    await page.locator('div:nth-child(57)').click();
    await page.locator('div:nth-child(58)').click();
    await page.locator('div:nth-child(59)').click();
    await page.locator('div:nth-child(60)').click();
    await page.locator('div:nth-child(61)').click();
    await page.locator('div:nth-child(62)').click();
    await page.locator('div:nth-child(63)').click();
    await page.locator('div:nth-child(64)').click();
    await page.locator('div:nth-child(65)').click();
    await page.locator('div:nth-child(66)').click();
    await page.locator('div:nth-child(67)').click();
    await page.locator('div:nth-child(68)').click();
    await page.locator('div:nth-child(69)').click();
    await page.locator('div:nth-child(70)').click();
    await page.locator('div:nth-child(71)').click();
    await page.locator('div:nth-child(72)').click();
    await page.locator('div:nth-child(73)').click();
    await page.locator('div:nth-child(74)').click();
    await page.locator('div:nth-child(75)').click();
    await page.locator('div:nth-child(76)').click();
    await page.locator('div:nth-child(77)').click();
    await page.locator('div:nth-child(78)').click();
    await page.locator('div:nth-child(79)').click();
    await page.locator('div:nth-child(80)').click();
    await page.locator('div:nth-child(81)').click();
    await page.locator('div:nth-child(82)').click();
    await page.locator('div:nth-child(83)').click();
    await page.locator('div:nth-child(84)').click();
    await page.locator('div:nth-child(85)').click();
    await page.locator('div:nth-child(86)').click();
    await page.locator('div:nth-child(87)').click();
    await page.locator('div:nth-child(88)').click();
    await page.locator('div:nth-child(89)').click();
    await page.locator('div:nth-child(90)').click();
    await page.locator('div:nth-child(91)').click();
    await page.locator('div:nth-child(92)').click();
    await page.locator('div:nth-child(93)').click();
    await page.locator('div:nth-child(94)').click();
    await page.locator('div:nth-child(95)').click();
    await page.locator('div:nth-child(96)').click();
    await page.locator('div:nth-child(97)').click();
    await page.locator('div:nth-child(98)').click();
    await page.locator('div:nth-child(99)').click();
    await page.locator('div:nth-child(100)').click();
    await page.locator('div:nth-child(101)').click();
    await page.locator('div:nth-child(102)').click();
    await page.locator('div:nth-child(103)').click();
    await page.locator('div:nth-child(104)').click();
    await page.locator('div:nth-child(105)').click();
    await page.locator('div:nth-child(106)').click();
    await page.locator('div:nth-child(107)').click();
    await page.locator('div:nth-child(108)').click();
    await page.locator('div:nth-child(109)').click();
    await page.locator('div:nth-child(110)').click();
    await page.locator('div:nth-child(111)').click();
    await page.locator('div:nth-child(112)').click();
    await page.locator('div:nth-child(113)').click();
    await page.locator('div:nth-child(114)').click();
    await page.locator('div:nth-child(115)').click();
    await page.locator('div:nth-child(116)').click();
    await page.locator('div:nth-child(117)').click();
    await page.locator('div:nth-child(118)').click();
    await page.locator('div:nth-child(119)').click();
    await page.locator('div:nth-child(120)').click();
    await page.locator('div:nth-child(121)').click();
    await page.locator('div:nth-child(122)').click();
    await page.locator('div:nth-child(123)').click();
    await page.locator('div:nth-child(124)').click();
    await page.locator('div:nth-child(125)').click();
    await page.locator('div:nth-child(126)').click();
    await page.locator('div:nth-child(127)').click();
    await page.locator('div:nth-child(128)').click();
    await page.locator('div:nth-child(129)').click();
    await page.locator('div:nth-child(130)').click();
    await page.locator('div:nth-child(131)').click();
    await page.locator('div:nth-child(132)').click();
    await page.locator('div:nth-child(133)').click();
    await page.locator('div:nth-child(134)').click();
    await page.locator('div:nth-child(135)').click();
    await page.locator('div:nth-child(136)').click();
    await page.locator('div:nth-child(137)').click();
    await page.locator('div:nth-child(138)').click();
    await page.locator('div:nth-child(139)').click();
    await page.locator('div:nth-child(140)').click();
    await page.locator('div:nth-child(141)').click();
    await page.locator('div:nth-child(142)').click();
    await page.locator('div:nth-child(143)').click();
    await page.locator('div:nth-child(144)').click();
    await page.locator('div:nth-child(145)').click();
    await page.locator('div:nth-child(146)').click();
    await page.locator('div:nth-child(147)').click();
    await page.locator('div:nth-child(148)').click();
    await page.locator('div:nth-child(149)').click();
    await page.locator('div:nth-child(150)').click();
    await page.locator('div:nth-child(151)').click();
    await page.locator('div:nth-child(152)').click();
    await page.locator('div:nth-child(153)').click();
    await page.locator('div:nth-child(154)').click();
    await page.locator('div:nth-child(155)').click();
    await page.locator('div:nth-child(156)').click();
    await page.locator('div:nth-child(157)').click();
    await page.locator('div:nth-child(158)').click();
    await page.locator('div:nth-child(159)').click();
    await page.locator('div:nth-child(160)').click();
    await page.locator('div:nth-child(161)').click();
    await page.locator('div:nth-child(162)').click();
    await page.locator('div:nth-child(163)').click();
    await page.locator('div:nth-child(164)').click();
    await page.locator('div:nth-child(165)').click();
    await page.locator('div:nth-child(166)').click();
    await page.locator('div:nth-child(167)').click();
    await page.locator('div:nth-child(168)').click();
    await page.locator('div:nth-child(169)').click();
    await page.locator('div:nth-child(170)').click();
    await page.locator('div:nth-child(171)').click();
    await page.locator('div:nth-child(172)').click();
    await page.locator('div:nth-child(173)').click();
    await page.locator('div:nth-child(174)').click();
    await page.locator('div:nth-child(175)').click();
    await page.locator('div:nth-child(176)').click();
    await page.locator('div:nth-child(177)').click();
    await page.locator('div:nth-child(178)').click();
    await page.locator('div:nth-child(179)').click();
    await page.locator('div:nth-child(180)').click();
    await page.locator('div:nth-child(181)').click();
    await page.locator('div:nth-child(182)').click();
    await page.locator('div:nth-child(183)').click();
    await page.locator('div:nth-child(184)').click();
    await page.locator('div:nth-child(185)').click();
    await page.locator('div:nth-child(186)').click();
    await page.locator('div:nth-child(187)').click();
    await page.locator('div:nth-child(188)').click();
    await page.locator('div:nth-child(189)').click();
    await page.locator('div:nth-child(190)').click();
    await page.locator('div:nth-child(191)').click();
    await page.locator('div:nth-child(192)').click();
    await page.locator('div:nth-child(193)').click();
    await page.locator('div:nth-child(194)').click();
    await page.locator('div:nth-child(195)').click();
    await page.locator('div:nth-child(196)').click();
    await page.locator('div:nth-child(197)').click();
    await page.locator('div:nth-child(198)').click();
    await page.locator('div:nth-child(199)').click();
    await page.locator('div:nth-child(200)').click();
    await page.locator('div:nth-child(201)').click();
    await page.locator('div:nth-child(202)').click();
    await page.locator('div:nth-child(203)').click();
    await page.locator('div:nth-child(204)').click();
    await page.locator('div:nth-child(205)').click();
    await page.locator('div:nth-child(206)').click();
    await page.locator('div:nth-child(207)').click();
    await page.locator('div:nth-child(208)').click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /Nombre|Name/i }).fill('HorarioPrueba2');
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /save|guardar/i }).click();
    await page.waitForTimeout(2000);
    } catch (error) {
    await page.screenshot({ path: `test-results/ERROR-SCHEDULE-SCREENSHOT.png`, fullPage: true });
    throw error;
    }
  }); test.skip('Create Role Prerequisite 4', async ({ page }) => {
    try {
    test.setTimeout(120000); 
    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();
    await page.getByRole('link', { name: 'š Services' }).click();
    await page.waitForURL(/.*service/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.locator('[data-label="create"]').click();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
    await page.getByRole('textbox', { name: /Nombre|Name/i }).fill('PruebaServicio2');
    await page.getByRole('textbox', { name: /Ingrese descripción|Enter description/i }).fill('Prueba Descripcion');
    await page.waitForLoadState('networkidle');
    await page.getByRole('textbox', { name: /Horario|Schedule/i }).click();
    const horarioOption = page.getByText('HorarioPrueba2').first();
    await expect(horarioOption).toBeVisible({ timeout: 10000 }); 
    await horarioOption.click();
    await page.waitForLoadState('networkidle');
    const lugarInput = page.locator('input[name="placeId"]');
    await expect(lugarInput).toBeVisible();
    await lugarInput.click();
    await lugarInput.fill('PruebaLugar01');
    const lugarOption = page.getByText('PruebaLugar01').first();
    await expect(lugarOption).toBeVisible({ timeout: 10000 });
    await lugarOption.click();
    await page.waitForLoadState('networkidle');
    const tareasInput = page.locator('input[name="select-task"]');
    await expect(tareasInput).toBeVisible({ timeout: 10000 });
    await tareasInput.click();
    await tareasInput.fill('Tareaprueba');
    const tareaOption = page.getByText('Tareaprueba', { exact: true });
    await expect(tareaOption).toBeVisible({ timeout: 10000 });
    await tareaOption.click();
    await page.waitForLoadState('networkidle');
    const contratoInput = page.locator('input[name="contractId"]');
    await expect(contratoInput).toBeVisible({ timeout: 10000 });
    await contratoInput.click();
    await contratoInput.fill('ContratoPrueba');
    const contratoOption = page.getByText('ContratoPrueba', { exact: true });
    await expect(contratoOption).toBeVisible({ timeout: 10000 });
    await contratoOption.click();
    await page.waitForLoadState('networkidle');
    const rondaInput = page.locator('input[name="roundId"]');
    await expect(rondaInput).toBeVisible({ timeout: 10000 });
    const roundName = 'PruebaRonda01'; 
    await rondaInput.click();
    await rondaInput.fill(roundName);
    const rondaOption = page.getByText(roundName); 
    await expect(rondaOption).toBeVisible({ timeout: 10000 });
    await rondaOption.click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Save|Guardar/i }).click();
    await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 10000 });
    } catch (error) {
    await page.screenshot({ path: `test-results/ERROR-SCHEDULE-SCREENSHOT.png`, fullPage: true });
    throw error;
    }
  }); test.skip('Create Role Prerequisite 5', async ({ page }) => {
    try {
    test.setTimeout(120000); 
    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();
    await page.getByRole('link', { name: /Roles/i }).click();
    await page.waitForURL(/.*roles/);
    await page.waitForLoadState('networkidle');
    const roleName = 'pruebarol';
    const roleLocator = page.getByRole('cell', { name: roleName, exact: true });
    const newRoleButton = page.locator('#user\\:roles\\:state\\:create');
    await expect(newRoleButton).toBeVisible({ timeout: 15000 });
    await newRoleButton.click();
    const nombreInput = page.getByRole('textbox', { name: /Nombre|Name/i });
    await expect(nombreInput).toBeVisible({ timeout: 10000 });
    await nombreInput.fill('pruebarol');
    const descripcionInput = page.getByRole('textbox', { name: /Descripción|Description/i });
    await expect(descripcionInput).toBeVisible();
    await descripcionInput.fill('rolprueba'); 
    await page.locator('#form-role div').filter({ hasText: /^PQRS$/ }).getByRole('checkbox').check();
    await page.locator('#form-role div').filter({ hasText: /^Notificaciones$/ }).getByRole('checkbox').check();
    await page.locator('#form-role div').filter({ hasText: /^Memos$/ }).getByRole('checkbox').check();
    await page.locator('#form-role div').filter({ hasText: /^Formularios$/ }).getByRole('checkbox').check();
    await page.locator('#form-role div').filter({ hasText: /^Correspondencia$/ }).getByRole('checkbox').check();
    const settingsCheckbox = page.locator('div').filter({ hasText: /^Configuración$/ }).getByRole('checkbox');
    await page.getByRole('button', { name: /save|guardar/i }).click(); 
    await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 15000 });
    await page.getByText(/Creado con éxito|Created successfully/i).click();
    } catch (error) {
    await page.screenshot({ path: `test-results/ERROR-ROLE-SCREENSHOT.png`, fullPage: true });
    throw error;
    }
    try {
    test.setTimeout(120000);
    await page.getByRole('button', { name: 'Ǉ' }).click();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
    await page.getByRole('link', { name: /Usuarios|Users/i }).click();
    await page.waitForURL(/.*users/);
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Į' }).click();
    const nombreInput = page.locator('input[name="name"]');
    await expect(nombreInput).toBeVisible({ timeout: 10000 });
    await nombreInput.fill('usuarioprueba1');
    await page.locator('input[name="surname"]').fill('PSdor'); 
    await page.locator('input[name="email"]').fill(`psc${Date.now()}@test.com`); 
    await page.locator('input[name="phone"]').fill('+573113172556');
    const docTypeSelect = page.locator('select[name="cardType"]');
    await expect(docTypeSelect).toBeVisible({ timeout: 10000 });
    await docTypeSelect.selectOption('1'); 
    const docNumberInput = page.locator('input[name="cardId"]');
    await expect(docNumberInput).toBeVisible();
    await docNumberInput.fill('1058547345'); 
    const countryInput = page.getByRole('textbox', { name: /Country|País/i });
    await expect(countryInput).toBeVisible();
    await countryInput.fill('colombia');
    await page.getByText('Colombia').click(); 
    await page.waitForLoadState('networkidle', { timeout: 10000 }); 
    const departmentInput = page.getByRole('textbox', { name: /Department|Departamento/i }); 
    await departmentInput.fill('cauca');
    await page.getByText('CAUCA', { exact: true }).click();
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    const municipalityInput = page.getByRole('textbox', { name: /Municipality|Municipio/i });
    await municipalityInput.fill('popay');
    await page.getByText('POPAYÁN').click();
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    await page.locator('input[name="address"]').fill('calle # 56 - 73');
    const userTypeSelect = page.locator('select[name="userType"]');
    await expect(userTypeSelect).toBeVisible();
    await userTypeSelect.selectOption('INTERNAL'); 
    const roleInput = page.locator('input[name="roles"]'); 
    await expect(roleInput).toBeVisible();
    await roleInput.click();
    await roleInput.fill('pruebarol'); 
    await page.getByText('pruebarol', { exact: true }).click()
    const companyInput = page.locator('input[name="companies"]'); 
    await expect(companyInput).toBeVisible();
    await companyInput.click();
    await companyInput.fill('Company 2');
    await page.getByText('Company 2').nth(1).click(); 
    await page.getByRole('button', { name: /Guardar|Save/i }).click();
    await expect(page.getByText(/Creado con éxito|Created successfully/i)).toBeVisible({ timeout: 15000 });
    } catch (error) {
    await page.screenshot({ path: `test-results/ERROR-USER-SCREENSHOT.png`, fullPage: true });
    throw error;
    }
  }); test('Create a new shift', async ({ page }) => {
    test.setTimeout(120000); 
    await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
    const createButton = page.locator('button[name="button-create-shift"]').first();
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();
    await expect(page.getByRole('heading', { name: /Crear|Create/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole('textbox', { name: /Empleado|Employee/i }).click();
    await page.getByText('usuarioprueba1 PSdor').last().click();
    await page.getByRole('textbox', { name: /Servicio|Service/i }).click();
    await page.getByText('PruebaServicio2').last().click();
    await page.getByRole('textbox', { name: /Horario|Schedule/i }).click();
    await page.getByText('HorarioPrueba2').last().click(); 
    await page.getByLabel(/Tipo|Type/i ).selectOption('EXTERNAL');
    await page.getByRole('textbox', { name: /Fecha de inicio|Start date/i }).fill('2025-11-06T17:00'); 
    await page.getByRole('textbox', { name: /Fecha de fin|End date/i }).fill('2025-11-07T21:00'); 
    await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).click();
    await page.getByRole('spinbutton', { name: /Tiempo Antes|Time Before/i }).fill('5');
    await page.getByRole('textbox', { name: /Palabras clave|Keywords/i }).click();
    await page.getByText('Prueba').last().click();
    await page.getByRole('button', { name: /save|guardar/i }).click();
    await page.waitForSelector('role=heading[name=/Crear|Create/i]', { state: 'hidden', timeout: 20000 });
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/creado con éxito|created successfully/i)).toBeVisible({ timeout: 20000 });
  }); test('Validate shift scheduler view toggles', async ({ page }) => {
    await page.evaluate(() => { (document.body.style as any).zoom = 0.8; }); 
    await page.getByRole('button', { name: '˂' }).click();
    await page.getByRole('cell', { name: 'usuarioprueba1 PSdor' }).locator('span').first().click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'ʣ' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByText('Prueba Descripcion').nth(1).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Ů' }).click();
    await page.getByRole('button', { name: 'Zoom in' }).dblclick();
    await page.getByRole('button', { name: 'Zoom in' }).click();
    await page.waitForURL(/.*shifts.*|.*turnos.*/i, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: /Notificaciones Supervisión|Remote Supervision/i }).click();
    await page.getByRole('row', { name: /usuarioprueba1 PSdor/i }).first().getByRole('checkbox').check();
    await page.getByRole('button', { name: /Notificaciones Supervisión|Remote Supervision/i }).click();
  }); test.skip('Edit an existing shift', async ({ page }) => {
    const testRow = page.getByRole('row')
    .filter({ hasText: /usuarioprueba1 PSdor/i })
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
  }); test.skip('Send a notification from Supervision panel', async ({ page }) => {
    const testRow = page.getByRole('row')
    .filter({ hasText: /usuarioprueba1 PSdor/i })
    .filter({ hasText: /Creado|Created/i })
    .first();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
    const notifButton = page.getByRole('button', { name: /Notificaciones Supervisión|Remote Supervision/i });
    await notifButton.click();
    const userRow = page.getByRole('row', { name: /usuarioprueba1 PSdor/i }).first();
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
  }); test.skip('Delete an existing shift', async ({ page }) => {
    const testRow = page.getByRole('row')
      .filter({ hasText: /usuarioprueba1 PSdor/i })
      .filter({ hasText: /Creado|Created/i })
      .first();
    await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });
    await page.locator('.vox-icon.vx-icon-options').first().click();
    await page.getByRole('button', { name: 'ļ delete' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Confirmar' }).click();
    await expect(page.getByText(/Eliminado con éxito|deleted successfully/i)).toBeVisible({ timeout: 20000 });
    await page.waitForLoadState('networkidle');
  }); test.skip('Guard mention pickers for shifts', async ({ page }) => {
  try {
    const createButton = page.locator('button[name="button-create-shift"]').first();
    await expect(createButton).toBeVisible({ timeout: 10000 });
    await createButton.click();
    const modalTitle = page.getByRole('heading', { name: /Crear|Create/i });
    await expect(modalTitle).toBeVisible({ timeout: 10000 });
    const employeeInput = page.getByRole('textbox', { name: /Empleado|Employee/i });
    await employeeInput.fill('usuarioprueba1 PSdor');
    const option = page.getByText('usuarioprueba1 PSdor').last();
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click(); 
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    const serviceInput = page.getByRole('textbox', { name: /Servicio|Service/i });
    await serviceInput.click();
    const firstServiceOption = page.getByText('PruebaServicio2').last(); 
    await expect(firstServiceOption).toBeVisible({ timeout: 5000 });
    await firstServiceOption.click();
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    await page.getByRole('button', { name: 'Ǉ' }).click(); 
    } catch (error) {
    await page.screenshot({ path: `test-results/ERROR-GUARD-PICKERS-SCREENSHOT.png`, fullPage: true });
    throw error;
    }
  });
});