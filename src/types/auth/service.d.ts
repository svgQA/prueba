import { IOption } from '@/components/common/multi/interface';
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
  companies?: IOption[];
  readonly cardId?: string;
  readonly cardType?: CARD_ID_TYPE;
  readonly roles?: IOption[]
  extraData?: IExtraData;
}
export interface IExtraData {
  country?: IOption;
  state?: IOption;
  city?: IOption;
  area?: IOption;
  sucursal?: string;
  job?: string;
}

export interface IRelationCompany {
  id: number;
  company: {
    id: number;
    name: string;
  };
}

export interface IRelationRole {
  role: {
    id: number;
    name: string;
  }
}

export interface IUserResponse extends IUserRequest {
  id: number;
  playerId?: string;
  hasNotifications?: boolean;
  responses?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  companies: IRelationCompany[];
  roles: IRelationRole[];
}

export interface IJwtPayload {
  auth_time: number;
  client_id: string;
  'custom:tenant': string;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  origin_jti: string;
  scope: string;
  sub: string;
  token_use: string;
  username: string;
}
