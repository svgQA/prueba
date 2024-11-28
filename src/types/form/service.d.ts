import { IOption } from '@/components/common/interface';
import { IFormat } from './form';

export interface IFormRequest {
  title: string;
  structure: IFormat;
  description: string;
  category?: string;
}

export interface IFormResponse extends IFormRequest {
  id: number;
  responses?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IListRequest {
  name: string;
  structure: IOption[];
}

export interface IListResponse extends IListRequest {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
