import { createContext } from 'preact';
import { IWebSocketManager } from './interface';

export const WebSocketContext = createContext<IWebSocketManager | null>(null);
