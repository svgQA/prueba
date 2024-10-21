import { BaseService } from '@/utils/network';
import { type IOnboardingModel } from '@/store/signals/types';
import {
  type IInstance,
  type IModule,
  type IOwner,
  type ITenant,
  type IMakeRequest,
  REQUEST_METHODS,
} from '@/utils/network/types';
import { onboarding2Tenant } from '@/utils/network/utils';

export class TenantService extends BaseService {
  static async create_tenant(data: IOnboardingModel) {
    const tenant = onboarding2Tenant(data);
    const model: IMakeRequest = {
      url: ['tenants'],
      method: REQUEST_METHODS.POST,
      data: tenant,
    };
    return await super.make_request<ITenant>(this, model);
  }
  static async get_my_tenants(id: string) {
    const model: IMakeRequest = {
      url: ['users', id],
    };
    return await super.make_request<any>(this, model);
  }
  static async get_tenants() {
    const model: IMakeRequest = {
      url: ['tenants'],
    };
    return await super.make_request<ITenant>(this, model);
  }
  static async get_instances() {
    const model: IMakeRequest = {
      url: ['instances'],
    };
    return await super.make_request<IInstance>(this, model);
  }
  static async get_modules() {
    const model: IMakeRequest = {
      url: ['modules'],
    };
    return await super.make_request<IModule>(this, model);
  }
  static async get_owners() {
    const model: IMakeRequest = {
      url: ['owner'],
    };
    return await super.make_request<IOwner>(this, model);
  }
}
