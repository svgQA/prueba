const ShiftInfo = ({ data = {} }: any) => {
  const activities = data.activities || [
    {
      status: '✔️',
      statusColor: 'text-green-600',
      title: 'Revisión de equipo (radio, linterna, uniforme, armas si aplica).',
      schedule: '11/04/2024 20:00',
      solution: '11/04/2024 20:00',
      form: 'FORMULARIO 1',
    },
    {
      status: '⚠️',
      statusColor: 'text-red-600',
      title: 'Registro de entrada y toma de novedades del turno anterior.',
      schedule: '...',
      solution: '...',
      form: 'FORMULARIO 2',
    },
    {
      status: '✔️',
      statusColor: 'text-green-600',
      title:
        'Realiza rondas de inspección de las instalaciones para detectar anomalías...',
      schedule: '...',
      solution: '11/04/2024 20:45',
      form: 'FORMULARIO 3',
    },
  ];

  return (
    <div className='bg-b-white rounded-lg shadow-sm p-4 max-w-3xl mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-t-light font-medium'>Actividades del Turno</h2>
        <span>
          Progreso:{' '}
          <strong className='text-secondary'>{data.progress ?? 75}%</strong>
        </span>
      </div>

      <div className='space-y-6'>
        {activities.map((activity: any, index: number) => (
          <div key={index} className='flex items-start justify-between'>
            {/* Lado izquierdo - Icono y detalles */}
            <div className='flex items-start flex-1'>
              {/* Icono de estado */}
              <div className='mr-2 mt-1'>
                {activity.status === '✔️' ? (
                  <span className='vox-icon size-sm vx-icon-324 !text-secondary'></span>
                ) : (
                  <span className='vox-icon size-sm vx-icon-323 !text-error'></span>
                )}
              </div>

              {/* Detalles de la actividad */}
              <div className='flex-1'>
                <p className='text-t-light text-sm mb-2'>{activity.title}</p>

                {/* Programación y Solución en línea horizontal */}
                <div className='flex items-center space-x-6'>
                  <div className='flex items-center text-xs text-t-light-dark'>
                    <span className='vox-icon size-sm vx-icon-325 mr-1'></span>
                    <span>Programación: {activity.schedule}</span>
                  </div>

                  {activity.solution !== '...' && (
                    <div className='flex items-center text-xs text-t-light-dark'>
                      <span className='vox-icon size-sm vx-icon-325 mr-1'></span>
                      <span>Solución: {activity.solution}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lado derecho - Enlace al formulario */}
            <div className='ml-4 flex items-center'>
              <a href='#' className='flex items-center text-primary text-sm'>
                <span className='vox-icon size-sm vx-icon-306 !text-primary mr-1'></span>
                {activity.form}
                <span className='ml-1 vox-icon size-sm vx-icon-004 !text-primary'></span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftInfo;
