import { expect, Page } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'https://dev.tryvoo.com';

const translationMap: Record<string, string[]> = {
  h_memos_total: ['Memorandos Totales Hoy', 'Total Memos Today'],
  h_memos_unresolved: ['Memorandos sin resolver', 'Unresolved Memos'],
  h_memos_resolved: ['Memorandos Resueltos', 'Resolved Memos'],
  h_forms_total: ['Total Formularios', 'Total Forms'],
  h_forms_active: ['Formularios Activos', 'Active Forms'],
  h_forms_archived: ['Formularios Archivados', 'Archived Forms'],
  h_shifts_total: ['Turnos Totales Hoy', 'Total Shifts Today'],
  h_shifts_in_progress: ['Turnos En Progreso', 'Shifts In Progress'],
  h_shifts_completed: ['Turnos Completados', 'Completed Shifts'],
  h_accessess_total: ['Visitas Mensuales', 'Monthly Visits'],
  h_accessess_in_progress: ['Vehículos que ingresaron', 'Vehicles Entered'],
  h_accessess_completed: [
    'Vehículos que ingresaron y salieron',
    'Vehicles Exited',
  ],
  h_correspondence_total: ['Total Correspondencias', 'Total Correspondences'],
  h_correspondence_in_progress: [
    'Correspondencias No Entregadas',
    'Correspondences Not Delivered',
  ],
  h_correspondence_completed: [
    'Correspondencias Entregadas',
    'Correspondences Delivered',
  ],
  h_user: ['Usuario', 'User'],
  h_description: ['Descripción', 'Description'],
  h_status: ['Estado', 'Status'],
  h_priority: ['Prioridad', 'Priority'],
  h_novelty: ['Novedad', 'Novelty'],
  h_history: ['Historial', 'History'],
  h_title: ['Título', 'Title'],
  h_created: ['Creado', 'Created'],
  h_updated: ['Actualizado', 'Updated'],
  h_identification: ['Identificador', 'Identifier'],
  h_email: ['Correo electrónico', 'Email'],
  h_company: ['Empresa', 'Company'],
  h_department: ['Departamento', 'Department'],
  h_city: ['Ciudad', 'City'],
  h_connection: ['Conexión', 'Connection'],
  h_progress: ['Progreso', 'Progress'],
  h_service: ['Servicio', 'Service'],
  h_contract: ['Contrato', 'Contract'],
  h_date: ['Fecha', 'Date'],
  h_start: ['Inicio', 'Start'],
  h_end: ['Fin', 'End'],
  h_duration: ['Duración (Min)', 'Duration (Min)'],
  h_report: ['Reporte', 'Report'],
  h_resident: ['Residente', 'Resident'],
  h_visit: ['Visitante', 'Visitor'],
  h_entry_type: ['Ingreso', 'Entry Type'],
  h_house_number: ['Número de casa', 'House Number'],
  h_observation: ['Observación', 'Observation'],
  h_signature: ['Firma', 'Signature'],
  h_plate: ['Placa', 'Plate'],
  h_check_in: ['Registro de entrada', 'Check-in'],
  h_check_out: ['Registro de salida', 'Check-out'],
  h_sender: ['Remitente', 'Sender'],
  h_owner: ['Propietario', 'Owner'],
  h_place: ['Lugar', 'Place'],
  h_who_picked_up: ['Quién recogió', 'Who picked up'],
  h_package_type: ['Tipo de paquete', 'Package type'],
  h_message_to_owner: ['Mensaje al propietario', 'Message to owner'],
  h_received: ['Hora recibido', 'Received time'],
  h_type: ['Tipo', 'Type'],
  h_sent_date: ['Fecha de envío', 'Sent Date'],
  h_recipient: ['Destinatario', 'Recipients'],
  h_open_rate: ['Tasa de apertura', 'Open Rate'],
  l_total_users: ['Total de Usuarios', 'Total Users'],
  l_registered: ['Registrados', 'Registered'],
  l_active_connection: ['Conexión Activa', 'Active Connection'],
  l_connected_users: ['Usuarios conectados', 'Connected Users'],
  l_inactive_connection: ['Conexión Inactiva', 'Inactive Connection'],
  l_disconnected_users: ['Usuarios desconectados', 'Disconnected Users'],
  'history.cards.notificationShifts': [
    'Notificaciones de turnos',
    'Notification Shifts',
  ],
  'history.cards.openRate': ['Tasa de apertura', 'Open Rate'],
  'history.cards.monthlyNotifications': [
    'Notificaciones mensuales',
    'Monthly Notifications',
  ],
  t_memo: ['Memos'],
  t_shift: ['Turnos', 'Shift'],
  t_inspect: ['Formulario', 'Form'],
  t_access: ['Accesos', 'Access'],
  t_inbox: ['Correspondencia', 'Correspondence'],
  t_user: ['Usuarios', 'User'],
  t_notification: ['Notificaciones', 'Notifications'],
  t_setting: ['Configuración', 'Settings'],
  p_general_search: ['Buscar', 'Search'],
};

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const translationRegex = (key: string) => {
  const values = translationMap[key];
  if (!values || values.length === 0) {
    return new RegExp(escapeRegExp(key), 'i');
  }
  const pattern = values.map(escapeRegExp).join('|');
  return new RegExp(`^(?:${pattern})$`, 'i');
};

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
  await ensureDashboardLoaded(page);
}

export const appUrl = baseURL;

export async function ensureDashboardLoaded(page: Page) {
  await page.waitForURL(/\/dashboard/);
  await expect(page.locator('#sidebar-nav')).toBeVisible();
  await expect(
    page.locator('header').locator('button').filter({ has: page.locator('.vx-icon-080') })
  ).toBeVisible();
  await expect(page.locator('button[name="user"]')).toBeVisible();
}

export async function expectSummaryCard(page: Page, titleKey: string) {
  const heading = page
    .getByRole('heading', { level: 3 })
    .filter({ hasText: translationRegex(titleKey) })
    .first();
  await expect(heading).toBeVisible();
}

export async function expectTableHeaders(page: Page, headerKeys: string[]) {
  for (const key of headerKeys) {
    const header = page
      .locator('table thead th')
      .filter({ hasText: translationRegex(key) })
      .first();
    await expect(header, `Expected table header for ${key}`).toBeVisible();
  }
}

export async function openSearchInput(page: Page) {
  const searchInput = page
    .getByPlaceholder(translationRegex('p_general_search'))
    .first();
  await expect(searchInput).toBeVisible();
  return searchInput;
}
