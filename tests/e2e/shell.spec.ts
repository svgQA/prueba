import { test, expect } from '@playwright/test';
import { login,
  appUrl,
  ensureDashboardLoaded,
  translationRegex,} from './utils';

test.describe('Main Interface (Shell) Experience', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    }); test.skip('change company and the selection persists when reloading', async ({ page }) => {
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
    });
});