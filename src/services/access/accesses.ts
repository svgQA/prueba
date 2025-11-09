import { IPagination } from '@/types';
import { ICAccesses } from '@/types/access';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class AccessesService extends BaseService {
  static name: VoxServices = 'access';

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['accesses'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async get_by_id(id: string) {
    const model: IMakeRequest = {
      url: ['accesses', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createAccesses(data: ICAccesses) {
    const model: IMakeRequest = {
      url: ['accesses'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateAccesses(id: string, data: any) {
    const model: IMakeRequest = {
      url: ['accesses', id],
      method: REQUEST_METHODS.PUT,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteAccesses(id: string) {
    const model: IMakeRequest = {
      url: ['accesses', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  /**
   * Gets a summary of memos including total count, in progress and completed
   * @returns Summary object with total, progress and completed counts
   */
  static async getAccessesSummary() {
    const model: IMakeRequest = {
      url: ['accesses/summary/stats'],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<any>(this.name, model);
  }
}
