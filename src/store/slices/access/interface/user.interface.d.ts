export interface IUser {
  id: string;
  name: string;
  phone: string;
  address: string;
  cognito: string;
  // created_at: string;
  // updated_at: string;
  // deleted_at: null | string;
  companies: CompanyRelation[];
}

interface CompanyRelation {
  company: Company;
  company_id: string;
  user: null | User;
  user_id: string;
  type: string;
}

interface Company {
  id: string;
  name: string;
  nit: string;
  address: string;
  type: string;
  services: string[];
  tenant: Tenant;
  tenant_id: string;
  users: null | User[];
}

interface Tenant {
  id: string;
  name: string;
  status: string;
  // created_at: string;
  // updated_at: string;
  instance: null | any;
  instance_id: string;
  modules: null | any;
  companies: null | Company[];
}

interface User {
  // Define User properties here if needed
}
