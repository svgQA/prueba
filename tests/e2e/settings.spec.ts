import { test, expect } from '@playwright/test';
import { login, appUrl, ensureDashboardLoaded, translationRegex } from './utils';

const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe('Profile & settings', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

test('opens settings modal from user menu', async ({ page }) => {
    await page.getByRole('button', { name: 'Ʌ' }).click();

    await page.locator('#setting-dropdown-element').click();

    const modal = page.locator('#setting-modal');
    await expect(modal).toBeVisible();
    await expect(modal.locator('#user-information')).toBeVisible();
    await expect(
      modal
        .locator('button')
        .filter({ has: page.locator('.vx-icon-080') })
        .first()
    ).toBeVisible();
    await expect(modal.locator('button[name="setting-close"]')).toBeVisible();
  });


  test('The settings modal updates when changing companies', async ({ page }) => {

    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();
    await expect(page.locator('#setting-modal')).toBeVisible();

    await page.getByRole('button', { name: 'Ǉ' }).click();
    const companyMenuButton = page.getByRole('button', { name: /Company 2 222/i });
    await companyMenuButton.click();
    await page.getByTestId('opt-lang-3').click(); 
    await expect(page.getByRole('button', { name: /Company 3/i })).toBeVisible();

    await page.getByRole('button', { name: 'Ʌ' }).click();
    await page.locator('#setting-dropdown-element').click();
    await expect(page.locator('#setting-modal')).toBeVisible();

    await expect(page.getByText('Company 3')).toBeVisible(); 
  });

});
