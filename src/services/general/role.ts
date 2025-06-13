import { type IPagination } from '@/types';
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';
import {
  IListRoleResponse,
  IDeleteRoleResponse,
  IListModuleResponse,
  ICreateRoleResponse,
  IRoleByIdResponse,
} from '@/types/role/role.response';
import { IRoleRequest } from '@/types/role/role.request';
export class RoleService extends BaseService {
  static name: VoxServices = 'role';
  static async getRoles(params: IPagination = { page: 1, items: 1000 }) {
    const model: IMakeRequest = {
      url: ['role'],
      params: params as any,
    };
    return await super.make_request<IListRoleResponse>(this.name, model);
  }

  static async deleteRole(id: number) {
    const model: IMakeRequest = {
      url: ['role', `${id}`],
      method: REQUEST_METHODS.DELETE,
    };
    return await super.make_request<IDeleteRoleResponse>(this.name, model);
  }

  static async getModulesList() {
    const model: IMakeRequest = {
      url: ['role', 'modules', 'list'],
    };
    return await super.make_request<IListModuleResponse>(this.name, model);
  }

  static async create(data: IRoleRequest) {
    const model: IMakeRequest = {
      url: ['role'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<ICreateRoleResponse>(this.name, model);
  }

  static async update(data: IRoleRequest, id: string) {
    const model: IMakeRequest = {
      url: ['role', id],
      method: REQUEST_METHODS.PUT,
      data,
    };
    return await super.make_request<ICreateRoleResponse>(this.name, model);
  }

  static async getRoleById(id: string) {
    const model: IMakeRequest = {
      url: ['role', id],
    };
    return await super.make_request<IRoleByIdResponse>(this.name, model);
  }

  static async getPermissions() {
    const model: IMakeRequest = {
      url: ['role', 'permissions', '3'],
    };
    return await super.make_request<any>(this.name, model);
  }
}
