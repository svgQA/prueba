import { IPagination } from '@/types';
import {
  IFormRequest,
  IFormResponse,
  IListRequest,
  IListResponse,
} from '@/types/form';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class FormService extends BaseService {
  static name: VoxServices = 'form';
  static async create(data: IFormRequest) {
    const model: IMakeRequest = {
      url: ['form'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async update(data: IFormRequest, id: number) {
    const model: IMakeRequest = {
      url: ['form', String(id)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IFormResponse>(this.name, model);
  }

  static async get_all(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['form'],
      params: params as any,
    };
    return await super.make_request<IFormResponse>(this.name, model);
  }

  static async get_list_all(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['list'],
      params: params as any,
    };
    return await super.make_request<IListResponse>(this.name, model);
  }

  static async create_list(data: IListRequest) {
    const model: IMakeRequest = {
      url: ['list'],
      method: REQUEST_METHODS.POST,
      data,
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
