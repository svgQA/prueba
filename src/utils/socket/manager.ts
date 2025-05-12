import { ToastManager } from '../toast/toast-manager';
import { IMessage, IWebSocketManager } from './interface';

type NamedListener = {
  name: string;
  callback: (data: any) => void;
};

export class WebSocketManager implements IWebSocketManager {
  private listeners: Set<NamedListener> = new Set();
  private ws: WebSocket | null = null;
  private url: string = '';

  constructor() {
    this.listeners = new Set();
  }

  close() {
    this.ws?.close();
  }

  connect(url?: string) {
    if (this.ws) {
      ToastManager.warning('WebSocket ya está conectado.');
      return;
    }

    if (!this.url && url) {
      this.url = url;
    }

    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        ToastManager.success('WebSocket conectado.');
      };

      this.ws.onmessage = (event) => {
        try {
          const message: IMessage = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener.callback(message));
        } catch (e) {
          ToastManager.error('No allow connect with message');
        }
      };

      this.ws.onclose = () => {
        ToastManager.warning('WebSocket desconectado. Intentando reconectar.');
        this.ws = null;
        // setTimeout(() => this.connect(), 5000);
      };

      this.ws.onerror = (_) => {
        ToastManager.error('Error en WebSocket');
      };
    } catch {
      ToastManager.error('Cannot connect with socket server');
    }
  }

  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg =
        typeof message === 'string' ? message : JSON.stringify(message);
      this.ws.send(msg);
    } else {
      ToastManager.error(
        'No se puede enviar el mensaje. WebSocket no está conectado.'
      );
    }
  }

  addListener(name: string, callback: (data: any) => void) {
    const existingListener = Array.from(this.listeners).find(
      (l) => l.name === name
    );
    if (existingListener) {
      this.listeners.delete(existingListener);
    }
    this.listeners.add({ name, callback });
  }

  removeListener(name: string) {
    const listener = Array.from(this.listeners).find((l) => l.name === name);
    if (listener) {
      this.listeners.delete(listener);
    }
  }
}
