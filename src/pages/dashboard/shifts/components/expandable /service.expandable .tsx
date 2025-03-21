import { IService } from '@/types/shift/activity';
import { Map } from '@/components/common/map/map';
import { useSignal } from '@preact/signals';

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
    <div className='bg-b-content p-4'>
      <div className='flex flex-row gap-6'>
        {/* Detalles del Servicio */}
        <div className='bg-b-white rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='text-sm font-medium mb-3 flex items-center text-t-light'>
            <span className='!text-primary mr-2 vox-icon size-sm vx-icon-341'></span>
            Detalles del Servicio
          </h4>
          <div className='space-y-4 text-sm'>
            <div>
              <p className='text-t-light-dark mb-1'>Nombre del Servicio</p>
              <p className='text-t-light'>{service.description}</p>
            </div>
            <div>
              <p className='text-t-light-dark mb-1'>Estado</p>
              <span className='inline-block px-3 py-0.5 bg-primary-opacity text-primary rounded-full text-xs'>
                {service.state}
              </span>
            </div>
            <div>
              <p className='text-t-light-dark mb-1'>Contrato</p>
              <a href='#' className='text-primary'>
                {service.contract.name}
              </a>
            </div>
          </div>
        </div>

        {/* Ubicación y Descripción */}
        <div className='bg-b-white rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='text-sm font-medium mb-3 flex items-center text-t-light'>
            <span className='!text-primary mr-2 vox-icon size-sm vx-icon-103'></span>
            Ubicación y Descripción
          </h4>
          <div className='space-y-4 text-sm'>
            <div>
              <p className='text-t-light-dark mb-1'>Ubicación</p>
              <div className='flex items-center'>
                <span className='!text-primary mr-2 vox-icon size-sm vx-icon-351'></span>
                <p className='text-t-light'>{service.place.name}</p>
              </div>
            </div>
            <div>
              <p className='text-t-light-dark mb-1'>Descripción</p>
              <p className='text-t-light'>{service.place.description}</p>
            </div>
            <div>
              <p className='text-t-light-dark mb-1'>Ronda</p>
              <a href='#' className='text-primary'>
                {service.round.name}
              </a>
            </div>
          </div>
        </div>

        {/* Área de cobertura */}
        <div className='bg-b-white rounded-lg p-4 flex-1 shadow-sm'>
          <h4 className='text-sm font-medium mb-3 text-t-light'>
            Área de cobertura
          </h4>
          <div className='relative w-full' style={{ height: '180px' }}>
            <Map
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
              width='100%'
              height='100%'
              clickPoint={() => {}}
            />
          </div>
          <p className='text-t-light-dark text-xs mt-2 flex items-center'>
            <span className='!text-primary mr-2 vox-icon size-md vx-icon-103'></span>
            Radio: {service.place.radius || 50}m
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
