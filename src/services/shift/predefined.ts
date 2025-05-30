import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import { REQUEST_METHODS, VoxServices } from '@/utils/network/types';

import { IMakeRequest } from '@/utils/network/types';

export class PredefinedService extends BaseService {
  static name: VoxServices = 'shift';
  static async createPredefined(data: any) {
    const model: IMakeRequest = {
      url: ['predefined'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updatePredefined(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['predefined', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deletePredefined(id: string) {
    const model: IMakeRequest = {
      url: ['predefined', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getPredefined(params: IPagination = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['predefined'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getPredefinedById(id: string) {
    const model: IMakeRequest = {
      url: ['predefined', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }
}
