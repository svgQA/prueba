import { IOption } from '@/components/common/multi/interface';
import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import { REQUEST_METHODS, VoxServices } from '@/utils/network/types';

import { IMakeRequest } from '@/utils/network/types';

export class TaskService extends BaseService {
  static name: VoxServices = 'shift';
  static async createTask(data: any) {
    const model: IMakeRequest = {
      url: ['task'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateTask(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteTask(id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getSimpleList() {
    const model: IMakeRequest = {
      url: ['task', 'simple', 'list'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getTasks(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['task'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getTaskById(id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }
}
