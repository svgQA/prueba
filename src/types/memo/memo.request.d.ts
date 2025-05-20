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
