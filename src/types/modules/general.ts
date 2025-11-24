import { LANGUAGE } from '../settings';

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

interface IModuleSetting {
  id: number;
  type: string;
  title: string;
  description: string;
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
