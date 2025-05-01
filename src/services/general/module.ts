import { IAppSetting, IShiftSetting } from '@/types/settings';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export interface IModuleRequest<T = any> {
  id?: number;
  type: string;
  title: string;
  description: string;
  settings: T;
}

export interface IModuleResponse<T = any> {
  id: number;
  type: string;
  title: string;
  description: string;
  settings: T;
}

export class ModuleService extends BaseService {
  static sname: VoxServices = 'module';
  static async getAppSetting() {
    const model: IMakeRequest = {
      url: ['module'],
      params: {
        type: 'APP',
      },
    };
    return await super.make_request<IModuleResponse<IAppSetting>>(
      this.sname,
      model
    );
  }

  static async getShiftSetting() {
    const model: IMakeRequest = {
      url: ['module'],
      params: { type: 'SHIFT' },
    };
    return await super.make_request<IModuleResponse<IShiftSetting>>(
      this.sname,
      model
    );
  }

  static async setAppSetting(data: IAppSetting) {
    const model: IMakeRequest = {
      url: ['module', 'app'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IModuleResponse<IAppSetting>>(
      this.sname,
      model
    );
  }

  static async setShiftSetting(data: IShiftSetting) {
    const model: IMakeRequest = {
      url: ['module', 'shift'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IModuleResponse<IShiftSetting>>(
      this.sname,
      model
    );
  }

  static async setModule(data: IModuleRequest) {
    const model: IMakeRequest = {
      url: ['module'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IModuleResponse>(this.sname, model);
  }

  static async deleteModule(id: number) {
    const model: IMakeRequest = {
      url: ['module', id.toString()],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IModuleResponse>(this.sname, model);
  }

  static async getModules(type: string) {
    const model: IMakeRequest = {
      url: ['module'],
      params: { type: type },
    };
    return await super.make_request<IModuleResponse>(this.sname, model);
  }

  static async getModuleById(id: number) {
    const model: IMakeRequest = {
      url: ['module', id.toString()],
    };
    return await super.make_request<IModuleResponse>(this.sname, model);
  }
}
