// src/services/template.ts
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { ICreateNotificationTemplateDto } from '@/types/notification/ICreateNotificationTemplateDto';
import { IOption } from '@/components/common/multi/interface';

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

  static async updateTemplate(
    id: string,
    data: Partial<ICreateNotificationTemplateDto>
  ) {
    const model: IMakeRequest = {
      url: ['notifications', 'template', id],
      method: REQUEST_METHODS.PACTH,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async deleteTemplate(id: string) {
    const model: IMakeRequest = {
      url: ['notifications', 'template', id, 'hard'],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getBasicTemplates() {
    const model: IMakeRequest = {
      url: ['template', 'simple', 'list'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.name, model);
  }
}
