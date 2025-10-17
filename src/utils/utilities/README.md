# DateUtils

Utilidad para manejo de fechas y horas en la aplicación Voxline Dashboard. Esta utilidad proporciona funciones para manejar conversiones entre zonas horarias, formateo de fechas y cálculos de tiempo.

## ⚠️ Importante: Funciones Principales

Para mantener consistencia y evitar errores en el manejo de fechas, **SIEMPRE** usar estas dos funciones:

### 1. `dateToBackend`

Para enviar fechas al servidor (siempre en UTC).

```typescript
// Convertir cualquier fecha a formato UTC para backend
const backendDate = DateUtils.dateToBackend('2024-03-20 14:30');
// Resultado: "2024-03-20T19:30:00.000Z"

// Para enviar solo hora
const backendTime = DateUtils.dateToBackend('14:30', 'time');
// Resultado: "19:30"
```

### 2. `dateToFrontend`

Para mostrar fechas al usuario (convierte automáticamente a zona local).

```typescript
// Formato básico (24 horas)
const date24h = DateUtils.dateToFrontend('2024-03-20T19:30:00.000Z');
// Resultado: "20/03/2024 14:30"

// Formato con hora (24 horas)
const dateWithTime24h = DateUtils.dateToFrontend('2024-03-20T19:30:00.000Z', {
  time: true,
});
// Resultado: "20/03/2024 14:30"

// Formato con hora (12 horas)
const dateWithTime12h = DateUtils.dateToFrontend('2024-03-20T19:30:00.000Z', {
  time: true,
  mode: '12',
});
// Resultado: "20/03/2024 02:30 PM"

// Formato personalizado
const customFormat = DateUtils.dateToFrontend('2024-03-20T19:30:00.000Z', {
  format: 'DD/MM/YYYY hh:mm A',
});
// Resultado: "20/03/2024 02:30 PM"
```

## 🎯 Reglas de Uso

1. **SIEMPRE** usar `dateToBackend` para:
   - Enviar fechas al servidor
   - Guardar fechas en la base de datos
   - Comparar fechas en el backend

2. **SIEMPRE** usar `dateToFrontend` para:
   - Mostrar fechas en la interfaz
   - Formatear fechas para el usuario
   - Mostrar horas en componentes

3. **NUNCA** usar otras funciones de conversión directamente a menos que sea absolutamente necesario

## Casos de Uso Comunes

### 1. En Formularios

```typescript
// Al guardar un turno
const formData = {
  startTime: DateUtils.dateToBackend(form.startTime),
  endTime: DateUtils.dateToBackend(form.endTime),
};

// Al mostrar un turno
const displayTime = DateUtils.dateToFrontend(shift.startTime, {
  time: true,
  mode: '12',
});
```

### 2. En Componentes

```typescript
// En DateContrast
const scheduledTime = DateUtils.dateToFrontend(shift.scheduledTime, {
  time: true,
  mode: '12',
});
const actualTime = DateUtils.dateToFrontend(shift.actualTime, {
  time: true,
  mode: '12',
});
```

### 3. En Tablas

```typescript
// Al mostrar fechas en tablas
const formattedDate = DateUtils.dateToFrontend(row.date, {
  time: true,
});
```

## ⚠️ Notas Importantes

1. Todas las fechas se manejan internamente en UTC
2. Las conversiones a zona local se realizan automáticamente al usar `dateToFrontend`
3. **NO** usar otras funciones de conversión a menos que sea estrictamente necesario
4. Mantener consistencia usando siempre estas dos funciones principales

## 🔍 Otras Funciones

El resto de funciones en DateUtils son para casos específicos y deberían usarse solo cuando sea absolutamente necesario:

- `getTimeStatus`: Para comparar estados de tiempo en turnos
- `getTimeDifference`: Para calcular duraciones
- `convertBetweenTimeZones`: Para conversiones entre zonas horarias específicas
- `nowUTCFormatted`/`nowLocalFormatted`: Para obtener fechas actuales

## 📝 Mejores Prácticas

1. **SIEMPRE** usar `dateToBackend` para datos que van al servidor
2. **SIEMPRE** usar `dateToFrontend` para datos que se muestran al usuario
3. Especificar el formato deseado al usar `dateToFrontend`
4. Usar el modo 12 horas cuando se requiera formato AM/PM
5. Mantener consistencia en el formato de fechas en toda la aplicación

## Características Principales

