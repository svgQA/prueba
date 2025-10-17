# Network Utilities

Utilidades para manejo de red en la aplicación Tryvoo Dashboard. Incluye un sistema de eventos, manejo de SSE (Server-Sent Events) y una base para servicios HTTP.

## 📦 EventBus

Un sistema simple de eventos pub/sub para comunicación entre componentes.

### Uso Básico

```typescript
import { EventBus } from '@/utils/network/event.bus';

// Suscribirse a eventos
const unsubscribe = EventBus.subscribe((event) => {
  console.log('Evento recibido:', event);
});

// Emitir un evento
EventBus.emit({
  id: 'user-login',
  data: { userId: 123 },
});

// Limpiar suscripción
unsubscribe();
```

### Tipos de Eventos

```typescript
type Event = {
  id: string; // Identificador único del evento
  [key: string]: any; // Datos adicionales del evento
};

type Listener = (event: Event) => void;
```

### Casos de Uso Comunes

1. **Notificaciones en Tiempo Real**

```typescript
// En un componente de notificaciones
useEffect(() => {
  const unsubscribe = EventBus.subscribe((event) => {
    if (event.id === 'new-notification') {
      // Actualizar UI con nueva notificación
      setNotifications((prev) => [...prev, event.data]);
    }
  });
  return unsubscribe;
}, []);
```

2. **Actualizaciones de Estado Global**

```typescript
// En un servicio
EventBus.emit({
  id: 'shift-updated',
  data: { shiftId: 123, status: 'completed' },
});

// En un componente
useEffect(() => {
  const unsubscribe = EventBus.subscribe((event) => {
    if (event.id === 'shift-updated') {
      // Actualizar estado del turno
      updateShiftStatus(event.data);
    }
  });
  return unsubscribe;
}, []);
```

## 📡 Server-Sent Events (SSE)

Utilidad para manejar streams de datos del servidor, especialmente útil para respuestas de IA y notificaciones en tiempo real.

### Uso Básico

```typescript
import { streamIAResponse } from '@/utils/network/sse/sse.post';

// En un servicio de IA
const model = {
  url: '/api/ia/query',
  method: 'POST',
  data: JSON.stringify({ query: '¿Cómo estás?' }),
  header: {
    /* headers adicionales */
  },
};

streamIAResponse(
  model,
  (chunk) => {
    // Manejar cada chunk de datos
    console.log('Nuevo chunk:', chunk);
  },
  () => {
    // Stream completado
    console.log('Stream finalizado');
  },
  (error) => {
    // Manejar errores
    console.error('Error en stream:', error);
  }
);
```

### Implementación en Servicios

```typescript
// En un servicio de IA
export class IaService extends BaseService {
  static async streamQuery(query: string) {
    const model: IMakeRequest = {
      url: ['ia', 'query'],
      method: REQUEST_METHODS.POST,
      data: { query },
    };

    return new Promise((resolve, reject) => {
      let response = '';

      streamIAResponse(
        model,
        (chunk) => {
          response += chunk;
          // Opcional: emitir evento de progreso
          EventBus.emit({
            id: 'ia-response-progress',
            data: { chunk, progress: response.length },
          });
        },
        () => resolve(response),
        reject
      );
    });
  }
}
```

## 🏗 BaseService

Clase base para todos los servicios HTTP de la aplicación.

### Uso en Servicios

```typescript
import { BaseService } from '@/utils/network';
import {
  IMakeRequest,
  REQUEST_METHODS,
  VoxServices,
} from '@/utils/network/types';

export class UserService extends BaseService {
  static name: VoxServices = 'user';

  static async create(data: IUserRequest) {
    const model: IMakeRequest = {
      url: ['user'],
      method: REQUEST_METHODS.POST,
      data,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }

  static async getById(id: number) {
    const model: IMakeRequest = {
      url: ['user', id.toString()],
      method: REQUEST_METHODS.GET,
    };
    return await super.make_request<IUserResponse>(this.name, model);
  }
}
```

## 📝 Mejores Prácticas

1. **EventBus**
   - Usar IDs de eventos descriptivos y consistentes
   - Limpiar suscripciones en useEffect
   - Mantener los eventos tipados cuando sea posible
   - Evitar emitir eventos en bucles o eventos frecuentes

2. **SSE**
   - Manejar siempre los casos de error
   - Limpiar streams cuando el componente se desmonte
   - Usar para datos que requieren actualizaciones en tiempo real
   - Considerar el manejo de reconexión para streams largos

3. **Servicios**
   - Extender BaseService para nuevos servicios
   - Usar tipos genéricos para respuestas
   - Mantener la consistencia en el nombramiento de endpoints
   - Manejar errores de red apropiadamente

## 🔄 Flujo de Datos Típico

1. **Notificaciones en Tiempo Real**

```typescript
// 1. Servicio emite evento
NotificationService.sendManualNotification(data).then(() => {
  EventBus.emit({
    id: 'notification-sent',
    data: { success: true },
  });
});

// 2. Componentes escuchan evento
useEffect(() => {
  const unsubscribe = EventBus.subscribe((event) => {
    if (event.id === 'notification-sent') {
      // Actualizar UI
    }
  });
  return unsubscribe;
}, []);
```

2. **Streaming de IA**

```typescript
// 1. Iniciar stream
const response = await IaService.streamQuery('¿Cómo estás?');

// 2. Procesar chunks
streamIAResponse(
  response,
  (chunk) => {
    // Actualizar UI con cada chunk
    setResponse((prev) => prev + chunk);
  },
  () => {
    // Finalizar stream
    setLoading(false);
  }
);
```

## ⚠️ Consideraciones

1. **EventBus**
   - No usar para estado global (preferir Redux/Context)
   - Evitar dependencias circulares
   - Mantener eventos simples y enfocados

2. **SSE**
   - Considerar límites de conexiones concurrentes
   - Implementar timeout y reconexión
   - Manejar memoria en streams largos

3. **Servicios**
   - Mantener servicios modulares y enfocados
   - Usar interceptores para lógica común
   - Implementar caché cuando sea apropiado
