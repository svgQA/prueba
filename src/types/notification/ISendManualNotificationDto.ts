export interface ISendManualNotificationDto {
  templateId?: string; // Se usa si se quiere cargar una plantilla

  overrideTitle?: string; // Requerido si no se envía templateId
  overrideDescription?: string;

  formId?: string; // Solo referencia de formulario (opcional)

  filters?: {
    userIds?: string[]; // ⬅️ opcional: pueden no seleccionarse
    shiftToday?: boolean; // ⬅️ opcional: puede no usarse filtro de turno
    [key: string]: any; // ⬅️ flexibilidad para más filtros futuros
  };

  data?: Record<string, any>; // Info extra a enviar en la notificación (e.g., formId, tipo, etc.)
}
