import { IFormat } from './form';
import { ACTIVITY_STATUS, ACTIVITY_TYPE } from './shift.enum';

export interface IActivityRequest {
  start: Date;
  end: Date;
  status: ACTIVITY_STATUS;
  type: ACTIVITY_TYPE;
  assigned?: boolean;
  resourceId?: string;
  resource?: unknown;
  extraData?: unknown;
  keywords?: string[];
  externalId?: string;
}

export interface IActivityResponse extends IActivityRequest {
  id: number;
  checkIn?: unknown;
  checkOut?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
