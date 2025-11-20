import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { IKeyResponse } from '@/types/key/key.response';
import { ICreateKeyRequest } from '@/types/key/key.request';

export class KeyService extends BaseService {
  static name: VoxServices = 'shift';

  static async create(data: ICreateKeyRequest) {
    const model: IMakeRequest = {
      url: ['key'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IKeyResponse>(this.name, model);
  }

  static async delete(id: number) {
    const model: IMakeRequest = {
      url: ['key', String(id)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IKeyResponse>(this.name, model);
  }

  static async listAll() {
    const model: IMakeRequest = {
      url: ['key'],
    };
    return await super.make_request<IKeyResponse>(this.name, model);
  }
}
