import {
  IAppSetting,
  IGeneralSetting,
  IMemoSetting,
  INotificationSetting,
  IShiftSetting,
  IUserSetting,
} from '@/types/settings';
import { BaseService } from '@/utils/network';
import { VoxServices } from '@/utils/network/types';

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
  // APP
  static async getAppSetting() {
    return await this.getSetting<IAppSetting>('app');
  }
  static async setAppSetting(data: IAppSetting, id: number) {
    return await this.setSetting<IAppSetting>('app', data, id);
  }

  // USER
  static async getUserSetting() {
    return await this.getSetting<IUserSetting>('user');
  }
  static async setUserSetting(data: IUserSetting, id: number) {
    return await this.setSetting<IUserSetting>('user', data, id);
  }

  // SHIFT
  static async getShiftSetting() {
    return await this.getSetting<IShiftSetting>('shift');
  }
  static async setShiftSetting(data: IShiftSetting, id: number) {
    return await this.setSetting<IShiftSetting>('shift', data, id);
  }

  // GENERAL
  static async getGeneralSetting() {
    return await this.getSetting<IGeneralSetting>('general');
  }
  static async setGeneralSetting(data: IGeneralSetting, id: number) {
    return await this.setSetting<IGeneralSetting>('general', data, id);
  }

  // MEMO
  static async getMemoSetting() {
    return await this.getSetting<IMemoSetting>('memo');
  }
  static async setMemoSetting(data: IMemoSetting, id: number) {
    return await this.setSetting<IMemoSetting>('memo', data, id);
  }

  // NOTIFICATION
  static async getNotificationSetting() {
    return await this.getSetting<INotificationSetting>('notification');
  }
  static async setNotificationSetting(data: INotificationSetting, id: number) {
    return await this.setSetting<INotificationSetting>(
      'notification',
      data,
      id
    );
  }

  /*
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
  */
}
