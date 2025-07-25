import { IPagination } from '@/types';
import {
  IReportRequest,
  IReportResponse,
  IResponseResponse,
} from '@/types/form';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class ReportService extends BaseService {
    static sname: VoxServices = 'form';

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

    static async delete_report(id: number) {
        const model: IMakeRequest = {
            url: ['report', `${id}`],
            method: REQUEST_METHODS.DELETE,
        };
        return await super.make_request<IReportResponse>(this.sname, model);
    }

    static async create_report_automatic(data: IReportRequest) {
        const model: IMakeRequest = {
            url: ['reportIa', 'generate'],
            method: REQUEST_METHODS.POST,
            data,
        };
        return await super.make_request<{ url: string }>(this.sname, model);
    }
}