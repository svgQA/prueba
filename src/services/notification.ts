import { ISendManualNotificationDto } from '@/types/notification/ISendManualNotificationDto';
import { IMakeRequest, REQUEST_METHODS } from '@/utils/network/types';
import { BaseService } from '@/utils/network';
import { VoxServices } from '@/utils/network/types';

export class NotificationServiceFront extends BaseService {
  static name: VoxServices = 'notification';

  static async sendManualNotification(data: ISendManualNotificationDto) {
    const model: IMakeRequest = {
      url: ['notifications', 'send'], // ✅ endpoint correcto
      method: REQUEST_METHODS.POST,
      data, // ✅ puede incluir: templateId, overrideTitle, overrideDescription, filters, data
    };

    return await super.make_request<any>(this.name, model);
  }
}
