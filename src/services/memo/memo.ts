import { Memo } from '@/pages/dashboard/memos/utils/memos';
import { IPagination } from '@/types';
import { ICheckRequest } from '@/types/memo/memo.request';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export type MemosSummary = {
  total: number;
  in_progress: number;
  completed: number;
};

export class MemoService extends BaseService {
  static name: VoxServices = 'memo';

  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['memo'],
      params: params as any,
    };
    return await super.make_request<Memo>(this.name, model);
  }

  /**
   * Gets a summary of memos including total count, in progress and completed
   * @returns Summary object with total, progress and completed counts
   */
  static async getMemosSummary() {
    const model: IMakeRequest = {
      url: ['memo/summary/stats'],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<MemosSummary>(this.name, model);
  }

  static async createMemo(data: any) {
    const model: IMakeRequest = {
      url: ['memo'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async getMemosByHistory(id: string) {
    const model: IMakeRequest = {
      url: ['memo', 'history', id],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<Memo>(this.name, model);
  }

  static async createCheck(data: ICheckRequest, memoId: number) {
    const model: IMakeRequest = {
      url: ['memo', `${memoId}`, 'check'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async get_all_by_service(
    params: IPagination = { page: 1, items: 400 }
  ) {
    const model: IMakeRequest = {
      url: ['memo', 'grouped-by-service-memo'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async get_all_by_service_id(
    serviceId: string,
    params: IPagination = { page: 1, items: 400 }
  ) {
    const model: IMakeRequest = {
      url: ['memo', 'by-service-memo', serviceId],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async get_all_by_user(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['memo', 'grouped-by-user-memo'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async get_all_by_user_id(
    userId: string,
    params: IPagination = { page: 1, items: 400 }
  ) {
    const model: IMakeRequest = {
      url: ['memo', 'by-user-memo', userId],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }
}
