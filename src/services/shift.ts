import { IMakeRequest } from './utils/interface';
import { BaseService } from './utils/service';

export class ShiftService extends BaseService {
  static async get_shifts() {
    const model: IMakeRequest = {
      url: ['shift'],
    };
    return await super.make_request<any>(this, model);
  }
}
