import { IWebSocketManager } from './interface';

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
      console.warn('WebSocket ya está conectado.');
      return;
    }

    if (!this.url && url) {
      this.url = url;
    }

    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        console.log('WebSocket conectado.');
      };

      this.ws.onmessage = (event) => {
        this.listeners.forEach((listener) => listener.callback(event.data));
      };

      this.ws.onclose = () => {
        console.warn('WebSocket disconnected. Trying to connect.');
        this.ws = null;
        // setTimeout(() => this.connect(), 10000);
      };

      this.ws.onerror = (error) => {
        console.error('Error en WebSocket:', error);
      };
    } catch {
      console.error('ERROR: Cannot connect with socket server');
    }
  }

  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.error(
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
