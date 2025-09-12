// services/trybook/resourcezone.ts
import { type IPagination } from '@/types';
import {
  type IResourceZoneItem,
  type IResourceZoneCreate,
  type IResourceZoneUpdate,
  type IResourceZoneQuery,
  type IResourceZoneOption,
} from '@/types/trybook/resource-zone';

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

  /** GET /resource-zone */
  static async getResourceZones(
    params: IPagination & IResourceZoneQuery = { page: 1, items: 1000 } as any
  ) {
    const model: IMakeRequest = {
      url: ['resource-zone'],
      params: params as any,
    };
    return await super.make_request<IResourceZoneItem>(this.common, model);
  }

  /** GET /resource-zone/:id */
  static async getResourceZone(id: number) {
    const model: IMakeRequest = {
      url: ['resource-zone', String(id)],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResourceZoneItem>(this.common, model);
  }

  /** POST /resource-zone (uno o varios) */
  static async createResourceZone(
    payload: IResourceZoneCreate | IResourceZoneCreate[]
  ) {
    const model: IMakeRequest = {
      url: ['resource-zone'],
      method: REQUEST_METHODS.POST,
      data: payload,
    };
    return await super.make_request<IResourceZoneItem>(this.common, model);
  }

  /** PUT /resource-zone/:id */
  static async updateResourceZone(id: number, payload: IResourceZoneUpdate) {
    const model: IMakeRequest = {
      url: ['resource-zone', String(id)],
      method: REQUEST_METHODS.PUT,
      data: payload,
    };
    return await super.make_request<IResourceZoneItem>(this.common, model);
  }

  /** DELETE /resource-zone/:id */
  static async deleteResourceZone(id: number) {
    const model: IMakeRequest = {
      url: ['resource-zone', String(id)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IResourceZoneItem>(this.common, model);
  }

  /** GET /resource-zone/simple-list → opciones para selects */
  static async getSimpleList() {
    const model: IMakeRequest = {
      url: ['resource-zone', 'simple-list'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResourceZoneOption>(this.common, model);
  }
}
