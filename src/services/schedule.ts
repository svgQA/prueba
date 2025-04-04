import { BaseService } from '@/utils/network';
import { IMakeRequest, REQUEST_METHODS, VoxServices } from '@/utils/network/types';
import { IScheduleNotificationDto } from '@/types/notification/IScheduleNotificationDto';

export class SchedulerServiceFront extends BaseService {
  static name: VoxServices = 'notification';

  static async scheduleNotification(data: IScheduleNotificationDto) {
    const model: IMakeRequest = {
      url: ['scheduler'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getPendingToSend(currentDate: string) {
    const model: IMakeRequest = {
      url: ['scheduler', 'pending'],
      params: { date: currentDate },
    };
    return await super.make_request<any[]>(this.name, model);
  }

  static async markAsSent(id: string) {
    const model: IMakeRequest = {
      url: ['scheduler', 'mark-sent', id],
      method: REQUEST_METHODS.PACTH,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async markAsFailed(id: string) {
    const model: IMakeRequest = {
      url: ['scheduler', 'mark-failed', id],
      method: REQUEST_METHODS.PACTH,
    };
    return await super.make_request<any>(this.name, model);
  }
}
