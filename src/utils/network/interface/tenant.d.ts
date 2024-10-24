import { type IBase } from './general';

export interface IModule extends IBase {}
export interface ITenant extends IBase {
  modules: IModule[];
}

export interface IInstance extends IBase {
  url: string;
  port: number;
  database: string;
  password: string;
  user: string;
  status: boolean;
  host: string;
  count: number;
}

export interface IOwner extends IBase {
  phone: string;
  address: string;
}
