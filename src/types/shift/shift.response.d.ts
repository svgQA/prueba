export interface IDepartmentResponse {
  id: number;
  name: string;
  code: string;
}

export interface IMunicipalityResponse {
  id: number;
  name: string;
  code: string;
  latitude?: string;
  longitude?: string;
}
