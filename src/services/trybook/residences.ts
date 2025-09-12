// services/trybook/residences.ts
import { type IPagination } from '@/types';
import {
  type IResidenceItem,
  type IResidenceCreate,
  type IResidenceUpdate,
  type IResidenceQuery,
  type IResidenceOption,
} from '@/types/trybook/residences';

import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class ResidencesService extends BaseService {
  static name: VoxServices = 'user';

  // ─────────────────────────────────────────────────────────────
  // Residences
  // ─────────────────────────────────────────────────────────────

  /** POST /residence */
  static async createResidence(data: IResidenceCreate) {
    const model: IMakeRequest = {
      url: ['residence'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** GET /residence (list with optional filters/pagination) */
  static async getResidences(
    params: IPagination & IResidenceQuery = { page: 1, items: 1000 } as any
  ) {
    const model: IMakeRequest = {
      url: ['residence'],
      params: params as any,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** GET /residence/:uuid */
  static async getResidence(uuid: string) {
    const model: IMakeRequest = {
      url: ['residence', String(uuid)],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** PUT /residence/:uuid */
  static async updateResidence(uuid: string, data: IResidenceUpdate) {
    const model: IMakeRequest = {
      url: ['residence', String(uuid)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** DELETE /residence/:uuid */
  static async deleteResidence(uuid: string) {
    const model: IMakeRequest = {
      url: ['residence', String(uuid)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IResidenceItem>(this.name, model);
  }

  /** GET /residence/simple-list/:placeId → opciones para selects */
  static async getSimpleList(placeId: number) {
    const model: IMakeRequest = {
      url: ['residence', 'simple-list', String(placeId)],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResidenceOption>(this.name, model);
  }
}
