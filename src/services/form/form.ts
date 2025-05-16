import { IOption } from '@/components/common/multi/interface';
import { IPagination } from '@/types';
import {
  IFormRequest,
  IFormResponse,
  IListRequest,
  IListResponse,
  IReportRequest,
  IReportResponse,
  IResponseRequest,
  IResponseResponse,
  UResponseRequest,
} from '@/types/form';
import { IShiftResponse } from '@/types/shift/activity';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class FormService extends BaseService {
  static sname: VoxServices = 'form';
  static async create(data: IFormRequest) {
    const model: IMakeRequest = {
      url: ['form'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IShiftResponse>(this.sname, model);
  }

  static async update(data: IFormRequest, id: number) {
    const model: IMakeRequest = {
      url: ['form', String(id)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IFormResponse>(this.sname, model);
  }

  static async delete(id: number | string) {
    const model: IMakeRequest = {
      url: ['form', String(id)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IFormResponse>(this.sname, model);
  }

  static async get_all(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['form'],
      params: params as any,
    };
    return await super.make_request<IFormResponse>(this.sname, model);
  }

  static async get_list_all(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['list'],
      params: params as any,
    };
    return await super.make_request<IListResponse>(this.sname, model);
  }

  static async create_report(data: IReportRequest) {
    const model: IMakeRequest = {
      url: ['report'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IResponseResponse>(this.sname, model);
  }

  static async update_report(data: IReportRequest, id: number) {
    const model: IMakeRequest = {
      url: ['report', `${id}`],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IReportResponse>(this.sname, model);
  }

  static async get_report_by_id(id: number) {
    const model: IMakeRequest = {
      url: ['report', `${id}`],
      method: REQUEST_METHODS.GET,
      params: { id },
    };
    return await super.make_request<IReportResponse>(this.sname, model);
  }

  static async get_report_all(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['report'],
      params: params as any,
    };
    return await super.make_request<IReportResponse>(this.sname, model);
  }

  static async create_response(data: IResponseRequest) {
    const model: IMakeRequest = {
      url: ['response'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IResponseResponse>(this.sname, model);
  }

  static async update_response(data: UResponseRequest, id: string) {
    const model: IMakeRequest = {
      url: ['response', `${id}`],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IResponseResponse>(this.sname, model);
  }

  static async finish_response(data: UResponseRequest, id: string) {
    const model: IMakeRequest = {
      url: ['response', `${id}`, 'end'],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IResponseResponse>(this.sname, model);
  }

  static async get_response_all(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['response'],
      params: params as any,
    };
    return await super.make_request<IResponseResponse>(this.sname, model);
  }

  static async create_list(data: IListRequest) {
    const model: IMakeRequest = {
      url: ['list'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IListResponse>(this.sname, model);
  }

  static async get_one(id: number) {
    const model: IMakeRequest = {
      url: ['form', String(id)],
    };
    return await super.make_request<IFormResponse>(this.sname, model);
  }

  static async remove_response_one(id: string) {
    const model: IMakeRequest = {
      url: ['response', `${id}`],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IFormResponse>(this.sname, model);
  }
  static async getSimpleList() {
    const model: IMakeRequest = {
      url: ['form', 'simple', 'list'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.sname, model);
  }
}
