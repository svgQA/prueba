import { type IPagination } from '@/types';

import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class ResourceZoneService extends BaseService {
  static common: VoxServices = 'user';

  // ─────────────────────────────────────────────────────────────
  // ResourceZone
  // ─────────────────────────────────────────────────────────────
  static async getResourceZones(params: IPagination = { page: 1, items: 1000 }) {
    const model: IMakeRequest = {
      url: ['resource-zone'],
      params: params as any,
    };
    return await super.make_request<any>(this.common, model);
  }

  static async getResourceZone(id: number) {
    const model: IMakeRequest = {
      url: ['resource-zone', String(id)],
    };
    return await super.make_request<any>(this.common, model);
  }

  static async createResourceZone(payload: any | any[]) {
    const model: IMakeRequest = {
      url: ['resource-zone'],
      method: REQUEST_METHODS.POST,
      data: payload,
    };
    return await super.make_request<any>(this.common, model);
  }

  static async updateResourceZone(id: number, payload: any) {
    const model: IMakeRequest = {
      url: ['resource-zone', String(id)],
      method: REQUEST_METHODS.PUT,
      data: payload,
    };
    return await super.make_request<any>(this.common, model);
  }

  static async deleteResourceZone(id: number) {
    const model: IMakeRequest = {
      url: ['resource-zone', String(id)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<any>(this.common, model);
  }
}
