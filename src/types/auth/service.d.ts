import { IFormat } from './form';

interface IUser {
  readonly cognitoId: string;
}

export interface IUserRequest extends IUser {
  readonly id?: number;
  readonly externalId?: string;
  readonly externalPlatformId?: string;
  readonly userType?: string;
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly address: string;
  readonly image?: string;
  readonly phone?: string;

  readonly cardId?: string;
  readonly cardType?: CARD_ID_TYPE;
  extraData?: IExtraData;
}

export interface IExtraData {
  country: string;
  state: string;
  city: string;
  job: string;
  area: string;
  sucursal: string;
  company: string;
}

export interface IUserResponse extends IUserRequest {
  id: number;
  responses?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
