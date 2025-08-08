import { IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class CorrespondenceService extends BaseService {
  static name: VoxServices = 'access';

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['correspondences'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async get_by_id(id: string) {
    const model: IMakeRequest = {
      url: ['correspondences', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createCorrespondence(data: any) {
    const model: IMakeRequest = {
      url: ['correspondences'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateCorrespondence(id: string, data: any) {
    const model: IMakeRequest = {
      url: ['correspondences', id],
      method: REQUEST_METHODS.PUT,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteCorrespondence(id: string) {
    const model: IMakeRequest = {
      url: ['correspondences', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  /**
   * Gets a summary of correspondences including total count, in progress and completed
   * @returns Summary object with total, progress and completed counts
   */
  static async getCorrespondenceSummary() {
    const model: IMakeRequest = {
      url: ['correspondences', 'summary', 'stats'],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<any>(this.name, model);
  }
}
