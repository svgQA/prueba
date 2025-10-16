// services/trybook/residences.ts
import { type IPagination } from '@/types';
import { IResidenceCreate, IResidenceItem, IResidenceQuery, IResidenceUpdate, IResidenceOption } from '@/types/trybook/sites';

import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class SitesService extends BaseService {
  static name: VoxServices = 'user';

  // ─────────────────────────────────────────────────────────────
  // Residences
  // ─────────────────────────────────────────────────────────────

  /** POST /site */
  static async createSite(data: IResidenceCreate) {
    const model: IMakeRequest = {
      url: ['sites'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** GET /site (list with optional filters/pagination) */
  static async getSites(
    params: IPagination & IResidenceQuery = { page: 1, items: 1000 } as any
  ) {
    const model: IMakeRequest = {
      url: ['sites'],
      params: params as any,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** GET /site/:uuid */
  static async getSite(uuid: string) {
    const model: IMakeRequest = {
      url: ['sites', String(uuid)],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** PUT /site/:uuid */
  static async updateSite(uuid: string, data: IResidenceUpdate) {
    const model: IMakeRequest = {
      url: ['sites', String(uuid)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** DELETE /site/:uuid */
  static async deleteSite(uuid: string) {
    const model: IMakeRequest = {
      url: ['sites', String(uuid)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** GET /residence/simple-list/:placeId → opciones para selects */
  static async getSimpleList(placeId: number) {
    const model: IMakeRequest = {
      url: ['sites', 'simple-list', String(placeId)],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResidenceOption>(this.name, model);
  }
}
