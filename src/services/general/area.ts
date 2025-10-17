import { IOption } from '@/components/common/multi/interface';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
export class AreaService extends BaseService {
  static sname: VoxServices = 'shift';
  static async getAreaList(company: number) {
    const model: IMakeRequest = {
      url: ['area', 'simple', 'list', `${company}`],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.sname, model);
  }
}
