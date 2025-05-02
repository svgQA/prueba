import { BaseService } from '@/utils/network';
import { IMakeRequest, REQUEST_METHODS } from '@/utils/network/interface';
import { VoxServices } from '@/utils/network/types';
import { IPaginationRound } from '@/utils/types/shift.interface';

export class RoundService extends BaseService {
  static name: VoxServices = 'shift';
  static async updateRound(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['round', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteRound(id: string) {
    const model: IMakeRequest = {
      url: ['round', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getRoundById(id: string) {
    const model: IMakeRequest = {
      url: ['round', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async createRound(data: any) {
    const model: IMakeRequest = {
      url: ['round'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async getRounds(params: IPaginationRound = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['round'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }
}
