import { AllowedAreaTypes, AllowedFileTypes } from '..';

export interface IPresignedRequest {
  name: string;
  type: AllowedFileTypes;
  uuid: string;
  area?: AllowedAreaTypes;
}

export interface IPresignedResponse {
  name: string;
  url: string;
}
