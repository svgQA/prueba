import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class ReportService extends BaseService {
  static sname: VoxServices = 'report';

  static async download_one_form_response_public(data: {
    structure: any;
    user?: any;
    company?: any;
    id?: string;
  }) {
    const model: IMakeRequest = {
      url: ['generate-report', 'download_one_form_response_public'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<{
      success: boolean;
      data: {
        filename: string;
        mimeType: string;
        buffer: string;
      };
    }>(this.sname, model);
  }
}
