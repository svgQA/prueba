# WebSocket Manager

Utilidad para manejar conexiones WebSocket en la aplicación Voxline Dashboard. Proporciona una interfaz simple y reactiva para comunicación en tiempo real, con manejo automático de reconexión y gestión de eventos.

## 📦 Características

- Gestión centralizada de conexiones WebSocket
- Sistema de eventos pub/sub para mensajes
- Reconexión automática
- Integración con el sistema de notificaciones
- Provider de React para acceso global
- Tipado completo con TypeScript

## 🚀 Uso Básico

### 1. Configurar el Provider

```typescript
// En el punto de entrada de la aplicación (App.tsx)
import { WebSocketProvider } from '@/utils/socket/provider';

function App() {
  return (
    <WebSocketProvider>
      <YourApp />
    </WebSocketProvider>
  );
}
```

### 2. Usar en Componentes

```typescript
import { useWebSocket } from '@/utils/socket/provider';

function ChatComponent() {
  const ws = useWebSocket();

  useEffect(() => {
    // Conectar al WebSocket
    ws.connect('wss://api.example.com/ws');

    // Suscribirse a mensajes
    ws.addListener('chat', (message) => {
      console.log('Nuevo mensaje:', message);
    });

    // Limpiar al desmontar
    return () => {
      ws.removeListener('chat');
      ws.close();
    };
  }, []);

  const sendMessage = (text: string) => {
    ws.sendMessage({
      type: 'chat',
      content: text
    });
  };

  return (/* ... */);
}
```

## 🎨 API del WebSocket Manager

### Conexión

```typescript
// Conectar a un WebSocket
ws.connect('wss://api.example.com/ws');

// Cerrar conexión
ws.close();
```

### Mensajes

```typescript
// Enviar mensaje
ws.sendMessage({
  type: 'chat',
  content: 'Hola mundo',
});

// O como string
ws.sendMessage('Hola mundo');
```

### Eventos

```typescript
// Suscribirse a eventos
ws.addListener('chat', (message) => {
  console.log('Mensaje recibido:', message);
});

// Remover listener
ws.removeListener('chat');
```

## ⚙️ Tipos de Mensajes

```typescript
interface IMessage {
  type: string;
  data?: any;
  error?: string;
}

// Ejemplo de mensaje
const message: IMessage = {
  type: 'shift_update',
  data: {
    shiftId: 123,
    status: 'completed',
  },
};
```

## 🎯 Casos de Uso Comunes

### 1. Chat en Tiempo Real

```typescript
function ChatRoom() {
  const ws = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    ws.connect('wss://api.example.com/chat');

    ws.addListener('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      ws.removeListener('message');
      ws.close();
    };
  }, []);

  const sendChatMessage = (text: string) => {
    ws.sendMessage({
      type: 'message',
      data: { text, timestamp: Date.now() },
    });
  };
}
```

### 2. Actualizaciones de Turnos

```typescript
function ShiftMonitor() {
  const ws = useWebSocket();

  useEffect(() => {
    ws.connect('wss://api.example.com/shifts');

    ws.addListener('shift_update', (update) => {
      // Actualizar estado del turno
      updateShiftStatus(update.data);
    });

    return () => {
      ws.removeListener('shift_update');
      ws.close();
    };
  }, []);
}
```

### 3. Notificaciones en Tiempo Real

```typescript
function NotificationCenter() {
  const ws = useWebSocket();

  useEffect(() => {
    ws.connect('wss://api.example.com/notifications');

    ws.addListener('notification', (notification) => {
      // Mostrar notificación al usuario
      showNotification(notification.data);
    });

    return () => {
      ws.removeListener('notification');
      ws.close();
    };
  }, []);
}
```

## 📝 Mejores Prácticas

1. **Conexión**
   - Conectar solo cuando sea necesario
   - Cerrar conexiones al desmontar componentes
   - Manejar reconexiones apropiadamente

2. **Eventos**
   - Usar nombres de eventos descriptivos
   - Limpiar listeners al desmontar
   - Evitar duplicación de listeners

3. **Mensajes**
   - Mantener mensajes pequeños y enfocados
   - Usar tipos consistentes
   - Incluir timestamps cuando sea relevante

4. **Manejo de Errores**
   - Implementar reconexión automática
   - Mostrar feedback al usuario
   - Registrar errores para debugging

## ⚠️ Consideraciones

1. **Rendimiento**
   - Limitar número de conexiones simultáneas
   - Limpiar listeners no utilizados
   - Manejar reconexiones eficientemente

2. **Seguridad**
   - Usar WSS (WebSocket Secure)
   - Validar mensajes entrantes
   - Implementar autenticación cuando sea necesario

3. **Estado de la Conexión**
   - Mostrar indicador de conexión
   - Manejar desconexiones graciosamente
   - Proporcionar feedback al usuario

4. **Compatibilidad**
   - Verificar soporte de WebSocket
   - Proporcionar fallback cuando sea necesario
   - Manejar diferentes formatos de mensaje
