import { Memo } from '@/pages/dashboard/memos/utils/memos';
import { IPagination } from '@/types';
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
}
