import { REQUEST_METHODS, VoxServices } from '@/utils/network/types';
import { ICScheduleRequest } from '@/types/shift/shift.request';
import { IMakeRequest } from '@/utils/network/types';
import { BaseService } from '@/utils/network';
import { IPagination } from '@/types';

export class ScheduleService extends BaseService {
  static name: VoxServices = 'shift';

  static async createSchedule(data: ICScheduleRequest) {
    const model: IMakeRequest = {
      url: ['schedule'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateSchedule(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['schedule', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteSchedule(id: string) {
    const model: IMakeRequest = {
      url: ['schedule', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getSchedules(params: IPagination = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['schedule'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getScheduleById(id: string) {
    const model: IMakeRequest = {
      url: ['schedule', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<ICScheduleRequest>(this.name, model);
  }
}
