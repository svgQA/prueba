import { FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';

export const ExpandableAccess: FunctionComponent<IExpandableProps> = ({
  row,
}) => {
  return (
    <div className='w-full p-4 bg-white rounded-lg shadow'>
      <h4 className='text-gray-800 font-semibold mb-3'>
        Detalles del Vehículo
      </h4>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <span className='font-medium text-gray-600 mr-2'>
            Tipo de Vehículo:
          </span>
          <span className='text-gray-800'>{row.vehicleType}</span>
        </div>
        <div>
          <span className='font-medium text-gray-600 mr-2'>Placa:</span>
          <span className='text-gray-800'>{row.vehiclePlate || 'N/A'}</span>
        </div>
        <div className='md:col-span-2'>
          <span className='font-medium text-gray-600 mr-2'>Observación:</span>
          <span className='text-gray-800'>
            {row.observation || 'Sin observaciones'}
          </span>
        </div>
      </div>
    </div>
  );
};
