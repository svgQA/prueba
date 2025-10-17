export interface IListRoleResponse {
  id: number;
  name: string;
  description: string;
}

export interface ICreateRoleResponse {
  status: boolean;
  message: string;
}

export interface RolePermission {
  permissionId: number;
  roleId: number;
}

export interface IRoleByIdResponse {
  id: number;
  name: string;
  description: string;
  permissions: RolePermission[];
}

export interface IDeleteRoleResponse {
  status: boolean;
  resultDelete: any;
  message: string;
}

export interface IListModuleResponse {
  id: number;
  name: string;
  description: string;
  key: string;
  level: number;
  permissions: IPermission[];
  permissionsGrouped?: GroupedPermissions;
}

export interface GroupedPermissions {
  flat: Permission[];
  tree: PermissionTree[];
}

export interface IPermission {
  id: number;
  name: string;
  description: string;
  moduleId: number;
  key: string;
  level: number;
  mobile: boolean;
}

interface IPermissionSec {
  [module: string]: {
    name: string;
    label: string;
    permissions: { [key: string]: string };
  };
}
