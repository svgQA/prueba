import { IOption } from '@/components/common/multi/interface';
import { IPagination } from '@/types';
import {
  IDepartmentResponse,
  IMunicipalityResponse,
} from '@/types/shift/shift.response';
import { ICountryResponse } from '@/types/user/user.response';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { IPaginationPlace } from '@/utils/types/shift.interface';

export class PlaceService extends BaseService {
  static name: VoxServices = 'shift';
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
      url: ['place', 'workstation', `${placeId}`],
    };
    return await super.make_request(this.name, model);
  }

  static async getDepartmentList(countryId: number) {
    const model: IMakeRequest = {
      url: ['place', 'department', 'simple', 'list', `${countryId}`],
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getDepartments(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['place', 'departments'],
      params: params as any,
    };
    return await super.make_request<IDepartmentResponse>(this.name, model);
  }

  static async getSimpleList() {
    const model: IMakeRequest = {
      url: ['place', 'simple', 'list'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async get_simple_list_admin_client() {
    const model: IMakeRequest = {
      url: ['place', 'simple', 'list', 'admin_client'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getCountriesList() {
    const model: IMakeRequest = {
      url: ['place', 'country', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getCountries(params: IPagination = { page: 1, items: 400 }) {
    const model: IMakeRequest = {
      url: ['place', 'countries'],
      params: params as any,
    };
    return await super.make_request<ICountryResponse>(this.name, model);
  }

  static async getMunicipalitieList<T extends IOption>(departmentId: number) {
    const model: IMakeRequest = {
      url: ['place', 'municipality', 'simple', 'list', `${departmentId}`],
    };
    return await super.make_request<T>(this.name, model);
  }

  static async getMunicipalities(
    id: number,
    params: IPagination = { page: 1, items: 400 }
  ) {
    const model: IMakeRequest = {
      url: ['place', 'municipalities', `${id}`],
      params: params as any,
    };
    return await super.make_request<IMunicipalityResponse>(this.name, model);
  }

  static async deletePlace(id: string) {
    const model: IMakeRequest = {
      url: ['place', id],
      method: REQUEST_METHODS.DELETE,
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

  static async getWorkPointById(id: number) {
    const model: IMakeRequest = {
      url: ['place', 'workstationid', `${id}`],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request(this.name, model);
  }
}
