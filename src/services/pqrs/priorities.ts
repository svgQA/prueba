import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

import { ICPrioritiesResponse } from '@/pages/settings/pqrs/priority/utils/interface';

export class PrioritiesService extends BaseService {
  static name: VoxServices = 'pqrs';

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['priorities'],
      params: params as any,
    };
    return await super.make_request<ICPrioritiesResponse>(this.name, model);
  }

  static async get_by_id(id: string) {
    const model: IMakeRequest = {
      url: ['priorities', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<ICPrioritiesResponse>(this.name, model);
  }

  static async create(data: ICPrioritiesResponse) {
    const model: IMakeRequest = {
      url: ['priorities'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async update(id: string, data: ICPrioritiesResponse) {
    const model: IMakeRequest = {
      url: ['priorities', id],
      method: REQUEST_METHODS.PUT,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async delete(id: string) {
    const model: IMakeRequest = {
      url: ['priorities', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }
}
