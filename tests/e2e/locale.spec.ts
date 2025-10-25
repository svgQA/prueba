import { test, expect } from '@playwright/test';
import { login } from './utils';

test.describe('Language Change (Locale Switching)', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('The interface translates correctly', async ({ page }) => {

    const languageButton = page.getByRole('button', { name: /Español|English/i });
    const currentLanguage = await languageButton.textContent();
    if (!currentLanguage?.includes('Español')) {
      await languageButton.click();
      await page.getByTestId('opt-lang-es').click();
    }
    
    await expect(page.getByText('Memorandos Totales Hoy')).toBeVisible();

    await page.getByRole('button', { name: /Español/i }).click();
    await page.getByTestId('opt-lang-en').click();
    await expect(page.getByRole('button', { name: /English/i })).toBeVisible();

    await expect(page.getByText('Total Memos Today')).toBeVisible();

    await page.getByRole('link', { name: 'Shift' }).click(); 
    await expect(page).toHaveURL(/.*shifts/);
    await expect(page.getByText('Total Shifts Today')).toBeVisible();

    await page.getByRole('link', { name: 'Form' }).click();
    await expect(page).toHaveURL(/.*forms/);
    await expect(page.getByText('Total Forms')).toBeVisible();
  });
  
});