import { test, expect } from '@playwright/test';
import { login } from './utils';

test.describe('Experiencia de la Interfaz Principal (Shell)', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });
  test('El usuario puede cambiar de compañía y la selección persiste al recargar', async ({ page }) => {
    const initialCompanyButton = page.getByRole('button', { name: /Company 2 222/i });
    await expect(initialCompanyButton).toBeVisible();
    await initialCompanyButton.click();
    await page.getByTestId('opt-lang-3').click();
    const newCompanyButton = page.getByRole('button', { name: /Company 3/i });
    await expect(newCompanyButton).toBeVisible();
    await page.reload();
    await expect(newCompanyButton).toBeVisible({ timeout: 10000 });
  });

  test('La preferencia de tema persiste al recargar la página', async ({ page }) => {

    const body = page.locator('body');

    await expect(body).not.toHaveClass('dark');

    await page.getByRole('button', { name: 'ȴ' }).click();

    await expect(body).toHaveClass('dark');

    await page.reload();

    await expect(body).toHaveClass('dark', { timeout: 10000 });
  });
  
});