export interface ICCompanyRequest {
  name: string;
  description: string;
  address?: string;
  logo?: string;
}

export interface IUCompanyRequest
  extends Omit<ICCompanyRequest, 'name' | 'description'> {
  name?: string;
  description?: string;
}

export interface ICompanyResponse {
  id: number;
  name: string;
  description: string;
  address?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: number | null;
  editedBy: number | null;
  deletedBy: number | null;
  externalId: string;
}
