import { IModelFile, IModelStatus } from '@/types/ia';
import { BaseService } from '@/utils/network';
import { IMakeRequest, VoxServices } from '@/utils/network/types';

export class IaService extends BaseService {
  static name: VoxServices = 'ia';

  static async create_model() {
    const model: IMakeRequest = {
      url: ['model'],
    };
    return await super.make_request<IModelStatus>(this.name, model);
  }

  static async model_status() {
    const model: IMakeRequest = {
      url: ['model', 'status'],
    };
    return await super.make_request<IModelStatus>(this.name, model);
  }

  static async model_sync() {
    const model: IMakeRequest = {
      url: ['model', 'sync'],
    };
    return await super.make_request<any>(this.name, model);
  }

  static async model_files() {
    const model: IMakeRequest = {
      url: ['model', 'files'],
    };
    return await super.make_request<IModelFile>(this.name, model);
  }

  static async tenant_status() {
    const model: IMakeRequest = {
      url: ['model', 'tenant'],
    };
    return await super.make_request<any>(this.name, model);
  }

  // static async question(data: IQuestionIA) {
  //   const model: IMakeRequest = {
  //     url: ['ask'],
  //     method: REQUEST_METHODS.POST,
  //     data,
  //   };
  //   return await super.make_request<any>(this.name, model);
  // }
}
