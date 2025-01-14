import { IPagination } from '@/types';
import { IUserRequest, IUserResponse } from '@/types/auth';
import { BaseService } from '@/utils/network';

import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class UserService extends BaseService {
  static sname: VoxServices = 'user';
  static async create(data: IUserRequest) {
    const model: IMakeRequest = {
      url: ['user'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IUserResponse>(this.sname, model);
  }

  static async profile() {
    const model: IMakeRequest = {
      url: ['user', 'profile'],
    };
    return await super.make_request<IUserResponse>(this.sname, model);
  }

  static async update(data: IUserRequest, id: number) {
    const model: IMakeRequest = {
      url: ['user', String(id)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IUserResponse>(this.sname, model);
  }

  static async get_all(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['user'],
      params: params as any,
    };
    return await super.make_request<IUserResponse>(this.sname, model);
  }
}
