import { test, expect } from '@playwright/test';
import { login } from './utils'; 

test.describe('Profile & Settings', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('El modal de configuración se actualiza al cambiar de compañía', async ({ page }) => {

    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();

    await expect(page.getByRole('heading', { name: 'General' })).toBeVisible();

    await page.getByRole('button', { name: 'Ǉ' }).click();

    const companyMenuButton = page.getByRole('button', { name: /Company 2 222/i });
    await companyMenuButton.click();
    await page.getByTestId('opt-lang-3').click(); 
    await expect(page.getByRole('button', { name: /Company 3/i })).toBeVisible();

    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();

    await expect(page.getByText('Company 3')).toBeVisible(); 
  });
  
});