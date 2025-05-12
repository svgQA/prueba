import { IService } from '@/types/shift/activity';
import { useSignal } from '@preact/signals';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { Chip } from '@/components/common/chip/chip';

const ServiceInfo = ({ service }: { service: IService }) => {
  const points = useSignal<any>([
    {
      id: 1,
      position: {
        lat: service.place.latitude,
        lng: service.place.longitude,
      },
    },
  ]);

  return (
    <div className='flex flex-row gap-6'>
      {/* Detalles del Servicio */}
      <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 flex-1 shadow-sm text-t-light dark:text-t-dark'>
        <h4 className='font-semibold mb-3 flex items-center'>
          <span className='!text-primary mr-2 vox-icon size-sm vx-icon-341'></span>
          Detalles del Servicio
        </h4>
        <div className='space-y-4'>
          <div>
            <p className='mb-1 font-semibold'>Nombre del Servicio</p>
            <p>{service.description}</p>
          </div>
          <div>
            <p className='mb-1 font-semibold'>Estado</p>
            <Chip label={service.state} />
          </div>
          <div>
            <p className='mb-1 font-semibold'>Contrato</p>
            <a href='#' className='text-primary capitalize'>
              {service.contract.name}
            </a>
          </div>
        </div>
      </div>

      {/* Ubicación y Descripción */}
      <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-4 flex-1 shadow-sm text-t-light dark:text-t-dark'>
        <h4 className='font-semibold mb-3 flex items-center'>
          <span className='!text-primary mr-2 vox-icon size-sm vx-icon-103'></span>
          Ubicación y Descripción
        </h4>
        <div className='space-y-4'>
          <div>
            <p className='mb-1 font-semibold'>Ubicación</p>
            <div className='flex items-center'>
              <span className='!text-primary mr-2 vox-icon size-sm vx-icon-351'></span>
              <p>{service.place.name}</p>
            </div>
          </div>
          <div>
            <p className='mb-1 font-semibold'>Descripción</p>
            <p>{service.place.description}</p>
          </div>
          <div>
            <p className='mb-1 font-semibold'>Ronda</p>
            <a href='#' className='text-primary capitalize'>
              {service.round.name}
            </a>
          </div>
        </div>
      </div>

      {/* Área de cobertura */}
      <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-3 flex-1 shadow-sm text-t-light dark:text-t-dark'>
        <div className='flex flex-row items-center justify-between mb-3'>
          <h4 className='font-semibold'>Área de cobertura</h4>
          <Chip
            label={`Radio: ${service.place.radius || 50}m`}
            color='primary'
          />
        </div>
        <div className='relative w-full h-56'>
          <MapLibrePointsMap
            sendPoints={() => {}}
            name='Map'
            center={{
              lat: service.place.latitude,
              lng: service.place.longitude,
            }}
            pointsAmount={1}
            pointsRef={points.value}
            condition={false}
            errorCondition=''
            radialPoint={null}
            errorRadialPoint=''
            radius={service.place.radius || 50}
            draggable={true}
            height='100%'
            clickPoint={() => {}}
            disablePointSelection={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
