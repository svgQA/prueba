import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class PanicService extends BaseService {
  static name: VoxServices = 'memo';

  static async get_all_panic() {
    const model: IMakeRequest = {
      url: ['panic', 'panic-all'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async changeStatusPanic(id: string) {
    const model: IMakeRequest = {
      url: ['panic','panic-change-status', id],
      method: REQUEST_METHODS.POST,
    };
    return await super.make_request(this.name, model);
  }

  static async get_all_panic_by_user(id: string) {
    const model: IMakeRequest = {
      url: ['panic', 'panic-all-by-user', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }
}
