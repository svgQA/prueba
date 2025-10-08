export interface IPagination {
  page: number;
  items: number;
}

export interface ICustomQuery extends IPagination {
  [key: string]: string | number | boolean | [string, string];
}

export const allowedAreaTypesConst = [
  'form',
  'memo',
  'report',
  'shift',
  'user',
  'trybook',
] as const;

export const allowedAudioTypesConst = [
  'audio/mp3',
  'audio/wav',
  'audio/midi',
  'audio/ogg',
  'audio/3gpp',
  'audio/aac',
  'audio/m4a',
  'audio/mpeg',
] as const;

export const allowedDocumentTypesConst = [
  'text/csv',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'text/plain',
  'application/json',
] as const;

export const allowedImageTypesConst = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
] as const;

export const allowedVideoTypesConst = [
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/3gpp',
] as const;

export type AllowedAreaTypes = (typeof allowedAreaTypesConst)[number];
export type AllowedAudioTypes = (typeof allowedAudioTypesConst)[number];
export type AllowedDocumentTypes = (typeof allowedDocumentTypesConst)[number];
export type AllowedImageTypes = (typeof allowedImageTypesConst)[number];
export type AllowedVideoTypes = (typeof allowedVideoTypesConst)[number];
