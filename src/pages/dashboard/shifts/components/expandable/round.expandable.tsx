import { Chip } from '@/components/common/chip/chip';
import { CardTask } from './card.task';
const RoundInfo = ({}: any) => {
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
    <div className='bg-b-light-dark dark:bg-b-dark-light rounded-lg shadow-sm w-full text-t-light dark:text-t-dark p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='font-medium'>Rondas del Turno</h2>
        <Chip label={`Progreso: 75%`} color='primary' />
      </div>

      <div className='flex flex-row gap-2 flex-wrap justify-center'>
        {points.map((point) => (
          <CardTask key={point.id} point={point} />
        ))}
      </div>
    </div>
  );
};

export default RoundInfo;
