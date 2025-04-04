import { IPresignedRequest, IPresignedResponse } from '@/types/file';
import { IAppSetting } from '@/types/settings';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class GeneralService extends BaseService {
  static sname: VoxServices = 'file';
  static async presigned(data: IPresignedRequest) {
    const model: IMakeRequest = {
      url: ['file', 'presigned'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IPresignedResponse>(this.sname, model);
  }

  static async getAppSetting() {
    const model: IMakeRequest = {
      url: ['module', 'app'],
    };
    return await super.make_request<IAppSetting>(this.sname, model);
  }

  static async setAppSetting(data: IAppSetting) {
    const model: IMakeRequest = {
      url: ['module', 'app'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IAppSetting>(this.sname, model);
  }
}
