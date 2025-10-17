export interface IMessage {
  from: string;
  to: string;
  message: any;
  replyTo?: number;
}

export interface IWebSocketManager {
  connect: (url?: string) => void;
  sendMessage: (message: any) => void;
  addListener: (name: string, callback: (data: IMessage) => void) => void;
  removeListener: (name: string) => void;
}
