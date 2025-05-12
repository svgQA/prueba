import { IPagination } from '@/types';
import { type IProjectMetricsResponse } from '@/types/contract/contract.response';
import { BaseService } from '@/utils/network';
import { REQUEST_METHODS, VoxServices } from '@/utils/network/types';

import { IMakeRequest } from '@/utils/network/types';

export class ContractService extends BaseService {
  static name: VoxServices = 'shift';
  static async deleteProject(id: string) {
    const model: IMakeRequest = {
      url: ['contract', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async createProject(data: any) {
    const model: IMakeRequest = {
      url: ['contract'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateProject(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['contract', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async getProject(id: string) {
    const model: IMakeRequest = {
      url: ['contract', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async getProjects(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['contract'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getProjectMetrics(id: number) {
    const model: IMakeRequest = {
      url: ['contract', `${id}`, 'metrics'],
    };
    return await super.make_request<IProjectMetricsResponse>(this.name, model);
  }
}
