import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { ICOtsRequest } from '@/pages/dashboard/pqrs/utils/interface';

export class OtsService extends BaseService {
  static name: VoxServices = 'pqrs';

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['ots'],
      params: params as any,
    };
    return await super.make_request<ICOtsRequest>(this.name, model);
  }

  static async get_by_id(id: string) {
    const model: IMakeRequest = {
      url: ['ots', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<ICOtsRequest>(this.name, model);
  }

  static async create(pqrsId: number, areaId: number) {
    const model: IMakeRequest = {
      url: ['ots'],
      method: REQUEST_METHODS.POST,
      data: {
        pqrsId,
        areaId
      },
    };
    return await super.make_request(this.name, model);
  }

  static async update(id: string, data: ICOtsRequest) {
    const model: IMakeRequest = {
      url: ['ots', id],
      method: REQUEST_METHODS.PUT,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async delete(id: string) {
    const model: IMakeRequest = {
      url: ['ots', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }
}
