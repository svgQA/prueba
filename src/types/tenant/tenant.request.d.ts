export interface ISettingModuleUser {
  id?: number;
  type: string;
  title: string;
  description: string;
  settings: ISettingUser;
}

export interface ISettingUser {
  company: boolean;
  area: boolean;
}

export interface IUserAreaRequest {
  name: string;
  description?: string;
  companyId: number;
}

export interface IUserResidenceRequest {
  type?: IOption;
  houseNumber: string; // ej. "12B", "101", "T3-402"
  block?: string; // opcional: torre/manzana/bloque
  placeId: number; // conjunto (Place) al que pertenece
  userId: number; // usuario asignado a la casa
  floor?: number;
}

export interface ICSuperTenantRequest {
  name: string;
  description: string;
  manager_name?: string;
  manager_email?: string;
  manager_phone?: string;
  external_id?: string;
  platform_external_id?: string;
  email: string;
  phone: string;
  password: string;
}
