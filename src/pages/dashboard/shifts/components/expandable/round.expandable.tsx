import { Chip } from '@/components/common/chip/chip';
import { CardTask } from './card.task';
const RoundInfo = ({ roundPct }: any) => {
  const points = [
    {
      id: 1,
      name: 'Punto 1',
      status: '✔️',
      statusColor: 'text-green-600',
      scan: '11/04/2024 19:30',
      distance: '9 metros',
      form: 'FORMULARIO 1',
    },
    {
      id: 2,
      name: 'Punto 2',
      status: '⚠️',
      statusColor: 'text-red-600',
      scan: '11/04/2024 19:30',
      distance: '9 metros',
      form: 'FORMULARIO 2',
    },
    {
      id: 3,
      name: 'Punto 3',
      status: '✔️',
      statusColor: 'text-green-600',
      scan: '11/04/2024 19:30',
      distance: '9 metros',
      form: 'FORMULARIO 3',
    },
  ];

  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm text-t-light dark:text-t-dark p-4 relative'>
      <div className='flex items-center justify-between absolute top-0 right-0 w-full'>
        <h2 className='font-medium p-2 bg-ternary text-white rounded-ee-lg'>
          Rondas del Turno
        </h2>
        <div className='flex flex-row gap-2 flex-wrap justify-end'>
          <Chip label={`Progreso: ${roundPct}%`} color='primary' />
        </div>
      </div>

      {points.length === 0 ? (
        <div className='flex items-center justify-center h-32'>
          <p className='text-gray-500 dark:text-gray-400'>
            No hay rondas registradas
          </p>
        </div>
      ) : (
        <div className='flex flex-row gap-2 flex-wrap justify-center mt-6'>
          {points.map((point) => (
            <CardTask key={point.id} point={point} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoundInfo;
