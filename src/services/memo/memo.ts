import { Memo } from '@/pages/dashboard/memos/utils/memos';
import { IPagination } from '@/types';
import { BaseService, IRequestModelOutput } from '@/utils/network';
import { streamIAResponse } from '@/utils/network/sse.post';
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
      url: ['memo/history', id],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<Memo>(this.name, model);
  }

  static async streamQuery(
    onData: (chunk: string) => void,
    onDone?: () => void,
    onError?: (err: any) => void,
    prompt: string = ''
  ) {
    const model: IRequestModelOutput = this.make_request_model(
      'memo',
      {
        url: ['memo', 'stream/history'],
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
