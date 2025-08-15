import { IUserRequest } from '@/types/auth';

export interface IAccess {
  id: number;
  name: string;
  companyId: number;
  userId: number;
  user: IUserAccess;
  checkIn: ICheckInAccesses | null;
  checkOut: ICheckOutAccesses | null;
  observations: string | null;
  plate: string | null;
  entryType: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: ICreatedBy | null;
  editedBy: IEditedBy | null;
  deletedBy: IDeletedBy | null;
}

export interface ICheckInAccesses {
  time: string;
  house: string;
  signature: string | null;
  personName: string;
}

export interface ICheckOutAccesses {
  time: string;
  house: string;
  signature: string | null;
  personName: string;
}

export interface IUserAccess {
  name: string;
  extraData: {
    preferences: string;
  };
}

export interface ICreatedBy {
  id: number;
  name: string;
}

export interface IEditedBy {
  id: number;
  name: string;
}

export interface IDeletedBy {
  id: number;
  name: string;
}
