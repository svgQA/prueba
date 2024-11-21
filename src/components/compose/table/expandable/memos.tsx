import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';

export const ExpandableMemos: FunctionComponent<IExpandableProps> = ({
  row,
}: IExpandableProps) => {
  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <div className='grid grid-cols-4 gap-4'>
        {/* Columna del Empleado */}
        <div className='space-y-1'>
          <h4 className='text-gray-600 mb-2 font-medium'>Datos del Empleado</h4>
          <img
            src={row.workerPhoto || 'https://i.pravatar.cc/150?img=1'}
            alt='Foto del empleado'
            className='w-32 h-32 rounded-full mb-4 object-cover'
          />

          <div className='flex items-center'>
            <span className='text-gray-800 w-32'>Email:</span>
            <span className='text-gray-600'>{row.workerEmail}</span>
          </div>
          <div className='flex items-center'>
            <span className='text-gray-800 w-32'>Teléfono:</span>
            <span className='text-gray-600'>{row.contact}</span>
          </div>
          <div className='flex items-center'>
            <span className=' text-gray-800 w-32'>Turno:</span>
            <span className='text-gray-600'>{row.shift}</span>
          </div>
        </div>

        {/* Columna del Supervisor */}
        <div className='space-y-2'>
          <h4 className=' text-gray-600 mb-2 font-medium'>
            Datos del Supervisor
          </h4>
          <img
            src={row.supervisorPhoto || 'https://i.pravatar.cc/150?img=2'}
            alt='Foto del supervisor'
            className='w-32 h-32 rounded-full mb-4 object-cover'
          />
          <div className='flex items-center'>
            <span className='text-gray-800 w-32'>Nombre:</span>
            <span className='text-gray-600'>{row.supervisor}</span>
          </div>
          <div className='flex items-center'>
            <span className='text-gray-800 w-32'>Email:</span>
            <span className='text-gray-600'>{row.supervisorEmail}</span>
          </div>
          <div className='flex items-center'>
            <span className='text-gray-800 w-32'>Teléfono:</span>
            <span className='text-gray-600'>{row.supervisorPhone}</span>
          </div>
        </div>

        {/* Columna del Cliente */}
        <div className='space-y-2'>
          <h4 className='text-gray-600 mb-2 font-medium'>Datos del Cliente</h4>
          <img
            src={row.clientPhoto || 'https://i.pravatar.cc/150?img=3'}
            alt='Foto del cliente'
            className='w-32 h-32 rounded-full mb-4 object-cover'
          />
          <div className='flex items-center'>
            <span className='text-gray-800 w-32'>Nombre:</span>
            <span className='text-gray-600'>{row.clientName}</span>
          </div>
          <div className='flex items-center'>
            <span className='text-gray-800 w-32'>Email:</span>
            <span className='text-gray-600'>{row.clientEmail}</span>
          </div>
          <div className='flex items-center'>
            <span className='text-gray-800 w-32'>Teléfono:</span>
            <span className='text-gray-600'>{row.clientPhone}</span>
          </div>
        </div>

        {/* Columna del Mapa */}
        <div className='w-full h-48'>
          <h4 className='text-gray-600 mb-2 font-medium'>
            Localización Física del Cliente
          </h4>
          <iframe
            title='Ubicación del incidente'
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d!2d${row.location?.split(',')[1] || '0'}!3d${row.location?.split(',')[0] || '0'}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1ses!2s!4v1234567890!5m2!1ses!2s`}
            className={`w-full h-full rounded-lg border-none ${!row.location ? 'hidden' : ''}`}
            loading='lazy'
            allowFullScreen
            //referrerPolicy='no-referrer-when-downgrade'
          />
        </div>
      </div>
    </div>
  );
};
