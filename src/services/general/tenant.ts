import { BaseService } from '@/utils/network';
import { type IOnboardingModel } from '@/store/signals/types';
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
import { ICSuperTenantRequest } from '@/types/tenant/tenant.request';

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
