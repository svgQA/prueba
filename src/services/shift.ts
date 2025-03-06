import { User } from '@/components/compose/gantt/types/public-types';
import { IPagination } from '@/types';
import { IShiftResponse } from '@/types/shift/activity';
// import { IPlaceRequest, IRoundRequest, IShiftRequest } from '@/types/shift';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  VoxServices,
  REQUEST_METHODS,
} from '@/utils/network/types';

interface IPaginationPlace extends IPagination {
  contractId?: number;
  projectId?: number;
}

interface IPaginationRound extends IPagination {
  placeId?: number;
}

interface IPagintationGantt extends IPagination {
  start: string;
  end?: string;
}

export class ShiftService extends BaseService {
  static name: VoxServices = 'shift';
  static async get_all(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['activity'],
      params: params as any,
    };
    return await super.make_request<IShiftResponse>(this.name, model);
  }

  static async get_gantt(
    params: IPagintationGantt = {
      page: 1,
      items: 10,
      start: new Date().toISOString(),
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
    return await super.make_request<any>(this.name, model);
  }

  static async updatePlace(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['place', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getPlaces(params: IPaginationPlace = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['place'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }
  static async getWorkPointsByPlaceId(placeId: number) {
    const model: IMakeRequest = {
      url: ['place/workstation', `${placeId}`],
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getProjects(params: IPagination = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['contract'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getDepartments(params: IPagination = { page: 1, items: 50 }) {
    const model: IMakeRequest = {
      url: ['place/departments'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getMunicipalities(
    id: string,
    params: IPagination = { page: 1, items: 50 }
  ) {
    const model: IMakeRequest = {
      url: ['place/municipalities', id],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createRound(data: any) {
    const model: IMakeRequest = {
      url: ['round'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getRounds(params: IPaginationRound = { page: 1, items: 20 }) {
    const model: IMakeRequest = {
      url: ['round'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async deletePlace(id: string) {
    const model: IMakeRequest = {
      url: ['place', id],
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
    return await super.make_request<any>(this.name, model);
  }

  static async updateProject(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['contract', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getProject(id: string) {
    const model: IMakeRequest = {
      url: ['contract', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getPlaceById(id: string) {
    const model: IMakeRequest = {
      url: ['place', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createNovelty(data: any) {
    const model: IMakeRequest = {
      url: ['novelty'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async updateNovelty(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async deleteNovelty(id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getNovelty(params: IPagination = { page: 1, items: 20 }) {
    const model: IMakeRequest = {
      url: ['novelty'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getNoveltyById(id: string) {
    const model: IMakeRequest = {
      url: ['novelty', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async updateRound(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['round', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
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
    return await super.make_request<any>(this.name, model);
  }

  static async getWorkPointById(id: number) {
    const model: IMakeRequest = {
      url: ['place/workstationid', `${id}`],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createActivity(data: any) {
    const model: IMakeRequest = {
      url: ['activity'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async updateActivity(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['activity', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async deleteActivity(id: string) {
    const model: IMakeRequest = {
      url: ['activity', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getActivities(params: IPagination = { page: 1, items: 20 }) {
    const model: IMakeRequest = {
      url: ['activity'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getActivityById(id: string) {
    const model: IMakeRequest = {
      url: ['activity', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createTask(data: any) {
    const model: IMakeRequest = {
      url: ['task'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async updateTask(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async deleteTask(id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getTasks(params: IPagination = { page: 1, items: 20 }) {
    const model: IMakeRequest = {
      url: ['task'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getTaskById(id: string) {
    const model: IMakeRequest = {
      url: ['task', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createSchedule(data: any) {
    const model: IMakeRequest = {
      url: ['schedule'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async updateSchedule(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['schedule', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async deleteSchedule(id: string) {
    const model: IMakeRequest = {
      url: ['schedule', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getSchedules(params: IPagination = { page: 1, items: 20 }) {
    const model: IMakeRequest = {
      url: ['schedule'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getScheduleById(id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createService(data: any) {
    const model: IMakeRequest = {
      url: ['service'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async updateService(data: any, id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async deleteService(id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request(this.name, model);
  }

  static async getServices(params: IPagination = { page: 1, items: 20 }) {
    const model: IMakeRequest = {
      url: ['service'],
      params: params as any,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getServiceById(id: string) {
    const model: IMakeRequest = {
      url: ['service', id],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<any>(this.name, model);
  }
}
