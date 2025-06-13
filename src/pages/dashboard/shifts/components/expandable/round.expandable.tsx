import { CardTask } from './card.task';

const RoundInfo = ({ points, frequency }: any) => {
  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm text-t-light dark:text-t-dark py-2 relative'>
      <div className='flex items-center justify-between absolute top-0 right-0 w-full'>
        <h2 className='font-medium p-2 bg-ternary text-white rounded-ee-lg'>
          Rondas del Turno
        </h2>
      </div>
      {points.length === 0 ? (
        <div className='flex items-center justify-center h-32'>
          <p className='text-gray-500 dark:text-gray-400'>
            No hay rondas registradas
          </p>
        </div>
      ) : (
        <div className='flex flex-row gap-2 flex-wrap justify-center'>
          {points.map((point: any) => (
            <CardTask key={point.id} point={point} frequency={frequency} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoundInfo;
