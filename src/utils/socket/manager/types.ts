export enum SOCKET_MESSAGE_AREA {
  TRACKING = 'TRACKING',
  MEMOS = 'MEMOS',
  CHAT = 'CHAT',
  PANIC = 'PANIC',
  SHIFTS = 'SHIFTS',
  ACCESS = 'ACCESS',
  CORRESPONDENCE = 'CORRESPONDENCE',
  FORM = 'FORM',
  ALL = 'ALL',
}

export enum SOCKET_MESSAGE_EVENTS {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  UPDATE_CHECK = 'UPDATE_CHECK',
  CREATE_PARENT = 'CREATE_PARENT',
  DELETE = 'DELETE',
  PANIC = 'PANIC',
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

export interface MessageEvent {
  type: string;
  message: any;
  notification?: any;
}

export enum MESSAGE_LISTENERS {
  SHIFTS = 'shift-listener',
  MEMOS = 'memo-listener',
  PANIC = 'panic-listener',
  ACCESS = 'access-listener',
  CORRESPONDENCE = 'correspondence-listener',
  TRACKING = 'tracking-listener',
  CHAT = 'chat-listener',
  FORM = 'form-listener',
  MEMO_HISTORY = 'memo-history',
  ALL = 'all-listener',
}
