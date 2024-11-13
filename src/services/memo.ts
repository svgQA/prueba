import { BaseService } from '@/utils/network';
import { IMakeRequest, VoxServices } from '@/utils/network/types';

export class MemoService extends BaseService {
  static name: VoxServices = 'memo';
  static async get_all() {
    const model: IMakeRequest = {
      url: ['memos'],
    };
    return await super.make_request<any>(this.name, model);
  }
}