- Manejo de zonas horarias (UTC y local)
- Formateo de fechas en diferentes formatos
- Conversión entre zonas horarias
- Cálculo de estados de tiempo (para turnos y eventos)
- Cálculo de diferencias de tiempo
- Soporte para formato 12/24 horas

## Configuración

La zona horaria se configura automáticamente usando la zona horaria del navegador:

```typescript
// Obtener la zona horaria actual
const timeZone = DateUtils.getTimeZone(); // Ejemplo: "America/Bogota"

// Configurar una zona horaria personalizada
DateUtils.setTimeZone('America/Bogota');
```

## Uso Común

### Conversión de Fechas para Backend

```typescript
// Convertir fecha local a UTC para backend
const utcDate = DateUtils.toUTCISOStringFromLocal('2024-03-20 14:30');
// Resultado: "2024-03-20T19:30:00.000Z"

// Convertir solo hora a UTC
const utcTime = DateUtils.toUTCISOStringFromLocal('14:30', 'time');
// Resultado: "19:30"

// Alias para toUTCISOStringFromLocal
const backendDate = DateUtils.dateToBackend('2024-03-20 14:30');
```

### Formateo de Fechas para Frontend

```typescript
// Formato básico (24 horas)
const date24h = DateUtils.dateToFrontend('2024-03-20T19:30:00.000Z');
// Resultado: "20/03/2024 14:30"

// Formato con hora (24 horas)
const dateWithTime24h = DateUtils.dateToFrontend('2024-03-20T19:30:00.000Z', {
  time: true,
});
// Resultado: "20/03/2024 14:30"

// Formato con hora (12 horas)
const dateWithTime12h = DateUtils.dateToFrontend('2024-03-20T19:30:00.000Z', {
  time: true,
  mode: '12',
});
// Resultado: "20/03/2024 02:30 PM"

// Formato personalizado
const customFormat = DateUtils.dateToFrontend('2024-03-20T19:30:00.000Z', {
  format: 'DD/MM/YYYY hh:mm A',
});
// Resultado: "20/03/2024 02:30 PM"
```

### Fechas Actuales

```typescript
// Fecha actual en UTC
const nowUTC = DateUtils.nowUTCFormatted();
// Resultado: "2024-03-20 19:30:00"

// Fecha actual en zona local
const nowLocal = DateUtils.nowLocalFormatted();
// Resultado: "2024-03-20 14:30:00"

// Fecha actual como objeto Date en UTC
const nowUTCDate = DateUtils.nowUTCDate();

// Fecha actual como ISO string en UTC
const nowUTCISO = DateUtils.nowUTCISOString();
```

### Comparación de Tiempos

```typescript
// Obtener estado de tiempo (útil para turnos)
const status = DateUtils.getTimeStatus(
  '2024-03-20T19:35:00.000Z', // Hora actual
  '2024-03-20T19:30:00.000Z', // Hora programada
  'start', // Tipo de comparación
  10 // Tolerancia en minutos
);
// Resultado: "warning" (dentro de la tolerancia)

// Calcular diferencia entre fechas
const diff = DateUtils.getTimeDifference(
  '2024-03-20T19:30:00.000Z',
  '2024-03-20T20:45:00.000Z'
);
// Resultado: { hours: 1, minutes: 15, miliseconds: 4500000 }
```

### Conversión entre Zonas Horarias

```typescript
// Convertir entre zonas horarias
const convertedDate = DateUtils.convertBetweenTimeZones(
  '2024-03-20T19:30:00.000Z',
  'UTC',
  'America/Bogota',
  'DD/MM/YYYY HH:mm'
);
// Resultado: "20/03/2024 14:30"
```

## Casos de Uso Comunes

### 1. Mostrar Fechas en Componentes

```typescript
// En un componente de turno
const scheduledTime = DateUtils.dateToFrontend(shift.scheduledTime, {
  time: true,
  mode: '12',
});
// Resultado: "20/03/2024 02:30 PM"
```

### 2. Enviar Fechas al Backend

```typescript
// Al crear/actualizar un turno
const backendDate = DateUtils.dateToBackend(formData.date);
// Resultado: "2024-03-20T19:30:00.000Z"
```

### 3. Comparar Tiempos de Check-in/Check-out

```typescript
// En componente DateContrast
const status = DateUtils.getTimeStatus(
  actualCheckIn,
  scheduledCheckIn,
  'start',
  10
);
```

### 4. Calcular Duración de Turnos

```typescript
const duration = DateUtils.getTimeDifference(shift.checkIn, shift.checkOut);
// Resultado: { hours: 8, minutes: 0, miliseconds: 28800000 }
```

