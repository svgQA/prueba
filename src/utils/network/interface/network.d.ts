import { REQUEST_METHODS } from './network.enum';

export interface IModelRequest {
  data?: any;
  params?: { [key: string]: string | number };
  headers?: { [key: string]: string };
  method?: REQUEST_METHODS;
}

export interface IGenericData {
  code: number;
  message: string;
  data: any;
}

export interface IMakeRequest extends IModelRequest {
  url: string[];
}
