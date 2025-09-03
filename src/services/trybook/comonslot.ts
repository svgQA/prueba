// services/trybook/common-slot.ts
import { type IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

/**
 * Client service for Common Slots endpoints.
 * Backend controller base path: /common-slot
 */
export class CommonSlotService extends BaseService {
  static name: VoxServices = 'user';

  /** Create one or many slots */
  static async createSlot(data: any | any[]) {
    const model: IMakeRequest = {
      url: ['common-slot'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  /** List slots (supports basic pagination params if your API does) */
  static async getSlots(params: IPagination = { page: 1, items: 1000 }) {
    const model: IMakeRequest = {
      url: ['common-slot'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  /** Get a single slot by UUID */
  static async getSlot(uuid: string) {
    const model: IMakeRequest = {
      url: ['common-slot', String(uuid)],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  /** Update a slot by UUID */
  static async updateSlot(uuid: string, data: any) {
    const model: IMakeRequest = {
      url: ['common-slot', String(uuid)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  /** Delete (soft/hard per backend) a slot by UUID */
  static async deleteSlot(uuid: string) {
    const model: IMakeRequest = {
      url: ['common-slot', String(uuid)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<any>(this.name, model);
  }

  /** Occupy a slot (check-in) */
  static async occupySlot(uuid: string, data: any) {
    const model: IMakeRequest = {
      url: ['common-slot', String(uuid), 'occupy'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  /** Free a slot (check-out) */
  static async freeSlot(uuid: string, data: any) {
    const model: IMakeRequest = {
      url: ['common-slot', String(uuid), 'free'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }
}
