export const shift_es = {
  shift: {
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
        checkError: 'Tarde',
      },
    },
  },
};

export const shift_en = {
  shift: {
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
        checkError: 'Late',
      },
    },
  },
};
