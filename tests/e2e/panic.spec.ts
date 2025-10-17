import { test, expect } from '@playwright/test';
import { login } from './utils';

test.describe('Funcionalidad de Pánico', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('El modal de pánico se abre al hacer clic en el atajo global', async ({ page }) => {

    await page.getByRole('button', { name: 'ě' }).click();

    await expect(page.getByRole('heading', { name: 'Alerta de pánico' })).toBeVisible();
  });
  
});