export interface IAppSetting {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  iconApp: string;
  logo: string;
  availableActivity: boolean;
}

export interface IShiftSetting {
  name: string;
  time_checkin_min: number;
  time_checkin_max: number;
  time_checkout_min: number;
  time_checkout_max: number;
  distance_checkin_max: number;
  distance_checkout_max: number;
  allow_shift: boolean;
  allow_service: boolean;
  allow_contract: boolean;
  allow_round: boolean;
  allow_task: boolean;
  create_shift: boolean;
}

export interface IUserSetting {
  id: number;
  name: string;
  allow_areas: boolean;
  allow_roles: boolean;
  allow_users: boolean;
  allow_groups: boolean;
  allow_departments: boolean;
  allow_positions: boolean;
  allow_permissions: boolean;
  allow_update_password: boolean;
  allow_update_profile: boolean;
}
export interface IShiftSettingResponse {
  id: number;
  type: string;
  title: string;
  description: string;
  settings: IShiftSetting;
}

interface IModuleSetting {
  id: number;
  type: string;
  title: string;
  description: string;
}

export enum LANGUAGE {
  ENGLISH = 'en',
  SPANISH = 'es',
}

export enum TIME_ZONE {
  UTC = 'UTC',
  AMERICA = 'America',
  EUROPE = 'Europe',
  ASIA = 'Asia',
  AFRICA = 'Africa',
}

export enum CURRENCY {
  USD = 'USD',
  EUR = 'EUR',
  COP = 'COP',
}

export interface IGeneralSetting {
  id: number;
  multicompany: boolean;
  modules: IModuleSetting[];
  language: LANGUAGE;
  time_zone: TIME_ZONE;
  currency: CURRENCY;
  date_format: string;
  logo: string;
}
