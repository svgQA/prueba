export interface IPagination {
  page: number;
  items: number;
}

export type AllowedAreaTypes = 'form' | 'memo';

export type AllowedAudioTypes =
  | 'audio/mp3'
  | 'audio/wav'
  | 'audio/midi'
  | 'audio/ogg'
  | 'audio/3gpp'
  | 'audio/aac'
  | 'audio/m4a'
  | 'audio/mpeg';

export type AllowedDocumentTypes =
  | 'text/csv'
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.ms-excel'
  | 'text/plain';

export type AllowedImageTypes = 'image/jpeg' | 'image/png' | 'image/svg+xml';

export type AllowedVideoTypes = 'video/mpeg' | 'video/ogg' | 'video/3gpp';
