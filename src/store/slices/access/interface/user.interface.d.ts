export interface ICompany {
  id: string;
  name: string;
  nit: string;
  tenant_id: string;
  type: string;
  selected?: boolean;
}

export interface IUser {
  id: string;
  name: string;
  phone: string;
  address: string;
  cognito: string;
}
