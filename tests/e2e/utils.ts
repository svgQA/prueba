import { Page } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://dev.tryvoo.com';

export async function login(page: Page) {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  if (!email || !password) {
    throw new Error('E2E_EMAIL and E2E_PASSWORD must be set');
  }

  await page.goto(baseURL);
  await page.locator('input[name="email"], input[name="username"]').first().fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
}

export const appUrl = baseURL;
