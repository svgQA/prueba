import { test, expect } from '@playwright/test';
import { login, translationRegex } from './utils';

test.describe('User Menu', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Log out successfully', async ({ page }) => {
    await page.getByRole('button', { name: 'Ʌ' }).click();

    await page.getByText(translationRegex('logout')).click();

    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible({ timeout: 10000 });
  });
  
});