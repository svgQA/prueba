import { IOption } from '@/components/common/multi/interface';
import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import { REQUEST_METHODS, VoxServices } from '@/utils/network/types';

import { IMakeRequest } from '@/utils/network/types';

export class ServiceService extends BaseService {
  static name: VoxServices = 'shift';
  static async createService(data: any) {
    const model: IMakeRequest = {
      url: ['service'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateService(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteService(id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getServices(params: IPagination = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['service'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getServicesSimpleList() {
    const model: IMakeRequest = {
      url: ['service', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getServiceById(id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async getListService() {
    const model: IMakeRequest = {
      url: ['service', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.name, model);
  }
}
