import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

interface IQuestionIA {
  tenant: string;
  question: string;
}

export class IaService extends BaseService {
  static name: VoxServices = 'ia';
  static async question(data: IQuestionIA) {
    const model: IMakeRequest = {
      url: ['ask'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async document(data: FormData) {
    console.log(data);
  }

  static async create_tenant(tenant: string) {
    const model: IMakeRequest = {
      url: ['create'],
      method: REQUEST_METHODS.POST,
      data: {
        tenant,
      },
    };
    return await super.make_request<any>(this.name, model);
  }
}
