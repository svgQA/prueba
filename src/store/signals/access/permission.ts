import { IPermissionSec } from '@/types/role/role.response';
import { signal } from '@preact/signals';

const currentPermissions = signal<{ [key: string]: string }>({});
export const allPermissions = signal<IPermissionSec>({});

export const getCurrentPermissions = () => {
  return currentPermissions.value;
};

export const getAllPermissions = () => {
  return allPermissions.value;
};

export const getPermissionByModule = (name: string) => {
  return allPermissions.value[name].permissions || null;
};

export const getPermissionByModuleState = (name: string, state: string) => {
  return allPermissions.value[name]?.permissions?.[state] || null;
};

export const validateModuleState = (name: string) => {
  return (
    allPermissions.value[name] && allPermissions.value[name].permissions?.state
  );
};

export const validateSettingModuleState = (name: string) => {
  return (
    allPermissions.value.setting &&
    allPermissions.value.setting.permissions[name]
  );
};

export const setAllPermissions = (permissions: IPermissionSec) => {
  allPermissions.value = permissions;
};
