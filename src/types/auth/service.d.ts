import { IFormat } from './form';

export interface IUserRequest {
  title: string;
  structure: IFormat;
  description: string;
  category?: string;
}

export interface IUserResponse extends IUserRequest {
  id: number;
  responses?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
