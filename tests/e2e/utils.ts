import { test, expect, Page } from '@playwright/test';

const baseURL = 'http://localhost:3050'; 

export async function login(page: Page) {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  if (!email || !password) {
    throw new Error('Las variables E2E_EMAIL y E2E_PASSWORD deben estar configuradas');
  }

  await page.goto(baseURL, { timeout: 60000 }); 

  const signInButton = page.getByRole('link', { name: 'Sign In' });
  await expect(signInButton).toBeVisible({ timeout: 15000 });
  await signInButton.click();

  const emailInput = page.locator('input[name="email"], input[name="username"]').first();
  await expect(emailInput).toBeVisible({ timeout: 15000 });

  await emailInput.fill(email);
  await page.locator('input[name="password"]').fill(password);

  await page.locator('button[type="submit"]').click();

  await expect(page.getByRole('link', { name: 'Memos' })).toBeVisible({timeout: 15000});
}

export const appUrl = baseURL;