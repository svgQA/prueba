import { FormValues } from '@/components/compose/gantt/components/gantt/replicate.modal';
import { ICustomQuery, type IPagination } from '@/types';
import { type IShiftResponse } from '@/types/shift/activity';
import { ICheckRequest } from '@/types/shift/shift.request';
import { BaseService, IRequestModelOutput } from '@/utils/network';
import { streamIAResponse } from '@/utils/network/sse/sse.post';
import {
  type IMakeRequest,
  VoxServices,
  REQUEST_METHODS,
} from '@/utils/network/types';
import { type IReplicateShift } from '@/utils/types/shift.interface';

export type ShiftSummary = {
  total: number;
  in_progress: number;
  completed: number;
};

export type RelatedShifts = {
  id: number;
  start: string | Date;
  end: string | Date;
};

export class ShiftService extends BaseService {
  static name: VoxServices = 'shift';
  static async get_all(params: ICustomQuery = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['activity'],
      params: params as any,
    };
    return await super.make_request<IShiftResponse>(this.name, model);
  }

  static async get_related(data: RelatedShifts) {
    const model: IMakeRequest = {
      url: ['activity/user/related'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async get_shift(id: string | number) {
    const model: IMakeRequest = {
      url: ['activity', String(id)],
    };
    return await super.make_request<IShiftResponse>(this.name, model);
  }

  static async set_replicate(data: IReplicateShift) {
    const model: IMakeRequest = {
      url: ['activity', 'replicate'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async createCheck(data: ICheckRequest, shiftId: number) {
    const model: IMakeRequest = {
      url: ['activity', `${shiftId}`, 'check'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async getRoundHistory<T = any>(shiftId: number, roundId: number) {
    const model: IMakeRequest = {
      url: ['activity', 'history', `${roundId}`, `${shiftId}`],
    };
    return await super.make_request<T>(this.name, model);
  }

  static async getPointsHistory<T = any>(shiftId: number, roundId: number) {
    const model: IMakeRequest = {
      url: ['activity', 'points', 'history', `${roundId}`, `${shiftId}`],
    };
    return await super.make_request<T>(this.name, model);
  }

  /**
   * Gets a summary of shifts including total count, in progress and completed
   * @returns Summary object with total, progress and completed counts
   */
  static async getShiftSummary() {
    const model: IMakeRequest = {
      url: ['activity/summary'],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<ShiftSummary>(this.name, model);
  }

  static async createActivity(data: any) {
    const model: IMakeRequest = {
      url: ['activity'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }
  static async updateActivity(data: any, id: string | number) {
    const model: IMakeRequest = {
      url: ['activity', String(id)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteActivity(id: string | number) {
    const model: IMakeRequest = {
      url: ['activity', String(id)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getActivities(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['activity'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getActivityById(id: string) {
    const model: IMakeRequest = {
      url: ['activity', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async setReplicateV2(data: FormValues) {
    const model: IMakeRequest = {
      url: ['activity', 'replicate', 'v2'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async streamQuery(
    onData: (chunk: string) => void,
    onDone?: () => void,
    onError?: (err: any) => void,
    prompt: string = ''
  ) {
    const model: IRequestModelOutput = this.make_request_model(
      'shift',
      {
        url: ['activity', 'stream', 'check'],
        method: REQUEST_METHODS.POST,
        data: { prompt },
      },
      false
    );

    try {
      await streamIAResponse(model, onData, onDone, onError);
    } catch (error) {
      onError?.(error);
    }
  }
}
