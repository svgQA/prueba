import { IOption } from '@/components/common/multi/interface';
import { IPagination } from '@/types';
import { IUserRequest, IUserResponse } from '@/types/auth';

import {
  IDocumentTypeResponse,
  IDeleteUserResponse,
  ICountryResponse,
} from '@/types/user/user.response';
import { BaseService } from '@/utils/network';

import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import { IPaginationUser } from '@/utils/types/user.interface';

export class UserService extends BaseService {
  static name: VoxServices = 'user';
  static async create(data: IUserRequest) {
    const model: IMakeRequest = {
      url: ['user'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async profile() {
    const model: IMakeRequest = {
      url: ['user', 'profile'],
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async createProfile(id: number | string) {
    const model: IMakeRequest = {
      url: ['user', 'profile', String(id), 'create'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async update(data: IUserRequest, id: number) {
    const model: IMakeRequest = {
      url: ['user', String(id)],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async get_all(params: IPaginationUser = { page: 1, items: 250 }) {
    const model: IMakeRequest = {
      url: ['user'],
      params: params as any,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async setProfile(id: number, companyId: string) {
    const model: IMakeRequest = {
      url: ['user', 'setprofile'],
      data: {
        userId: id,
        companyId: companyId,
      },
      method: REQUEST_METHODS.POST,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async getCountries() {
    const model: IMakeRequest = {
      url: ['user', 'countries'],
    };
    return await super.make_request<ICountryResponse>(this.name, model);
  }

  static async delete(id: number) {
    const model: IMakeRequest = {
      url: ['user', `${id}`],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IDeleteUserResponse>(this.name, model);
  }

  static async get_all_employee(
    params: IPagination = { page: 1, items: 1000 }
  ) {
    const model: IMakeRequest = {
      url: ['user', 'employee'],
      params: params as any,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async get_all_clients(params: IPagination = { page: 1, items: 1000 }) {
    const model: IMakeRequest = {
      url: ['user', 'client'],
      params: params as any,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async getMinimalUsers() {
    const model: IMakeRequest = {
      url: ['user', 'minimal'],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<
      {
        id: number;
        name: string;
        email: string;
        cognitoId: string;
        playerId: string | null;
      }[]
    >(this.name, model);
  }

  static async getListUsers() {
    const model: IMakeRequest = {
      url: ['user', 'simple', 'list'],
    };
    return await super.make_request<IOption>(this.name, model);
  }

  static async getDocumentTypes() {
    const model: IMakeRequest = {
      url: ['user', 'documenttypes'],
    };
    return await super.make_request<IDocumentTypeResponse>(this.name, model);
  }

  static async changePassword(
    userId: number,
    newPassword: string,
    confirmPassword: string
  ) {
    const model: IMakeRequest = {
      url: ['auth', 'changepassword'],
      data: { userId, newPassword, confirmPassword },
      method: REQUEST_METHODS.POST,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async createArea(data: { name: string; description?: string }) {
    const model: IMakeRequest = {
      url: ['user', 'area'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getAreas() {
    const model: IMakeRequest = {
      url: ['user', 'area'],
    };
    return await super.make_request<any>(this.name, model);
  }

  static async getArea(id: number) {
    const model: IMakeRequest = {
      url: ['user', 'area', `${id}`],
    };
    return await super.make_request<any>(this.name, model);
  }

  static async updateArea(
    id: number,
    data: { name: string; description?: string }
  ) {
    const model: IMakeRequest = {
      url: ['user', 'area', `${id}`],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<any>(this.name, model);
  }

  static async deleteArea(id: number) {
    const model: IMakeRequest = {
      url: ['user', 'area', `${id}`],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<any>(this.name, model);
  }
}
