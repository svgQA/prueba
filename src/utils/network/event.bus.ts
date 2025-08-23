import { IBaseSSE, SSE_TYPE } from './sse/base';

type Listener = (event: IBaseSSE) => void;
const listeners = new Map<string, Listener[]>();

export class EventBus {
  static emit = (type: SSE_TYPE, event: IBaseSSE) => {
    for (const listener of listeners.get(type) || []) {
      listener(event);
    }

    for (const listener of listeners.get(SSE_TYPE.ALL) || []) {
      listener(event);
    }
  };

  static on = (type: SSE_TYPE, listener: Listener) => {
    const result = listeners.get(type) || [];
    listeners.set(type, [...result, listener]);
  };

  static off = (type: SSE_TYPE, listener: Listener) => {
    const result = listeners.get(type) || [];
    listeners.set(
      type,
      result.filter((l) => l !== listener)
    );
  };

  // static on = (listener: Listener) => {
  //   const result = listeners.get('default') || [];
  //   listeners.set('default', [...result, listener]);
  // }

  // static off = (listener: Listener) => {
  //   listeners.delete(listener);
  // }
}
