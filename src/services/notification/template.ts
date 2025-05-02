// src/services/template.ts
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { ICreateNotificationTemplateDto } from '@/types/notification/ICreateNotificationTemplateDto';

export class TemplateService extends BaseService {
  static name: VoxServices = 'notification';

  static async getTemplates() {
    const model: IMakeRequest = {
      url: ['notifications', 'templates'],
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getTemplateById(id: string) {
    const model: IMakeRequest = {
      url: ['notifications', 'template', id],
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createTemplate(data: ICreateNotificationTemplateDto) {
    const model: IMakeRequest = {
      url: ['notifications', 'template'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }
}
