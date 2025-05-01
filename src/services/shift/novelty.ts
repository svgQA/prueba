import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import { REQUEST_METHODS, VoxServices } from '@/utils/network/types';

import { IMakeRequest } from '@/utils/network/types';

export class NoveltyService extends BaseService {
  static name: VoxServices = 'shift';
  static async createNovelty(data: any) {
    const model: IMakeRequest = {
      url: ['novelty'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateNovelty(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteNovelty(id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getNovelty(params: IPagination = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['novelty'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getNoveltyById(id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }
}
