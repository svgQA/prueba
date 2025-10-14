import { test, expect } from '@playwright/test';
import {
  login,
  ensureDashboardLoaded,
  expectSummaryCard,
  expectTableHeaders,
  translationRegex,
} from './utils';

const credsProvided = !!(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);

test.describe('Sidebar navigation', () => {
  test.skip(!credsProvided, 'E2E_EMAIL and E2E_PASSWORD must be set');

  test.beforeEach(async ({ page }) => {
    await login(page);
    await ensureDashboardLoaded(page);
  });

  const routes = [
    {
      labelKey: 't_memo',
      path: '/dashboard',
      summaryKeys: ['h_memos_total', 'h_memos_unresolved', 'h_memos_resolved'],
      headerKeys: ['h_user', 'h_description', 'h_status', 'h_priority'],
    },
    {
      labelKey: 't_shift',
      path: '/dashboard/shifts',
      summaryKeys: ['h_shifts_total', 'h_shifts_in_progress', 'h_shifts_completed'],
      headerKeys: [
        'h_user',
        'h_service',
        'h_contract',
        'h_date',
        'h_start',
        'h_end',
        'h_status',
        'h_duration',
      ],
    },
    {
      labelKey: 't_inspect',
      path: '/dashboard/forms',
      summaryKeys: ['h_forms_total', 'h_forms_active', 'h_forms_archived'],
      headerKeys: ['h_user', 'h_title', 'h_created', 'h_updated', 'h_status'],
    },
    {
      labelKey: 't_access',
      path: '/dashboard/access',
      summaryKeys: [
        'h_accessess_total',
        'h_accessess_in_progress',
        'h_accessess_completed',
      ],
      headerKeys: [
        'h_resident',
        'h_visit',
        'h_entry_type',
        'h_house_number',
        'h_status',
      ],
    },
    {
      labelKey: 't_inbox',
      path: '/dashboard/correspondence',
      summaryKeys: [
        'h_correspondence_total',
        'h_correspondence_in_progress',
        'h_correspondence_completed',
      ],
      headerKeys: [
        'h_sender',
        'h_owner',
        'h_house_number',
        'h_package_type',
        'h_status',
      ],
    },
    {
      labelKey: 't_user',
      path: '/dashboard/users',
      summaryKeys: [
        'l_total_users',
        'l_active_connection',
        'l_inactive_connection',
      ],
      headerKeys: [
        'h_user',
        'h_identification',
        'h_email',
        'h_company',
        'h_department',
      ],
    },
    {
      labelKey: 't_notification',
      path: '/dashboard/history',
      summaryKeys: [
        'history.cards.notificationShifts',
        'history.cards.openRate',
        'history.cards.monthlyNotifications',
      ],
      headerKeys: [
        'h_title',
        'h_description',
        'h_type',
        'h_sent_date',
        'h_recipient',
        'h_open_rate',
      ],
    },
  ] as const;

  for (const { labelKey, path, summaryKeys, headerKeys } of routes) {
    test(`can navigate to ${path}`, async ({ page }) => {
      const link = page
        .getByRole('link', { name: translationRegex(labelKey) })
        .first();
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${path}(?:$|\?)`));

      for (const summaryKey of summaryKeys) {
        await expectSummaryCard(page, summaryKey);
      }

      await expectTableHeaders(page, headerKeys);

      await expect(link).toHaveClass(/(?:bg-primary-opacity|dark:bg-blue-900\/50)/);
    });
  }
});
