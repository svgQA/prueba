import {
  AllowedAreaTypes,
  AllowedAudioTypes,
  AllowedDocumentTypes,
  AllowedImageTypes,
  AllowedVideoTypes,
} from '..';

export interface IPresignedRequest {
  name: string;
  type:
    | AllowedImageTypes
    | AllowedDocumentTypes
    | AllowedAudioTypes
    | AllowedVideoTypes;
  uuid: string;
  area?: AllowedAreaTypes;
  icon?: string;
  file?: string;
}

export interface IPresignedResponse {
  name: string;
  url: string;
}
