import { IOption } from '@/components/common/multi/interface';
import { IPagination } from '@/types';
import { IPresignedRequest, IPresignedResponse } from '@/types/file';
import { IAppSetting } from '@/types/settings';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import {
  ICCompanyRequest,
  ICompanyResponse,
  IUCompanyRequest,
} from '@/utils/types/company.interface';

export class GeneralService extends BaseService {
  static sname: VoxServices = 'file';
  static async presigned(data: IPresignedRequest) {
    const model: IMakeRequest = {
      url: ['file', 'presigned'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IPresignedResponse>(this.sname, model);
  }

  static async getAppSetting() {
    const model: IMakeRequest = {
      url: ['module'],
      params: {
        type: 'APP',
      },
    };
    return await super.make_request<IAppSetting>(this.sname, model);
  }

  static async setAppSetting(data: IAppSetting) {
    const model: IMakeRequest = {
      url: ['module', 'app'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IAppSetting>(this.sname, model);
  }

  // Company methods
  static async createCompany(data: ICCompanyRequest) {
    const model: IMakeRequest = {
      url: ['company'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.sname, model);
  }

  static async getCompanies(params: IPagination = { page: 1, items: 100 }) {
    const model: IMakeRequest = {
      url: ['company'],
      params: params as any,
    };
    return await super.make_request<ICompanyResponse>(this.sname, model);
  }

  static async getCompanyById(id: number) {
    const model: IMakeRequest = {
      url: ['company', id.toString()],
    };
    return await super.make_request(this.sname, model);
  }

  static async updateCompany(id: number, data: IUCompanyRequest) {
    const model: IMakeRequest = {
      url: ['company', id.toString()],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.sname, model);
  }

  static async deleteCompany(id: number) {
    const model: IMakeRequest = {
      url: ['company', id.toString()],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<any>(this.sname, model);
  }

  static async getCompanyList() {
    const model: IMakeRequest = {
      url: ['company', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.sname, model);
  }
}
