import { IPagination } from '@/types';
// import { IPlaceRequest, IRoundRequest, IShiftRequest } from '@/types/shift';
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

  static async getProjects(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['project'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getDepartments(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['place/departments'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getMunicipalities(id: string, params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['place/municipalities', id],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createRound(data: any) {
    const model: IMakeRequest = {
      url: ['round'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getRounds(params: IPagination = { page: 1, items: 20 }) {
    const model: IMakeRequest = {
      url: ['round'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createShift(data: any) {
    const model: IMakeRequest = {
      url: ['activity'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }
}
