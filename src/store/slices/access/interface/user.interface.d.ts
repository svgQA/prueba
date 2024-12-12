export interface ICompany {
  id: string;
  name: string;
  nit: string;
  tenant_id: string;
  type: string;
  selected?: boolean;
  role: string;
}

export interface IUser {
  id: string;
  name: string;
  phone: string;
  address: string;
  cognito: string;
  token: string;
}
