import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class FormService extends BaseService {
  static name: VoxServices = 'form';
  static async create(data: any) {
    const model: IMakeRequest = {
      url: ['create'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async update(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['form', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async get_all() {
    const model: IMakeRequest = {
      url: ['forms'],
    };
    return await super.make_request<any>(this.name, model);
  }

  static async get_one(id: string) {
    const model: IMakeRequest = {
      url: ['form', id],
    };
    return await super.make_request<any>(this.name, model);
  }
}