## Notas Importantes

1. Todas las fechas se manejan internamente en UTC
2. Las conversiones a zona local se realizan automáticamente al mostrar
3. Siempre usar `dateToBackend` para enviar fechas al servidor
4. Usar `dateToFrontend` para mostrar fechas al usuario
5. Considerar el formato 12/24 horas según el requerimiento
6. La tolerancia en minutos es configurable para comparaciones de tiempo

## Mejores Prácticas

1. Siempre especificar el formato deseado al usar `dateToFrontend`
2. Usar el modo 12 horas cuando se requiera formato AM/PM
3. Mantener consistencia en el formato de fechas en toda la aplicación
4. Considerar la zona horaria del usuario al mostrar fechas
5. Usar las funciones de comparación para validar tiempos de turnos

## 📦 Componentes de Fecha en Preact

La utilidad DateUtils se utiliza en varios componentes de Preact para manejar fechas de manera consistente:

### 1. `FormattedDate`

Componente para mostrar fechas formateadas con diferentes opciones.

```typescript
// Uso básico
<FormattedDate date="2024-03-20T19:30:00.000Z" />

// Con diferentes formatos
<FormattedDate
  date="2024-03-20T19:30:00.000Z"
  format="human"     // "20 de marzo de 2024"
  timeZone="local"   // o "utc"
/>

// Formatos disponibles
type DateFormat = 'human' | 'date' | 'datetime' | 'time' | 'relative';
// human: "20 de marzo de 2024"
// date: "20/03/2024"
// datetime: "20/03/2024 14:30"
// time: "14:30"
// relative: "hace 2 horas"
```

### 2. `DateContrast`

Componente para comparar fechas programadas vs actuales, útil para turnos.

```typescript
// Uso básico
<DateContrast
  scheduledDate="2024-03-20T19:30:00.000Z"
  actualDate={{
    time: "2024-03-20T19:35:00.000Z",
    location: { lat: 4.1234, lng: -74.5678 }
  }}
  type="start"
  toleranceMinutes={10}
  showLocation
/>

// Props disponibles
interface DateContrastProps {
  scheduledDate: string | Date;
  actualDate?: {
    time?: string;
    location?: { lat: number; lng: number } | string;
  } | null;
  type?: 'start' | 'end';
  toleranceMinutes?: number;
  showLocation?: boolean;
  customStatus?: (scheduled: string, actual: string) => TimeStatus;
}
```

### 3. `DateField`

Componente de formulario para campos de fecha/hora.

```typescript
// En un formulario
<DateField
  name="startTime"
  label="Hora de inicio"
  required
  format="time"  // o "date"
/>

// Props disponibles
interface DateFieldProps {
  name: string;
  label: string;
  required?: boolean;
  format?: 'time' | 'date';
  validate?: (value: any) => any;
}
```

## 🔄 Flujo de Datos con Componentes

### 1. Formularios con Fechas

```typescript
// 1. Usar DateField para captura
<DateField
  name="shiftTime"
  label="Hora del turno"
  format="time"
/>

// 2. Al enviar, DateField automáticamente convierte a UTC
const formData = {
  shiftTime: values.shiftTime // Ya está en UTC
};

// 3. Al mostrar, usar FormattedDate
<FormattedDate
  date={shift.shiftTime}
  format="time"
  timeZone="local"
/>
```

### 2. Comparación de Turnos

```typescript
// En una tabla de turnos
<DateContrast
  scheduledDate={shift.scheduledTime}
  actualDate={{
    time: shift.actualTime,
    location: shift.location
  }}
  type="start"
  showLocation
/>
```

## 📝 Mejores Prácticas con Componentes

1. **SIEMPRE** usar `DateField` para campos de fecha en formularios
   - Maneja automáticamente la conversión UTC
   - Proporciona validación consistente
   - Mantiene el formato correcto en el input

2. **SIEMPRE** usar `FormattedDate` para mostrar fechas
   - Maneja automáticamente la zona horaria
   - Proporciona formatos consistentes
   - Facilita cambios globales de formato

3. **SIEMPRE** usar `DateContrast` para comparar fechas
   - Maneja automáticamente las comparaciones UTC
   - Proporciona estados visuales consistentes
   - Incluye soporte para ubicaciones

4. **NUNCA** manipular fechas directamente en los componentes
   - Dejar que los componentes usen DateUtils internamente
   - Mantener la lógica de fechas centralizada
   - Evitar duplicación de código
