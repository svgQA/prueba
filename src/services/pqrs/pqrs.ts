import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { IStages } from '@/pages/settings/pqrs/stages/utils/interface';
import { ICPqrsRequest } from '@/pages/dashboard/pqrs/utils/interface';

export class PqrsService extends BaseService {
  static name: VoxServices = 'pqrs';

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['pqrs'],
      params: params as any,
    };
    return await super.make_request<ICPqrsRequest>(this.name, model);
  }

  static async get_by_id(id: string) {
    const model: IMakeRequest = {
      url: ['pqrs', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<ICPqrsRequest>(this.name, model);
  }

  static async create(data: IStages) {
    const model: IMakeRequest = {
      url: ['pqrs'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async update(id: string, data: IStages) {
    const model: IMakeRequest = {
      url: ['pqrs', id],
      method: REQUEST_METHODS.PUT,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async delete(id: string) {
    const model: IMakeRequest = {
      url: ['pqrs', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }
}
