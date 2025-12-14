export interface ICResourceResponse {
  id?: number;
  name: string;
  description: string;
  type: RESOURCE_TYPE;
  image?: string;
  icon?: string;
  groups?: number[];
  lat?: number;
  lng?: number;
  code?: string;
  address?: string;
}
