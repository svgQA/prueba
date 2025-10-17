export interface ISendManualNotificationDto {
  /**
   * Tipo de notificación (general, report, etc.).
   */
  notificationType?: 'general' | 'report';

  /**
   * ID de la plantilla (opcional).
   */
  templateId?: string; // Se usa si se quiere cargar una plantilla

  /**
   * Título personalizado (requerido si no se envía templateId).
   */
  overrideTitle?: string;

  /**
   * Descripción personalizada (requerida si no se envía templateId).
   */
  overrideDescription?: string;

  /**
   * ID de la tarea asociada (opcional).
   */
  tasks?: string[]; // Solo referencia de formulario (opcional)

  /**
   * Filtros para definir los usuarios destinatarios.
   */
  filters?: {
    userIds?: string[]; // ⬅️ opcional: pueden no seleccionarse
    shiftToday?: boolean; // ⬅️ opcional: puede no usarse filtro de turno
    [key: string]: any; // ⬅️ flexibilidad para más filtros futuros
  };

  /**
   * Datos adicionales enviados en la notificación (e.g., formId, tipo, etc.).
   */
  data?: Record<string, any>; // Info extra a enviar en la notificación
}
