import { IExpandableProps } from '../interface';

export const ShiftSection = ({
  title,
  data,
  isCheckIn,
  row,
}: {
  title: string;
  data: typeof row.checkIn | typeof row.checkOut;
  isCheckIn: boolean;
  row: IExpandableProps['row'];
}) => {
  return (
    <div className='flex-1 p-4 rounded-lg'>
      <h4 className='mb-4'>{title}</h4>
      <div className='flex flex-col md:flex-row gap-4 md:gap-8'>
        <div className='flex flex-col items-center md:items-start'>
          <img
            src={row.workerPhoto}
            alt='Worker Photo'
            className='w-24 h-24 md:w-[120px] md:h-[120px] rounded-full mb-4'
          />
          <div className='flex flex-col md:flex-row items-center md:items-start'>
            <span className='text-gray-800 w-full md:w-32'>Nombre:</span>
            <span className='text-gray-600'>{row.employeeName}</span>
          </div>
          <div className='flex flex-col md:flex-row items-center md:items-start'>
            <span className='text-gray-800 w-full md:w-32'>Teléfono:</span>
            <span className='text-gray-600'>{row.contact}</span>
          </div>
          <div className='flex flex-col md:flex-row items-center md:items-start'>
            <span className='text-gray-800 w-full md:w-32'>Correo:</span>
            <span className='text-gray-600'>{row.workerEmail}</span>
          </div>
          <div className='flex flex-col md:flex-row items-center md:items-start'>
            <span className='text-gray-800 w-full md:w-32'>
              {isCheckIn ? 'Fecha Inicio:' : 'Fecha Fin:'}
            </span>
            <span className='text-gray-600'>{data.date}</span>
          </div>
          <div className='flex flex-col md:flex-row items-center md:items-start'>
            <span className='text-gray-800 w-full md:w-32'>Estado:</span>
            <span
              className={`px-2 py-1 rounded ${data.status === 'Con Retraso' ? 'bg-red-500 text-white' : data.status === 'A Tiempo' ? 'bg-green-500 text-white' : 'text-gray-600'}`}
            >
              {data.status}
            </span>
          </div>
        </div>
        <div className='w-full'>
          <h5 className='mb-4 text-center md:text-left'>Ubicación del punto</h5>
          <div className='h-[200px] w-full'>
            <iframe
              title={
                isCheckIn ? 'Ubicación del incidente' : 'Ubicación de salida'
              }
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d!2d${data.location?.split(',')[1] || '0'}!3d${data.location?.split(',')[0] || '0'}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1ses!2s!4v1234567890!5m2!1ses!2s`}
              className={`w-full h-full rounded-lg border-none ${!data.location ? 'hidden' : ''}`}
              loading='lazy'
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};
