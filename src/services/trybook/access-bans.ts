// services/trybook/access-bans.ts
import { type IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import {
  IAccessBan,
  ICreateAccessBan,
  IUpdateAccessBan,
} from '@/types/trybook/access-ban';

export class AccessBansService extends BaseService {
  static common: VoxServices = 'user';

  /** Listar bans (paginado opcional) */
  static async getAccessBans(params: IPagination = { page: 1, items: 1000 }) {
    const model: IMakeRequest = {
      url: ['access-bans'],
      params: params as any,
    };
    return await super.make_request<IAccessBan>(this.common, model);
  }

  /** Obtener un ban por ID */
  static async getAccessBan(id: number | string) {
    const model: IMakeRequest = {
      url: ['access-bans', String(id)],
    };
    return await super.make_request<IAccessBan>(this.common, model);
  }

  /** Crear uno o varios bans */
  static async createAccessBan(payload: ICreateAccessBan | ICreateAccessBan[]) {
    const model: IMakeRequest = {
      url: ['access-bans'],
      method: REQUEST_METHODS.POST,
      data: payload,
    };
    return await super.make_request<IAccessBan>(this.common, model);
  }

  /** Actualizar un ban por ID */
  static async updateAccessBan(id: number | string, payload: IUpdateAccessBan) {
    const model: IMakeRequest = {
      url: ['access-bans', String(id)],
      method: REQUEST_METHODS.PUT,
      data: payload,
    };
    return await super.make_request<IAccessBan>(this.common, model);
  }

  /** Eliminar (soft/hard según backend) un ban por ID */
  static async deleteAccessBan(id: number | string) {
    const model: IMakeRequest = {
      url: ['access-bans', String(id)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IAccessBan>(this.common, model);
  }
}
