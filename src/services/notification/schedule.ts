import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';

export class SchedulerService extends BaseService {
  static name: VoxServices = 'notification';

  /**
   * Crear una notificación programada
   */
  static async scheduleNotification(data: any) {
    const model: IMakeRequest = {
      url: ['notifications', 'schedule'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  /**
   * Obtener todas las notificaciones programadas (por estado opcional)
   */
  static async getAll(status?: string) {
    const model: IMakeRequest = {
      url: ['notifications', 'scheduled'],
      params: status ? { status } : undefined,
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<INotificationScheduledItem>(
      this.name,
      model
    );
  }

  /**
   * Obtener una notificación programada por ID
   */
  static async getById(id: string) {
    const model: IMakeRequest = {
      url: ['notifications', 'scheduled', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  /**
   * Actualizar una notificación programada
   */
  static async updateScheduledNotification(id: string, data: Partial<any>) {
    const model: IMakeRequest = {
      url: ['notifications', 'scheduled', id],
      method: REQUEST_METHODS.PACTH,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  /**
   * Eliminar una notificación programada (hard delete)
   */
  static async deleteScheduledNotification(id: string) {
    const model: IMakeRequest = {
      url: ['notifications', 'scheduled', id, 'hard'],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<any>(this.name, model);
  }

  /**
   * Obtener notificaciones pendientes de enviar hasta la fecha indicada
   */
  static async getPendingToSend(currentDate: string) {
    const model: IMakeRequest = {
      url: ['notifications', 'scheduled'],
      params: { date: currentDate, status: 'pending' },
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any[]>(this.name, model);
  }

  /**
   * Marcar una notificación como enviada
   */
  static async markAsSent(id: string) {
    const model: IMakeRequest = {
      url: ['notifications', 'mark-sent', id],
      method: REQUEST_METHODS.PACTH,
    };
    return await super.make_request<any>(this.name, model);
  }

  /**
   * Marcar una notificación como fallida
   */
  static async markAsFailed(id: string) {
    const model: IMakeRequest = {
      url: ['notifications', 'mark-failed', id],
      method: REQUEST_METHODS.PACTH,
    };
    return await super.make_request<any>(this.name, model);
  }
}
