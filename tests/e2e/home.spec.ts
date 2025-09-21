import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://dev.tryvoo.com';

/**
 * E2E test to ensure the Home page displays the expected marketing information.
 */
test.describe('Home page', () => {
  test('shows hero section with call to action', async ({ page }) => {
    await page.goto(baseURL);

    await expect(page.locator('h1')).toContainText(
      'Transform Operations Management With Tryvoo'
    );
    await expect(
      page.getByRole('button', { name: /Schedule a Free Demo/i })
    ).toBeVisible();
  });
});
