import { ISendManualNotificationDto } from '@/types/notification/ISendManualNotificationDto';
import { IMakeRequest, REQUEST_METHODS } from '@/utils/network/types';
import { BaseService } from '@/utils/network';
import { VoxServices } from '@/utils/network/types';

export class NotificationService extends BaseService {
  static name: VoxServices = 'notification';

  static async sendManualNotification(data: ISendManualNotificationDto) {
    const model: IMakeRequest = {
      url: ['notifications', 'send'],
      method: REQUEST_METHODS.POST,
      data,
    };

    return await super.make_request<any>(this.name, model);
  }

  // ✅ Nuevo método: verificar si hay usuarios con playerId
  static async hasUsersWithPlayerId() {
    const model: IMakeRequest = {
      url: ['notifications', 'has-player-users'],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<{ hasUsers: boolean }>(this.name, model);
  }
}
