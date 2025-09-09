import { Socket, Channel, Push } from 'phoenix';
import {
  InSocketMessage,
  OutSocketMessage,
  SOCKET_MESSAGE_AREA,
} from './types';
import { tracking_service_url } from '@/env.config';

type NamedListener = {
  name: string;
  callback: { id: string; fn: (data: any) => void }[];
};

export class WebSocketManager {
  private static listeners: Set<NamedListener> = new Set();
  private static socket: Socket | null = null;
  private static channel: Channel | null = null;
  private static t: string;
  private static c: string;
  private static k: string;
  // private static currentTopic: string | null = null;

  static connect(
    tenant: () => string,
    company: () => string | undefined,
    token: () => string,
    url: string = tracking_service_url
  ) {
    const _company = company();
    if (!_company) return;

    this.t = tenant();
    this.c = _company;
    this.k = token();

    const r = `${url}/socket`;
    this.socket = new Socket(r, {
      params: {
        tenant: this.t,
        company: this.c,
        awsToken: this.k,
        type: 'web',
      },
    });

    this.socket.onOpen(() => console.log('[WS] open: ', r));
    this.socket.onError((e: any) => console.warn('[WS] error', e));
    this.socket.onClose(() => console.log('[WS] close'));

    this.socket.connect();

    const topic = `room:web:${this.t}:${this.c}`;
    this.channel = this.socket.channel(topic);
    // this.currentTopic = topic;

    this.channel
      .join()
      .receive('ok', () => {
        console.log('[WS] joined in room');
      })
      .receive('error', (e: any) => {
        console.warn('[WS] join error', e);
      })
      .receive('timeout', () => {
        console.warn('[WS] join timeout');
      });

    this.channel.on('server_message', (msg: InSocketMessage) => {
      console.log('[WS] server_message:', msg);
      for (const l of this.listeners) {
        if (l.name !== msg.from.area) continue;
        for (const cb of l.callback) {
          cb.fn(msg);
        }
      }
    });

    this.channel.on('server_ack', (msg: InSocketMessage) => {
      console.log('[WS] server_ack:', msg);
    });
  }

  static disconnect() {
    try {
      this.channel?.leave();
      this.socket?.disconnect();
    } finally {
      this.channel = null;
      this.socket = null;
      // this.currentTopic = null;
    }
  }

  static isJoined() {
    return this.channel?.state === 'joined';
  }

  static sendMessage(message: OutSocketMessage) {
    if (!this.channel || this.channel.state !== 'joined') {
      console.warn('[WS] channel not joined; cannot send');
      return false;
    }
    try {
      console.log('[WS] Send: ', message, this.channel.state);
      this.channel.push('msg', message);
      return true;
    } catch (e) {
      console.error('[WS] push error', e);
      return false;
    }
  }

  static sendMessageWithAck<T = any>(
    message: OutSocketMessage,
    timeoutMs = 10000
  ) {
    if (!this.channel || this.channel.state !== 'joined') {
      return Promise.reject(new Error('channel not joined'));
    }
    return new Promise<T>((resolve, reject) => {
      const push: Push = this.channel!.push('msg', message, timeoutMs);
      push
        .receive('ok', (resp: any) => resolve(resp as T))
        .receive('error', (err: any) => reject(err))
        .receive('timeout', () => reject(new Error('push timeout')));
    });
  }

  static add(
    name: SOCKET_MESSAGE_AREA,
    callback: (data: any) => void,
    id: string
  ) {
    console.log(`[WS] Adding listener for area: ${name}`);
    // const existing = Array.from(this.listeners).find((l) => l.name === name);
    // if (existing) this.listeners.delete(existing);
    // this.listeners.add({ name,  callback: { id, fn: callback } });
    const existing = Array.from(this.listeners).find((l) => l.name === name);
    if (existing) {
      existing.callback.push({ id, fn: callback });
    } else {
      this.listeners.add({ name, callback: [{ id, fn: callback }] });
    }
  }

  static remove(name: SOCKET_MESSAGE_AREA, id: string) {
    const existing = Array.from(this.listeners).find((l) => l.name === name);
    if (existing) {
      existing.callback = existing.callback.filter((c) => c.id !== id);
      if (existing.callback.length === 0) {
        this.listeners.delete(existing);
      }
    }
  }
}
