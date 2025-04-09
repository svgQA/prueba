import { IOption } from '@/components/common/multi/interface';
import { IPagination } from '@/types';
import { IUserRequest, IUserResponse } from '@/types/auth';
import { IDocumentType } from '@/types/user/reponse';
import { BaseService } from '@/utils/network';

import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export enum USER_TYPE {
  USER = 'USER',
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

interface IPaginationUser extends IPagination {
  userType?: USER_TYPE;
}

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

  static async get_all(params: IPaginationUser = { page: 1, items: 10 }) {
    const model: IMakeRequest = {
      url: ['user'],
      params: params as any,
    };
    return await super.make_request<IUserResponse>(this.name, model);
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
    return await super.make_request<IDocumentType[]>(this.name, model);
  }
}
