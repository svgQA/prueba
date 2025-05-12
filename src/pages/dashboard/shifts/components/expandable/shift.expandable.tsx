import { Chip } from '@/components/common/chip/chip';
import { CardRound } from './card.round';

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
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm w-full text-t-light dark:text-t-dark p-4 relative'>
      <div className='flex items-center justify-between absolute top-0 right-0 w-full'>
        <h2 className='font-medium p-2 bg-ternary text-white rounded-ee-lg'>
          Actividades del Turno
        </h2>
        <Chip label={`Progreso: ${data.progress ?? 75}%`} color='primary' />
      </div>

      <div className='flex flex-row gap-2 flex-wrap justify-center'>
        {activities.map((activity: any, index: number) => (
          <CardRound key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ShiftInfo;
