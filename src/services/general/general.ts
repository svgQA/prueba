import { IResource } from '@/pages/settings/access/resource/type';
import { IPresignedRequest, IPresignedResponse } from '@/types/file';
import { BaseService, IRequestModelOutput } from '@/utils/network';
import { streamIAResponse } from '@/utils/network/sse.post';
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

  static async resource() {
    const model: IMakeRequest = {
      url: ['resource'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IResource>(this.sname, model);
  }

  static async createResource(data: IResource) {
    const model: IMakeRequest = {
      url: ['resource'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IResource>(this.sname, model);
  }

  static async streamQuery(
    url: string[],
    onData: (chunk: string) => void,
    onDone?: () => void,
    onError?: (err: any) => void,
    prompt: string = ''
  ) {
    const model: IRequestModelOutput = this.make_request_model(
      'memo',
      {
        url: url,
        method: REQUEST_METHODS.POST,
        data: { prompt },
      },
      false
    );

    await streamIAResponse(model, onData, onDone, onError);
    // try {
    //   await streamIAResponse(model, onData, onDone, onError);
    // } catch (error) {
    //   onError?.(error);
    // }
  }
}
