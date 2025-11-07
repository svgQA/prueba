import { test, expect } from '@playwright/test';
import { login } from './utils';

test.describe('Main Interface (Shell) Experience', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });
  test('change company and the selection persists when reloading', async ({ page }) => {
    const initialCompanyButton = page.getByRole('button', { name: /Company 2 222/i });
    await expect(initialCompanyButton).toBeVisible();
    await initialCompanyButton.click();
    await page.getByTestId('opt-lang-3').click();
    const newCompanyButton = page.getByRole('button', { name: /Company 3/i });
    await expect(newCompanyButton).toBeVisible();
    await page.reload();
    await expect(newCompanyButton).toBeVisible({ timeout: 10000 });
  });

  test('Theme preference persists on page reload', async ({ page }) => {

    const body = page.locator('body');

    await expect(body).not.toHaveClass('dark');

    await page.getByRole('button', { name: 'ȴ' }).click();

    await expect(body).toHaveClass('dark');

    await page.reload();

    await expect(body).toHaveClass('dark', { timeout: 10000 });
  });
  
});