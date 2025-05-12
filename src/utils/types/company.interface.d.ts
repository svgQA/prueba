export interface ICCompanyRequest {
  name: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
}

export interface IUCompanyRequest {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
}

export interface ICompanyResponse {
  id: number;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: number | null;
  editedBy: number | null;
  deletedBy: number | null;
  externalId: string;
}
