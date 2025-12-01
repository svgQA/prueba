import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { IOnePdfResponseModel } from '@/types/report/report.response';
import {
  IMemoReportRequest,
  IResponseReportRequest,
  IShiftReportRequest,
} from '@/types/report/report.request';
import { ReportType } from '@/types/report/report.enum';

export class ReportService extends BaseService {
  static sname: VoxServices = 'report';

  static async download_one_module_pdf(
    data: IShiftReportRequest | IMemoReportRequest | IResponseReportRequest
  ) {
    const model: IMakeRequest = {
      url: ['generate-report', 'download_one_module_pdf'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IOnePdfResponseModel>(this.sname, model);
  }
  static async download_module_pdf(
    data:
      | IShiftReportRequest[]
      | IMemoReportRequest[]
      | IResponseReportRequest[],
    type: ReportType
  ) {
    const model: IMakeRequest = {
      url: ['generate-report', 'download_module_pdf'],
      method: REQUEST_METHODS.POST,
      data: {
        data: data,
        type: type,
      },
    };
    return await super.make_request<IOnePdfResponseModel>(this.sname, model);
  }
}
