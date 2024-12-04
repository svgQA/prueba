import {
  IModelFile,
  IModelStatus,
  IQueryRequest,
  IQueryResponse,
  ITenantModelStatus,
} from '@/types/ia';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

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
    return await super.make_request<ITenantModelStatus>(this.name, model);
  }

  static async make_query(data: IQueryRequest) {
    const model: IMakeRequest = {
      url: ['service', 'question'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IQueryResponse>(this.name, model);
  }

  static async upload_file(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    const model: IMakeRequest = {
      url: ['file'],
      method: REQUEST_METHODS.POST,
      data: formData,
      uncontent: true,
    };
    return await super.make_request(this.name, model);
  }
}
