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
    <div class='p-4 bg-white shadow-lg rounded-lg'>
      <div class='flex items-center justify-between border-b pb-2 mb-4'>
        <h2 class='text-lg font-semibold'>Actividades del Turno</h2>
        <span class='text-sm text-green-600'>
          Progreso: <strong>{data.progress ?? 75}%</strong>
        </span>
      </div>
      <div class='space-y-2'>
        {activities.map((activity: any, index: any) => (
          <div
            key={index}
            class='flex items-center justify-between p-2 bg-gray-50 rounded-lg'
          >
            <div class='flex items-start gap-2'>
              <span class={activity.statusColor}>{activity.status}</span>
              <div>
                <p class='font-semibold text-gray-800'>{activity.title}</p>
                <p class='text-xs text-gray-500'>
                  📅 Programación: {activity.schedule}
                </p>
                <p class='text-xs text-gray-500'>
                  ⏳ Solución: {activity.solution}
                </p>
              </div>
            </div>
            <a href='#' class='text-blue-500 text-xs flex items-center gap-1'>
              📄 {activity.form} ➝
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftInfo;
