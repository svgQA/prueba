import { test, expect } from '@playwright/test';
import { login,
  appUrl,
  ensureDashboardLoaded,
  translationRegex,} from './utils';

test.describe('Main Interface (Shell) Experience', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    });test.skip('change company and the selection persists when reloading', async ({ page }) => {
      const initialCompanyButton = page.getByRole('button', { name: /Company 2 222/i });
      await expect(initialCompanyButton).toBeVisible();
      await initialCompanyButton.click();
      await page.getByTestId('opt-lang-3').click();
      const newCompanyButton = page.getByRole('button', { name: /Company 3/i });
      await expect(newCompanyButton).toBeVisible();
      await page.reload();
      await expect(newCompanyButton).toBeVisible({ timeout: 10000 });
    });test.skip('Theme preference persists on page reload', async ({ page }) => {
      const body = page.locator('body');
      await expect(body).not.toHaveClass('dark');
      await page.getByRole('button', { name: 'ȴ' }).click();
      await expect(body).toHaveClass('dark');
      await page.reload();
      await expect(body).toHaveClass('dark', { timeout: 10000 });
    });test.skip('Verify locale switching across modules', async ({ page }) => {
      const shiftsLink = page.getByRole('link', { name: translationRegex('t_shift') });
      await expect(shiftsLink.getByText('Shifts')).toBeVisible({ timeout: 10000 });
      await page.evaluate(() => { (document.body.style as any).zoom = 0.7; });  
      const languageButton = page.getByRole('button', { name: /English|Español/i });
      await languageButton.click();
      await page.getByTestId('opt-lang-es').click();
      await page.waitForLoadState('networkidle'); 
      await expect(shiftsLink.getByText('Shifts')).not.toBeVisible();
      await expect(shiftsLink.getByText('Turnos')).toBeVisible({ timeout: 10000 });
      const memosLink = page.getByRole('link', { name: translationRegex('t_memo') });
      await Promise.all([
        page.waitForLoadState('networkidle'),
        memosLink.click()
      ]);
      await expect(page.getByRole('heading', { name: 'Memorandos Totales Hoy' })).toBeVisible({ timeout: 10000 });
      await page.getByRole('button', { name: /Español/i }).click();
      await page.getByTestId('opt-lang-en').click();
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: 'Total Memos Today' })).toBeVisible({ timeout: 10000 });
    });test.skip('Validate user dropdown actions (Settings modal and Log out)', async ({ page }) => {
    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.waitForTimeout(300);
    await page.locator('#setting-dropdown-element').click();
    await page.waitForTimeout(500);
    const settingElement = page.getByRole('button', { name: 'Ǉ' });
    await expect(settingElement).toBeVisible();
    await settingElement.click();
    await page.waitForTimeout(300);
    await expect(page.getByRole('button', { name: 'Ʌ' })).toBeVisible();
    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.waitForTimeout(300);
    const logoutOption = page.getByText('logout');
    await expect(logoutOption).toBeVisible();
    await logoutOption.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: /Iniciar sesión|Sign In/i })).toBeVisible({ timeout: 10000 });
    });test.skip('Guard tenant-scoped settings modals (Tasks page)', async ({ page }) => {
    await page.getByRole('button', { name: /Company 2 222/i }).click(); 
    await page.getByTestId('opt-lang-2').click(); 
    await page.waitForLoadState('networkidle'); 
    await page.getByRole('button', { name: 'English' }).click();
    await page.getByTestId('opt-lang-es').click();
    await page.click('#undefined-dropdown-button');
    await page.locator('#setting-dropdown-element').click();
    await page.getByRole('link', { name: /Roles/i }).click();
    await page.waitForURL(/.*roles/);
    await page.waitForLoadState('networkidle');
    const tareaCompañiaA = page.getByRole('cell', { name: 'pruebarol' });
    const tareaCompañiaB = page.getByRole('cell', { name: 'Rol operador' });
    await expect(tareaCompañiaA).toBeVisible({ timeout: 10000 });
    await expect(tareaCompañiaB).not.toBeVisible();
    await page.getByRole('button', { name: 'Ǉ' }).click();
    const currentCompanyButton = page.getByRole('button', { name: /Company/i }).first();
    await currentCompanyButton.click();
    const company3Option = page.getByRole('button', { name: 'Company 3', exact: true });
    await company3Option.click();
    await expect(currentCompanyButton).toContainText('Company 3', { timeout: 5000 });
    await currentCompanyButton.click();
    await page.getByTestId('opt-lang-3').click();
    await page.getByRole('button', { name: 'Español' }).click();
    await page.getByTestId('opt-lang-en').click();
    await page.waitForLoadState('networkidle');
    await page.click('#undefined-dropdown-button');
    await page.locator('#setting-dropdown-element').click();
    await page.getByRole('link', { name: /Roles/i }).click();
    await page.waitForURL(/.*roles/);
    await page.waitForLoadState('networkidle');
    await expect(tareaCompañiaA).not.toBeVisible();
    await expect(tareaCompañiaB).toBeVisible({ timeout: 10000 });
   });
});