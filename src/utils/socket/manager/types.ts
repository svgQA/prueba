export enum SOCKET_MESSAGE_AREA {
  TRACKING = 'TRACKING',
  MEMOS = 'MEMOS',
  CHAT = 'CHAT',
}
export type OutSocketMessage = {
  area: SOCKET_MESSAGE_AREA;
  message: any;
};

export type InSocketMessage<T = any> = {
  from: {
    type: 'web' | 'movil';
    tenant: string;
    company: string;
    area: SOCKET_MESSAGE_AREA;
  };
  payload: T;
};
