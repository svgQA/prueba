export interface IPagination {
  page: number;
  items: number;
}

export type AllowedAreaTypes = 'form' | 'memo';
export type AllowedFileTypes =
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'audio/mp3'
  | 'audio/wav'
  | 'audio/midi'
  | 'audio/ogg'
  | 'audio/3gpp'
  | 'audio/aac'
  | 'video/mpeg'
  | 'video/ogg'
  | 'audio/m4a'
  | 'video/3gpp'
  | 'text/csv'
  | 'application/pdf'
  | 'application/x-tar'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'text/plain';
