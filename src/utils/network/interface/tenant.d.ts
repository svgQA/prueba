import { type IBase } from './general';

export interface IModule extends IBase {}
export interface ITenant extends IBase {
  status: string;
  modules: IModule[];
}

export interface IInstance extends IBase {
  status: boolean;
  count: number;
  tenants: ITenant[];
}

export interface IOwner extends IBase {
  phone: string;
  address: string;
}
