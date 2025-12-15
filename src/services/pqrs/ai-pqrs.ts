import { IPresignedRequest, IPresignedResponse } from '@/types/file';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class PqrsAiService extends BaseService {
  static name: VoxServices = 'ai_pqrs';

  static async execute_ai_pqrs(data: any) {
    const model: IMakeRequest = {
      url: ['validate-media-type'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request(this.name, model);
  }

  static async execute_ai_process_again(stageId: string, pqrsId: number) {
    const model: IMakeRequest = {
      url: ['validate-media-type', 'process-stage', pqrsId.toString()],
      method: REQUEST_METHODS.POST,
      data: { stageId: Number(stageId) },
    };
    return await super.make_request(this.name, model);
  }

  static async presigned(data: IPresignedRequest) {
    const model: IMakeRequest = {
      url: ['file', 'presigned'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IPresignedResponse>(this.name, model);
  }
}
