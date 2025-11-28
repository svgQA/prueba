import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { ReportType } from '@/types/report/report.enum';
import { IOnePdfResponseModel } from '@/types/report/report.response';

export class ReportService extends BaseService {
  static sname: VoxServices = 'report';

  static async download_one_module_pdf(data: {
    structure: any;
    user?: any;
    company?: any;
    responseId?: string;
    type: ReportType;
  }) {
    const model: IMakeRequest = {
      url: ['generate-report', 'download_one_module_pdf'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IOnePdfResponseModel>(this.sname, model);
  }
}
