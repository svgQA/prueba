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
