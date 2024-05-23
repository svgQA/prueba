import { IInstance, ITenant } from '@/types';
import { BaseService, IMakeRequest } from '@/utils/network';
import { VOX_TENANT_SERVICE_URL } from '@/utils/network/constants';

export class TenantService extends BaseService {
  constructor() {
    super(VOX_TENANT_SERVICE_URL, 'api');
  }

  async instances() {
    const model: IMakeRequest = {
      url: ['instances'],
    };
    return await this.makeRequest<IInstance>(model);
  }

  async tenants(_id: string) {
    const model: IMakeRequest = {
      url: ['tenants'],
    };
    return await this.makeRequest<ITenant>(model);
  }
}
