import { test, expect } from '@playwright/test';
import { login } from './utils'; 

test.describe('Access management', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('El usuario puede navegar a la sección de Accesos', async ({ page }) => {
    await page.getByRole('link', { name: /Accesos|Access/i }).click();

    await expect(page).toHaveURL(/.*access/);

    await expect(page).toHaveTitle(/TY Acceso|TY Access/);
  });
});