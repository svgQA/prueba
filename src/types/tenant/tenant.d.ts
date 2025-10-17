export interface IModule {
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITenant {
  name: string;
  created_at: string;
  updated_at: string;
  modules: IModule[];
}

export interface IInstance {
  url: string;
  port: number;
  database: string;
  password: string;
  user: string;
  status: boolean;
  name: string;
  host: string;
  id: string;
  count: number;
  createdAt: string;
  updatedAt: string;
  tenants: ITenant[];
}
