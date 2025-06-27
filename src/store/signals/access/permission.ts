import { signal } from "@preact/signals";

interface IPermission {
  name: string;
  permissions: { [key: string]: string };
}
const currentPermissions = signal<{ [key: string]: string }>({});
const allPermissions = signal<IPermission[]>([]);


export const getCurrentPermissions = () => {
  return currentPermissions.value;
};

export const setCurrentPermissionsByName = (name: string) => {
  if(allPermissions.value.length === 0) return;

  const permiso = allPermissions.value.find((permission) => permission.name === name);
  currentPermissions.value = permiso?.permissions || {};

  console.log('currentPermissions', currentPermissions.value);
};

export const setCurrentPermissionsBySubName = (subName: string) => {
  if(allPermissions.value.length === 0) return;

  console.log('subName', subName);
};

export const clearCurrentPermissions = () => {
  currentPermissions.value = {};
};

export const getAllPermissions = () => {
  return allPermissions.value;
};

export const setAllPermissions = (permissions: IPermission[]) => {
  allPermissions.value = permissions;
  console.log('allPermissions', allPermissions.value);
};

export const clearAllPermissions = () => {
  allPermissions.value = [];
};
