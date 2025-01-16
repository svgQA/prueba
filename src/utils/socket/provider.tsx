import { useContext, useEffect } from 'preact/hooks';
import { WebSocketManager } from './manager';
import { WebSocketContext } from './context';
import { IWebSocketManager } from './interface';

const wsManager = new WebSocketManager();
export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useEffect(() => {
    return () => wsManager.close();
  }, []);

  return (
    <WebSocketContext.Provider value={wsManager}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): IWebSocketManager => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket debe usarse dentro de un WebSocketProvider.');
  }
  return context;
};
