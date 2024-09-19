import { IInstance, IModule, IOwner, ITenant } from './interface';
import { IMakeRequest } from './utils/interface';
import { BaseService } from './utils/service';

export class TenantService extends BaseService {
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
