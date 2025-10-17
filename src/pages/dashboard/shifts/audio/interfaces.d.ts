export interface IJanusSettings {
  display?: string;
  muted?: boolean;
  record?: boolean;
  filename?: string;
  bitrate?: number;
  expected_loss?: number;
  group?: any;
  jsep?: any;
}

export interface IParticipant {
  feed: string;
  display: string;
  audioStream: MediaStream | null;
}
