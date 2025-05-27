# Toast Manager

Utilidad para mostrar notificaciones toast en la aplicación Voxline Dashboard. Proporciona una interfaz consistente para mostrar mensajes de éxito, error, advertencia e información.

## 📦 Características

- Soporte para múltiples tipos de mensajes (success, error, warning, info)
- Integración con i18n para internacionalización
- Soporte para tema claro/oscuro
- Manejo especial de errores de la aplicación (VoxError)
- Personalización de duración y comportamiento
- Componente personalizado para errores detallados

## 🚀 Uso Básico

```typescript
import { ToastManager } from '@/utils/toast/toast-manager';

// Mensaje de éxito
ToastManager.success('user.created');

// Mensaje de error simple
ToastManager.error('user.not_found');

// Mensaje de advertencia
ToastManager.warning('shift.about_to_expire');

// Mensaje informativo
ToastManager.info('system.maintenance');
```

## 🎨 Tipos de Toast

### 1. Success Toast

```typescript
ToastManager.success('user.created');
// Muestra un toast verde con el mensaje traducido
```

### 2. Error Toast

```typescript
// Error simple
ToastManager.error('user.not_found');

// Error detallado (VoxError)
try {
  await UserService.create(data);
} catch (error) {
  ToastManager.error(error); // Usa CustomToast para mostrar detalles
}
```

### 3. Warning Toast

```typescript
ToastManager.warning('shift.about_to_expire');
// Muestra un toast amarillo con el mensaje traducido
```

### 4. Info Toast

```typescript
ToastManager.info('system.maintenance');
// Muestra un toast azul con el mensaje traducido
```

## ⚙️ Configuración

Cada toast tiene la siguiente configuración por defecto:

```typescript
{
  position: 'top-right',    // Posición en la pantalla
  autoClose: 5000,         // Duración en milisegundos
  hideProgressBar: false,  // Muestra barra de progreso
  closeOnClick: true,      // Cierra al hacer click
  pauseOnHover: true,      // Pausa al pasar el mouse
  draggable: true,         // Permite arrastrar
  theme: 'light' | 'dark'  // Tema según la configuración global
}
```

## 🌐 Internacionalización

Todos los mensajes son procesados a través de i18n:

```typescript
// En los archivos de traducción
{
  "user": {
    "created": "Usuario creado exitosamente",
    "not_found": "Usuario no encontrado"
  },
  "shift": {
    "about_to_expire": "El turno está por expirar"
  }
}

// En el código
ToastManager.success('user.created');
// Muestra: "Usuario creado exitosamente"
```

## 🎯 Casos de Uso Comunes

### 1. Respuestas de API

```typescript
try {
  await UserService.create(userData);
  ToastManager.success('user.created');
} catch (error) {
  ToastManager.error(error);
}
```

### 2. Validaciones de Formulario

```typescript
const handleSubmit = async (data: FormData) => {
  if (!data.email) {
    ToastManager.warning('form.email_required');
    return;
  }
  // ... resto del código
};
```

### 3. Notificaciones del Sistema

```typescript
// Al iniciar mantenimiento
ToastManager.info('system.maintenance_start');

// Al completar una tarea
ToastManager.success('task.completed');

// Al detectar un problema
ToastManager.warning('system.high_load');
```

## 📝 Mejores Prácticas

1. **Mensajes**

   - Usar siempre claves de i18n en lugar de strings directos
   - Mantener mensajes concisos y claros
   - Usar el tipo de toast apropiado para cada situación

2. **Errores**

   - Usar `ToastManager.error` con objetos VoxError para errores de API
   - Proporcionar mensajes de error específicos y útiles
   - Incluir detalles relevantes en el CustomToast

3. **Frecuencia**

   - No sobrecargar al usuario con demasiados toasts
   - Agrupar mensajes relacionados cuando sea posible
   - Usar duraciones apropiadas según la importancia

4. **Tema**
   - Los toasts se adaptan automáticamente al tema de la aplicación
   - No es necesario configurar el tema manualmente

## ⚠️ Consideraciones

1. **Rendimiento**

   - Los toasts se limpian automáticamente
   - No acumular demasiados toasts simultáneos
   - Considerar la duración según la importancia del mensaje

2. **Accesibilidad**

   - Los toasts son visibles y legibles en ambos temas
   - Incluir mensajes descriptivos para lectores de pantalla
   - Permitir interacción con el teclado

3. **UX**
   - Usar colores apropiados para cada tipo de mensaje
   - Mantener consistencia en la posición y duración
   - Proporcionar feedback inmediato para acciones importantes
