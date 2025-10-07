import { test, expect } from '@playwright/test';
import { login, appUrl } from './utils';

const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe('Sidebar navigation', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  const links = [
    { label: /Memos|Memorandums/i, path: '/dashboard' },
    { label: /Turnos|Shift/i, path: '/dashboard/shifts' },
    { label: /Formulario|Form/i, path: '/dashboard/forms' },
    { label: /Accesos|Access/i, path: '/dashboard/access' },
    { label: /Correspondencia|Correspondence/i, path: '/dashboard/correspondence' },
    { label: /Usuarios|User/i, path: '/dashboard/users' },
    { label: /Notificaciones|Notifications/i, path: '/dashboard/history' },
  ];

  for (const { label, path } of links) {
    test(`can navigate to ${path}`, async ({ page }) => {
      await page.getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    });
  }
});
