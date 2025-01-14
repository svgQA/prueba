export interface IMessage {
  from: string;
  to: string;
  message: any;
}

export interface IWebSocketManager {
  connect: (url?: string) => void;
  sendMessage: (message: any) => void;
  addListener: (name: string, callback: (data: IMessage) => void) => void;
  removeListener: (name: string) => void;
}
