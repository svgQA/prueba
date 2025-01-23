import { IPagination } from '@/types';
import { IPlaceRequest, IRoundRequest, IShiftRequest } from '@/types/shift';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  VoxServices,
  REQUEST_METHODS,
} from '@/utils/network/types';

export class ShiftService extends BaseService {
  static name: VoxServices = 'shift';
  static async get_all() {
    const model: IMakeRequest = {
      url: ['shifts'],
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createPlace(data: any) {
    const model: IMakeRequest = {
      url: ['place'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getPlaces(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['place'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createRound(data: IRoundRequest) {
    const model: IMakeRequest = {
      url: ['round'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createShift(data: IShiftRequest) {
    const model: IMakeRequest = {
      url: ['shift'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }
}
