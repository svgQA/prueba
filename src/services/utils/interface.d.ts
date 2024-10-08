import { REQUEST_METHODS } from './constants';

export interface IModelRequest {
  data?: any;
  params?: any;
  headers?: any;
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
