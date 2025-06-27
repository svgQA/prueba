export const shift_es = {
  shift: {
    upsert: {
      success: 'Turno creado exitosamente!',
      error: 'Error al crear el turno',
      newTask: 'Nueva tarea',
      errorSchedule: 'El turno no se puede crear porque las fechas no están disponibles en el horario',
      form: {
        task: 'Tarea',
        taskPlaceholder: 'Selecciona una tarea',
        taskName: 'Nombre de la tarea',
        taskNamePlaceholder: 'Nombre de la tarea',
        taskHourStart: 'Hora de inicio de la tarea',
        taskHourStartPlaceholder: 'Hora de inicio de la tarea',
        taskDescription: 'Descripción de la tarea',
        taskDescriptionPlaceholder: 'Descripción de la tarea',
      },
    },
    table: {
      delete: {
        title: 'Eliminar Turno',
        message: '¿Está seguro que desea eliminar el turno?',
        success: 'Turno eliminado exitosamente!',
        error: 'Error al eliminar el turno',
        warning:
          'El turno no se puede eliminar porque ya esta en curso o finalizado',
      },
    },
    expandable: {
      date: {
        location: {
          title: 'Permiso denegado',
          message:
            'Es necesario aprobar el acceso a la ubicación para realizar el check. Por favor habilite los permisos de ubicación en su navegador.',
          gpsMessage:
            'No se pudo obtener la ubicación. Por favor verifique que el GPS esté activado.',
          timeoutMessage:
            'Se agotó el tiempo de espera para obtener la ubicación. Por favor intente nuevamente.',
        },
        success: 'Check realizado correctamente',
        checkSuccess: 'A tiempo',
        checkEarly: 'Temprano',
        checkError: 'Tarde',
      },
    },
    columns: {
      user: 'Usuario',
      service: 'Servicio',
      contract: 'Contrato',
      date: 'Fecha',
      start: 'Inicio',
      end: 'Finalización',
      status: 'Estado',
      duration: 'Duración',
      report: 'Reportes',
      shift: 'Actividades',
      round: 'Rondas',
      client: 'Cliente',
      actions: 'Acciones',
    },
  },
};

export const shift_en = {
  shift: {
    upsert: {
      success: 'Shift created successfully!',
      error: 'Error creating shift',
      newTask: 'New task',
      errorSchedule: 'The shift cannot be created because the dates are not available in the schedule',
      form: {
        task: 'Task',
        taskPlaceholder: 'Select a task',
        taskName: 'Task name',
        taskNamePlaceholder: 'Task name',
        taskHourStart: 'Task start time',
        taskHourStartPlaceholder: 'Task start time',
        taskDescription: 'Task description',
        taskDescriptionPlaceholder: 'Task description',
      },
    },
    table: {
      delete: {
        title: 'Delete Shift',
        message: 'Are you sure you want to delete the shift?',
        success: 'Shift deleted successfully!',
        error: 'Error deleting shift',
      },
    },
    expandable: {
      date: {
        location: {
          title: 'Permission denied',
          message:
            'It is necessary to approve access to the location to perform the check. Please enable location permissions in your browser.',
          gpsMessage: 'Please enable GPS on your device.',
          timeoutMessage:
            'The timeout has expired to get the location. Please try again.',
        },
        success: 'Check performed successfully',
        checkSuccess: 'On time',
        checkEarly: 'Early',
        checkError: 'Late',
      },
    },
    columns: {
      user: 'User',
      service: 'Service',
      contract: 'Contract',
      date: 'Date',
      start: 'Start',
      end: 'End',
      status: 'Status',
      duration: 'Duration',
      report: 'Report',
      shift: 'Shift',
      round: 'Round',
      client: 'Client',
      actions: 'Actions',
    },
  },
};
