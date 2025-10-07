import { IPagination } from '@/types';
import { INews } from '@/types/trybook/news';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class NewsService extends BaseService {
  static name: VoxServices = 'notification';

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['news'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async get_by_id(id: string) {
    const model: IMakeRequest = {
      url: ['news', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async create(data: INews) {
    const model: IMakeRequest = {
      url: ['news'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async update(id: string, data: INews) {
    const model: IMakeRequest = {
      url: ['news', id],
      method: REQUEST_METHODS.PUT,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async delete(id: string) {
    const model: IMakeRequest = {
      url: ['news', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }
}
