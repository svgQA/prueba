import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { IWebhookResponse } from '@/types/webhook/webhook.response';
import { ICreateWebhookRequest } from '@/types/webhook/webhook.request';

export class WebhookService extends BaseService {
  static name: VoxServices = 'webhook';

  static async create(data: ICreateWebhookRequest) {
    const model: IMakeRequest = {
      url: ['webhook'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IWebhookResponse>(this.name, model);
  }

  static async listAll() {
    const model: IMakeRequest = {
      url: ['webhook'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IWebhookResponse>(this.name, model);
  }
}
