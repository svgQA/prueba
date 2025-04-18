import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

import {
  INotificationHistoryItem,
  INotificationHistoryByScheduled,
} from '@/types/notification/INotificationTypes';
import { GenericResponse } from '@/utils/network/utils/rest-factory';

export class NotificationHistoryServiceFront extends BaseService {
  static name: VoxServices = 'notification';

  /**
   * Obtener historial de notificaciones de un usuario
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
    const res = new GenericResponse<INotificationHistoryItem>({ code: 200, message: 'Success', data: raw });
    return res.getMany();
  }

  /**
   * Obtener historial de una notificación programada
   */
  static async getByScheduledNotification(
    scheduledNotificationId: string
  ): Promise<INotificationHistoryByScheduled[]> {
    const model: IMakeRequest = {
      url: ['notifications', 'history', 'scheduled', scheduledNotificationId],
      method: REQUEST_METHODS.GET,
    };

    const raw = await super.make_request(this.name, model);
    const res = new GenericResponse<INotificationHistoryByScheduled>({ code: 200, message: 'Success', data: raw });
    return res.getMany();
  }

  /**
   * Marcar como leída una notificación
   */
  static async markAsRead(
    userId: number,
    scheduledNotificationId: string
  ): Promise<void> {
    const model: IMakeRequest = {
      url: ['notifications', 'history', userId.toString(), scheduledNotificationId, 'read'],
      method: REQUEST_METHODS.PACTH,
    };

    await super.make_request(this.name, model);
  }
}
