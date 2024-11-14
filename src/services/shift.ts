import { BaseService } from '@/utils/network';
import { IMakeRequest, VoxServices } from '@/utils/network/types';

export class ShiftService extends BaseService {
  static name: VoxServices = 'shift';
  static async get_all() {
    const model: IMakeRequest = {
      url: ['shifts'],
    };
    return await super.make_request<any>(this.name, model);
  }
}
