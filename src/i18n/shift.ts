export const shift_es = {
  shift: {
    upsert: {
      success: 'Turno creado exitosamente!',
      error: 'Error al crear el turno',
      newTask: 'Nueva tarea',
      errorSchedule:
        'El turno no se puede crear porque las fechas no están disponibles en el horario',
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
        success: 'Turno eliminado exitosamente!',
        error: 'Error al eliminar el turno',
      },
    },
    expandable: {
      date: {
        pending: 'Pendiente',
        info: {
          date: 'Fecha',
          time: 'Hora',
          source: 'Fuente',
          distance: 'Distancia',
        },
        buttons: {
          checkIn: 'Check In',
          checkOut: 'Check Out',
        },
        checkSuccess: 'A tiempo',
        checkEarly: 'Temprano',
        checkError: 'Tarde',
        success: 'Check realizado correctamente',
      },
      employee: {
        operative: 'Operativo',
        infoPerson: 'Información personal',
        identification: 'Identificación',
        phone: 'Teléfono',
        email: 'Correo',
        address: 'Dirección',
        city: 'Ciudad',
        infoEnterprice: 'Información de la empresa',
        company: 'Empresa',
        department: 'Departamento',
        dataStart: 'Fecha de inicio',
        statistics: 'Estadísticas Turno',
        activities: 'Actividades',
        shifts: 'Turnos',
      },
      service: {
        title: 'Detalles del Servicio',
        status: {
          info: 'Información',
        },
        serviceName: 'Nombre del Servicio',
        contract: 'Contrato',
        location: {
          title: 'Ubicación y Descripción',
          name: 'Ubicación',
          description: 'Descripción',
        },
        round: 'Ronda',
        coverage: {
          title: 'Área de cobertura',
          radius: 'Radio: {{value}}m',
        },
      },
      round: {
        title: 'Rondas del Turno',
        empty: 'No hay rondas registradas',
        point: 'Punto',
        frequency: 'Frec',
        scans: 'Escaneos',
        percentage: 'Porcentaje',
      },
      task: {
        title: 'Tareas del Turno',
        empty: 'No hay tareas asignadas',
        completed: 'completadas',
        overall: 'Progreso general',
      },
      report: {
        title: 'Reportes del Turno',
        count: {
          singular: 'Reporte',
          plural: 'Reportes',
        },
        status: {
          requested: 'Solicitado',
          notRequested: 'No solicitado',
        },
        dates: {
          request: 'Solicitud',
          received: 'Recibido',
          report: 'Reporte',
        },
        form: {
          title: 'Formulario',
          category: 'Categoría',
          description: 'Descripción',
          noCategory: 'Sin categoría',
          viewDetails: 'Ver detalles',
          hideDetails: 'Ocultar detalles',
          viewForm: 'Ver reporte de formulario',
        },
        empty: 'No hay reportes para mostrar',
        attachments: 'Archivos adjuntos',
      },
      shift: {
        empty: 'No hay actividades para mostrar',
        progress: 'Progreso',
      },
      card: {
        round: {
          pending: 'Pendiente',
          schedule: 'Programación',
          solution: 'Solución',
          form: 'Formulario',
          noForm: 'Sin formulario',
        },
        task: {
          point: 'Point',
          frequency: 'Freq',
        },
      },
      contract: {
        client: 'Cliente',
        status: 'Estado',
        dates: {
          start: 'Fecha de inicio',
          end: 'Fecha de finalización',
        },
        metrics: {
          completedShifts: 'Turnos completados',
          totalHours: 'Horas totales',
          totalShifts: 'Total de turnos',
          completion: 'Cumplimiento',
        },
        checkPending: 'Pendiente',
        message: '¿Está seguro de que desea realizar el',
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
      errorSchedule:
        'The shift cannot be created because the dates are not available in the schedule',
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
        success: 'Shift deleted successfully!',
        error: 'Error deleting shift',
      },
    },
    expandable: {
      date: {
        pending: 'Pending',
        info: {
          date: 'Date',
          time: 'Time',
          source: 'Source',
          distance: 'Distance',
        },
        buttons: {
          checkIn: 'Check In',
          checkOut: 'Check Out',
        },
        checkSuccess: 'On time',
        checkEarly: 'Early',
        checkError: 'Late',
        checkPending: 'Pending',
        message: 'Are you sure you want to perform the',
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
