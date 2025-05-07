import { IPresignedRequest, IPresignedResponse } from '@/types/file';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export interface IGeneralRequest {
  id?: number;
  type: string;
  title: string;
  description: string;
  settings: any;
}
export class GeneralService extends BaseService {
  static sname: VoxServices = 'file';
  static async presigned(data: IPresignedRequest) {
    const model: IMakeRequest = {
      url: ['file', 'presigned'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IPresignedResponse>(this.sname, model);
  }
}
