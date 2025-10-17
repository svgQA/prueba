export interface ICheckRequest {
  latitude: string;
  longitude: string;
  date: string;
  platform: string;
  type: string;
  file?: {
    name: string;
    type: string;
    uuid: string;
  };
}

export interface IResourceRequest {
  id?: number;
  name: string;
  type: string;
  description: string;
  image?: string;
  icon?: string;
  link?: string;
  groups?: number[];
}
