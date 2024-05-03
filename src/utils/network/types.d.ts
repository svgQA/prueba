import { REQUEST_METHODS } from './http-constants';

export interface IMakeRequest extends IModelRequest {
  url: string[];
}

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

export interface IRestData extends IGenericData {
  code: number;
}

export interface IRequestSearch {
  readonly page?: number;
  readonly limit?: number;
}
