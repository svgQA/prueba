import { BaseService } from '@/utils/network';
import { IMakeRequest, VoxServices } from '@/utils/network/types';

export class ShiftService extends BaseService {
  static name: VoxServices = 'shift';
  static async get_shifts() {
    const model: IMakeRequest = {
      url: ['shift'],
    };
    return await super.make_request<any>(this.name, model);
  }
}
