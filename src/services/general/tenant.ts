import { BaseService } from '@/utils/network';
import {
  // type IInstance,
  // type IModule,
  // type IOwner,
  type ITenant,
  type IMakeRequest,
  type IInstance,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import {
  ICSuperTenantRequest,
  ICDemoRequest,
  ICResponseDemo,
} from '@/types/tenant/tenant.request';

export class TenantService extends BaseService {
  static name: VoxServices = 'tenants';

  static async create_tenant(data: ICSuperTenantRequest) {
    const model: IMakeRequest = {
      url: ['tenants', 'super'],
      method: REQUEST_METHODS.POST,
      data: data,
    };
    return await super.make_request<any>(this.name, model, false);
  }

  static async get_my_tenants() {
    const model: IMakeRequest = {
      url: ['user'],
    };
    return await super.make_request<any>(this.name, model, false);
  }

  static async get_tenants() {
    const model: IMakeRequest = {
      url: ['tenants'],
    };
    return await super.make_request<ITenant>(this.name, model, false);
  }

  // static async get_tenants() {
  //   const model: IMakeRequest = {
  //     url: ['tenants'],
  //   };
  //   return await super.make_request<ITenant>(this.name, model);
  // }

  static async get_instances() {
    const model: IMakeRequest = {
      url: ['tenants', 'instances'],
    };
    return await super.make_request<IInstance>(this.name, model, false);
  }
  static async create_instance(data: IInstance) {
    const model: IMakeRequest = {
      url: ['tenants', 'instance'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IInstance>(this.name, model, false);
  }

  static async create_demo(data: ICDemoRequest) {
    const model: IMakeRequest = {
      url: ['tenants', 'demo'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model, false);
  }

  static async response_demo(data: ICResponseDemo) {
    const model: IMakeRequest = {
      url: ['tenants', 'demo', 'response'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model, false);
  }
  static async uploadFile(file: File, fileName: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    const model: IMakeRequest = {
      url: ['upload', 'file'],
      method: REQUEST_METHODS.POST,
      data: formData,
      uncontent: true,
    };
    return await super.make_request(this.name, model);
  }
  static async get_uploads(fileName: 'shift' | 'employee') {
    const model: IMakeRequest = {
      url: ['upload'],
      params: { fileName },
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  // static async get_modules() {
  //   const model: IMakeRequest = {
  //     url: ['module'],
  //   };
  //   return await super.make_request<IModule>(this.name, model);
  // }

  // static async get_owners() {
  //   const model: IMakeRequest = {
  //     url: ['owner'],
  //   };
  //   return await super.make_request<IOwner>(this.name, model);
  // }
}
