import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

import { IResourceRequest } from '@/types/memo/memo.request';
import { IResourceResponse } from '@/types/memo/memo.response';

export class ResourceService extends BaseService {
  static name: VoxServices = 'form';
  static async get_all() {
    const model: IMakeRequest = {
      url: ['resource'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResourceResponse>(this.name, model);
  }

  static async get_by_id(id: string) {
    const model: IMakeRequest = {
      url: ['resource', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResourceResponse>(this.name, model);
  }

  static async create(data: IResourceRequest) {
    const model: IMakeRequest = {
      url: ['resource'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IResourceRequest>(this.name, model);
  }

  static async update(id: number, data: IResourceRequest) {
    const model: IMakeRequest = {
      url: ['resource', id.toString()],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IResourceRequest>(this.name, model);
  }

  static async delete(id: number) {
    const model: IMakeRequest = {
      url: ['resource', id.toString()],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IResourceRequest>(this.name, model);
  }
}
