import { IOption } from '@/components/common/multi/interface';
import { IPagination } from '@/types';
import { IUserAreaRequest } from '@/types/user/user.request';
import { IUserAreaResponse } from '@/types/user/user.response';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
export class AreaService extends BaseService {
  static sname: VoxServices = 'user';

  static async get_all(params: IPagination = { page: 1, items: 1000 }) {
    const model: IMakeRequest = {
      url: ['area'],
      params: params as any,
    };
    return await super.make_request<IUserAreaResponse>(this.sname, model);
  }

  static async get_one(id: string) {
    const model: IMakeRequest = {
      url: ['area', id],
    };
    return await super.make_request<IUserAreaResponse>(this.sname, model);
  }

  static async create(data: IUserAreaRequest) {
    const model: IMakeRequest = {
      url: ['area'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.sname, model);
  }

  static async update(id: string, data: IUserAreaRequest) {
    const model: IMakeRequest = {
      url: ['area', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.sname, model);
  }

  static async delete(id: number) {
    const model: IMakeRequest = {
      url: ['area', `${id}`],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<any>(this.sname, model);
  }

  static async get_simple_List() {
    const model: IMakeRequest = {
      url: ['area', 'simple', 'list'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.sname, model);
  }

  static async get_simple_List_children() {
    const model: IMakeRequest = {
      url: ['area', 'simple', 'list', 'children'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.sname, model);
  }
}
