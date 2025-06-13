import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export interface RoutePoint {
  coords: [number, number];
  action?: string;
}

export class TrackingService extends BaseService {
  static sname: VoxServices = 'file';

  static async getTracking() {
    const model: IMakeRequest = {
      url: ['tracking'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<RoutePoint>(this.sname, model);
  }
}
