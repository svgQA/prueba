import { type IOption } from '@/components/common/multi/interface';
import { FormValues } from '@/components/compose/gantt/components/gantt/replicate.modal';
import {
  type User,
  ViewMode,
} from '@/components/compose/gantt/types/public-types';
import { type IPagination } from '@/types';
import {
  type IShiftSetting,
  type IShiftSettingResponse,
} from '@/types/settings';
import { type IShiftResponse } from '@/types/shift/activity';
import {
  ICheckRequest,
  type ICScheduleRequest,
} from '@/types/shift/shift.request';
import {
  type IDepartmentResponse,
  type IMunicipalityResponse,
} from '@/types/shift/shift.response';
import { type ICountryResponse } from '@/types/user/user.response';
import { BaseService } from '@/utils/network';
import {
  type IMakeRequest,
  VoxServices,
  REQUEST_METHODS,
} from '@/utils/network/types';
import {
  type IPaginationPlace,
  type IPaginationRound,
  type IPagintationGantt,
  type IReplicateShift,
} from '@/utils/types/shift.interface';

export type ShiftSummary = {
  total: number;
  in_progress: number;
  completed: number;
};

export class ShiftService extends BaseService {
  static name: VoxServices = 'shift';
  static async get_all(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['activity'],
      params: params as any,
    };
    return await super.make_request<IShiftResponse>(this.name, model);
  }

  static async get_shift(id: string | number) {
    const model: IMakeRequest = {
      url: ['activity', String(id)],
    };
    return await super.make_request<IShiftResponse>(this.name, model);
  }

  static async set_replicate(data: IReplicateShift) {
    const model: IMakeRequest = {
      url: ['activity', 'replicate'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

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

  static async createPlace(data: any) {
    const model: IMakeRequest = {
      url: ['place'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updatePlace(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['place', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async getPlaces(params: IPaginationPlace = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['place'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getWorkPointsByPlaceId(placeId: number) {
    const model: IMakeRequest = {
      url: ['place/workstation', `${placeId}`],
    };
    return await super.make_request(this.name, model);
  }

  static async getProjects(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['contract'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getDepartments(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['place/departments'],
      params: params as any,
    };
    return await super.make_request<IDepartmentResponse>(this.name, model);
  }

  static async getCountries(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['place/countries'],
      params: params as any,
    };
    return await super.make_request<ICountryResponse>(this.name, model);
  }

  static async getMunicipalities(
    id: number,
    params: IPagination = { page: 1, items: 400 }
  ) {
    const model: IMakeRequest = {
      url: ['place/municipalities', `${id}`],
      params: params as any,
    };
    return await super.make_request<IMunicipalityResponse>(this.name, model);
  }

  static async createRound(data: any) {
    const model: IMakeRequest = {
      url: ['round'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async getRounds(params: IPaginationRound = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['round'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async deletePlace(id: string) {
    const model: IMakeRequest = {
      url: ['place', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteShift(id: string) {
    const model: IMakeRequest = {
      url: ['activity', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteProject(id: string) {
    const model: IMakeRequest = {
      url: ['contract', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async createProject(data: any) {
    const model: IMakeRequest = {
      url: ['contract'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateProject(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['contract', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async getProject(id: string) {
    const model: IMakeRequest = {
      url: ['contract', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async getPlaceById(id: string) {
    const model: IMakeRequest = {
      url: ['place', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async createNovelty(data: any) {
    const model: IMakeRequest = {
      url: ['novelty'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateNovelty(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteNovelty(id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getNovelty(params: IPagination = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['novelty'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getNoveltyById(id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async updateRound(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['round', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteRound(id: string) {
    const model: IMakeRequest = {
      url: ['round', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getRoundById(id: string) {
    const model: IMakeRequest = {
      url: ['round', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async getWorkPointById(id: number) {
    const model: IMakeRequest = {
      url: ['place/workstationid', `${id}`],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  /**
   * Gets a summary of shifts including total count, in progress and completed
   * @returns Summary object with total, progress and completed counts
   */
  static async getShiftSummary() {
    const model: IMakeRequest = {
      url: ['activity/summary'],
      method: REQUEST_METHODS.GET,
    };

    return await super.make_request<ShiftSummary>(this.name, model);
  }

  static async createActivity(data: any) {
    const model: IMakeRequest = {
      url: ['activity'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }
  static async updateActivity(data: any, id: string | number) {
    const model: IMakeRequest = {
      url: ['activity', String(id)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteActivity(id: string | number) {
    const model: IMakeRequest = {
      url: ['activity', String(id)],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getActivities(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['activity'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getActivityById(id: string) {
    const model: IMakeRequest = {
      url: ['activity', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async createTask(data: any) {
    const model: IMakeRequest = {
      url: ['task'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateTask(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteTask(id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getSimpleList() {
    const model: IMakeRequest = {
      url: ['task', 'simple', 'list'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getTasks(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['task'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getTaskById(id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async createSchedule(data: ICScheduleRequest) {
    const model: IMakeRequest = {
      url: ['schedule'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateSchedule(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['schedule', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteSchedule(id: string) {
    const model: IMakeRequest = {
      url: ['schedule', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getSchedules(params: IPagination = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['schedule'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getScheduleById(id: string) {
    const model: IMakeRequest = {
      url: ['schedule', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<ICScheduleRequest>(this.name, model);
  }

  static async createService(data: any) {
    const model: IMakeRequest = {
      url: ['service'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async updateService(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async deleteService(id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getServices(params: IPagination = { page: 1, items: 500 }) {
    const model: IMakeRequest = {
      url: ['service'],
      params: params as any,
    };
    return await super.make_request(this.name, model);
  }

  static async getServicesSimpleList() {
    const model: IMakeRequest = {
      url: ['service', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getServiceById(id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }

  static async getShiftSetting() {
    const model: IMakeRequest = {
      url: ['module'],
      params: {
        type: 'SHIFT',
      },
    };
    return await super.make_request<IShiftSettingResponse>(this.name, model);
  }

  static async setShiftSetting(data: IShiftSetting) {
    const model: IMakeRequest = {
      url: ['module/shift'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IShiftSettingResponse>(this.name, model);
  }

  static async getListService() {
    const model: IMakeRequest = {
      url: ['service', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async setReplicateV2(data: FormValues) {
    const model: IMakeRequest = {
      url: ['activity', 'replicate', 'v2'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }

  static async createCheck(data: ICheckRequest, shiftId: number) {
    const model: IMakeRequest = {
      url: ['activity', `${shiftId}`, 'check'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request(this.name, model);
  }
}
