import { IAuth, ISignin } from '@/types';
import { BaseService, IMakeRequest, REQUEST_METHODS } from '@/utils/network';
import { VOX_DEFAULT_SERVICE_URL } from '@/utils/network/constants';

export class AuthService extends BaseService {
  constructor() {
    super(VOX_DEFAULT_SERVICE_URL);
  }

  async signin(payload: ISignin) {
    const model: IMakeRequest = {
      url: ['signin'],
      data: payload,
      method: REQUEST_METHODS.POST,
    };
    return await this.makeRequest<IAuth>(model);
  }

  async logout(_id: string) {
    const model: IMakeRequest = {
      url: ['logout'],
    };
    return await this.makeRequest<IAuth>(model);
  }
}
