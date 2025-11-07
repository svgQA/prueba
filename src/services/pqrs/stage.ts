import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { IOption } from '@/components/common/multi/interface';
import { IStages } from '@/pages/settings/pqrs/stages/utils/interface';

export class StageService extends BaseService {
  static name: VoxServices = 'pqrs';

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['stage'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async get_by_id(id: string) {
    const model: IMakeRequest = {
      url: ['stage', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async create(data: IStages) {
    const model: IMakeRequest = {
      url: ['stage'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async update(id: string, data: IStages) {
    const model: IMakeRequest = {
      url: ['stage', id],
      method: REQUEST_METHODS.PUT,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async delete(id: string) {
    const model: IMakeRequest = {
      url: ['stage', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getSimpleList() {
    const model: IMakeRequest = {
      url: ['stage', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getStatusSimpleList() {
    const model: IMakeRequest = {
      url: ['stage', 'status', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.name, model);
  }
}
