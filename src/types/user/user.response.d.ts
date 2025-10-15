export interface IDocumentTypeResponse {
  id: number;
  name: string;
  code: string;
}

interface IDeleteUserResponse {
  ok: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ICountryResponse {
  id: number;
  name: string;
  iso2Code: string;
  iso3Code: string;
}

export interface IUserAreaResponse {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdBy: string;
  editedBy: string;
  deletedBy: string;
}

export interface IUserResidenceResponse {
  id: number;
  houseNumber: string;
  block?: string | null;
  placeId: number;
  userId: number;
  companyId: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  createdBy: string;
  editedBy: string;
  deletedBy: string;
}

export interface IClientResponse {
  id: number;
  name: string;
  description: string;
  email: string;
  phone: string;
}
