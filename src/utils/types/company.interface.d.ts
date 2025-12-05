export interface ICCompanyRequest {
  name: string;
  description: string;
  address?: string;
  logo?: string;
  identification: string;
}

export interface IUCompanyRequest extends Omit<
  ICCompanyRequest,
  'name' | 'description' | 'identification'
> {
  name?: string;
  description?: string;
  identification?: string;
}

export interface ICompanyResponse {
  id: number;
  name: string;
  description: string;
  address?: string;
  logo?: string;
  identification: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: number | null;
  editedBy: number | null;
  deletedBy: number | null;
  externalId: string;
}
