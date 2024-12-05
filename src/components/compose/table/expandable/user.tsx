import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';

export const ExpandableUser: FunctionComponent<IExpandableProps> = ({
  row,
}: IExpandableProps) => {
  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <div className='grid grid-cols-4 gap-4'>
        <div className='space-y-2 flex justify-center items-center'>
          <img
            src={row.workerPhoto || '/placeholder-image.jpg'}
            alt='Foto del empleado'
            className='w-32 h-32 rounded-full  object-cover hidden [&:not([src="/placeholder-image.jpg"])]:block'
          />
        </div>
        <div className='space-y-2'>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Nombre:</span>
            <span className='text-gray-900'>
              {row.firstName} {row.lastName}
            </span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Edad:</span>
            <span className='text-gray-800'>{row.workerAge}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Identificación:</span>
            <span className='text-gray-800'>{row.personalID}</span>
          </div>
          <div className=''>
            <span className=' text-gray-600 w-32 mr-2'>Email:</span>
            <span className='text-gray-800'>{row.workerEmail}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Conexión:</span>
            <span className='text-gray-800'>{row.connection}</span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Compañia:</span>
            <span className='text-gray-800'>{row.company}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Departamento:</span>
            <span className='text-gray-800'>{row.department}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Ciudad:</span>
            <span className='text-gray-800'>{row.city}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Localización:</span>
            <span className='text-gray-800'>{row.location}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Dirección:</span>
            <span className='text-gray-800'>{row.address}</span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Contacto:</span>
            <span className='text-gray-800'>{row.contact}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Turno:</span>
            <span className='text-gray-800'>{row.shift}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Tipo Novedad:</span>
            <span className='text-gray-800'>{row.noveltyType}</span>
          </div>
          <div className=''>
            <span className='text-gray-600 w-32 mr-2'>Fecha Novedad:</span>
            <span className='text-gray-800'>{row.noveltyDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
