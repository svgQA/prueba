export interface IWebSocketManager {
  connect: (url?: string) => void;
  sendMessage: (message: string) => void;
  addListener: (name: string, callback: (data: any) => void) => void;
  removeListener: (name: string) => void;
}
