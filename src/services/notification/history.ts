import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { GenericResponse } from '@/utils/network/utils/rest-factory';

import {
  INotificationHistoryItem,
  INotificationHistoryByScheduled,
  INotificationDashboardData,
  INotificationListItem,
} from '@/types/notification/INotificationTypes';

export class NotificationHistoryService extends BaseService {
  static name: VoxServices = 'notification';

  /**
   * 📋 Obtener historial de notificaciones de un usuario
   */
  static async getByUser(
    userId: number,
    status: 'read' | 'unread' | 'all' = 'all'
  ): Promise<INotificationHistoryItem[]> {
    const model: IMakeRequest = {
      url: ['notifications', 'history', userId.toString()],
      params: { status },
      method: REQUEST_METHODS.GET,
    };

    const raw = await super.make_request(this.name, model);
    const res = new GenericResponse<INotificationHistoryItem>({
      code: 200,
      message: 'Success',
      data: raw,
    });
    return res.getMany();
  }

  /**
   * 📄 Obtener historial de una notificación programada
   */
  static async getByScheduledNotification(
    scheduledNotificationId: string
  ): Promise<INotificationHistoryByScheduled[]> {
    const model: IMakeRequest = {
      url: ['notifications', 'history', 'scheduled', scheduledNotificationId],
      method: REQUEST_METHODS.GET,
    };

    const raw = await super.make_request(this.name, model);
    const res = new GenericResponse<INotificationHistoryByScheduled>({
      code: 200,
      message: 'Success',
      data: raw,
    });
    return res.getMany();
  }

  /**
   * ✅ Marcar notificación como leída
   */
  static async markAsRead(
    userId: number,
    scheduledNotificationId: string
  ): Promise<void> {
    const model: IMakeRequest = {
      url: [
        'notifications',
        'history',
        userId.toString(),
        scheduledNotificationId,
        'read',
      ],
      method: REQUEST_METHODS.PACTH,
    };

    await super.make_request(this.name, model);
  }

  /**
   * 📊 Obtener datos para dashboard (cards superiores)
   */
  static async getDashboardData(): Promise<INotificationDashboardData> {
    const model: IMakeRequest = {
      url: ['notifications', 'dashboard'],
      method: REQUEST_METHODS.GET,
    };

    const res = await super.make_request<INotificationDashboardData>(
      this.name,
      model
    );

    return res.getOne();
  }

  /**
   * 🗂 Obtener listado completo de notificaciones enviadas
   */
  static async getNotificationList(): Promise<INotificationListItem[]> {
    const model: IMakeRequest = {
      url: ['notifications', 'list'],
      method: REQUEST_METHODS.GET,
    };

    const raw = await super.make_request(this.name, model);
    const res = new GenericResponse<INotificationListItem>({
      code: 200,
      message: 'Success',
      data: raw,
    });
    return res.getMany();
  }

  /**
   * 🚀 Ejecutar manualmente el cron para revisar notificaciones
   */
  static async runSchedulerTask(): Promise<void> {
    const model: IMakeRequest = {
      url: ['notifications', 'scheduled', 'run'],
      method: REQUEST_METHODS.POST,
    };

    await super.make_request(this.name, model);
  }
}
