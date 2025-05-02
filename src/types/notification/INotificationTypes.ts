export interface INotificationHistoryItem {
  id: string;
  userId: number;
  type: 'manual' | 'scheduled';
  hasViewed: boolean;
  viewedAt: string | null;
  sentAt: string;
  scheduledNotificationId: string | null;
  title: string;
  description: string;
  attachmentUrl: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface INotificationHistoryByScheduled {
  id: string;
  userId: number;
  scheduledNotificationId: string;
  hasViewed: boolean;
  viewedAt: string | null;
  sentAt: string;
  createdAt?: string;
  updatedAt?: string;
  user: {
    id: number;
    name: string;
    email: string;
    status?: 'active' | 'inactive';
  };
}

/**
 * 📊 Datos para el dashboard de notificaciones
 */
export interface INotificationDashboardData {
  totalNotifications: number;
  openRate: number; // porcentaje 0-100
  notificationsOfMonth: number;
}

/**
 * 🗂 Estructura para el listado general de notificaciones enviadas
 */
export interface INotificationListItem {
  id: string;
  title: string;
  description: string;
  type: string; // Ej: "Usuarios", "Programada", "Manual"
  sentAt: string;
  recipients: number; // Número de destinatarios
  openRate: number; // porcentaje 0-100
}
