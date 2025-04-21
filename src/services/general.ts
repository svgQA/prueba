import { IPresignedRequest, IPresignedResponse } from '@/types/file';
import { IAppSetting } from '@/types/settings';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export interface IModuleRequest {
  id?: number;
  type: string;
  title: string;
  description: string;
  settings: any;
}
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

  static async setModule(data: IModuleRequest) {
    const model: IMakeRequest = {
      url: ['module'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IModuleRequest>(this.sname, model);
  }

  static async deleteModule(id: number) {
    const model: IMakeRequest = {
      url: ['module', id.toString()],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IModuleRequest>(this.sname, model);
  }

  static async getModules(type: string) {
    const model: IMakeRequest = {
      url: ['module'],
      params: { type: type },
    };
    return await super.make_request<IModuleRequest>(this.sname, model);
  }
}
