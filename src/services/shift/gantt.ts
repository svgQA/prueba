import { ViewMode } from '@/components/compose/gantt';
import { User } from '@/components/compose/gantt/types/public-types';
import { BaseService } from '@/utils/network';
import { type IMakeRequest, VoxServices } from '@/utils/network/types';
import { type IPagintationGantt } from '@/utils/types/shift.interface';

export class GanttService extends BaseService {
  static name: VoxServices = 'shift';
  static async get_gantt(
    params: IPagintationGantt = {
      page: 1,
      items: 10,
      mode: ViewMode.QuarterDay,
      // start: new Date().toISOString(),
    }
  ) {
    const model: IMakeRequest = {
      url: ['activity', 'gantt'],
      params: params as any,
    };
    return await super.make_request<User>(this.name, model);
  }
}
