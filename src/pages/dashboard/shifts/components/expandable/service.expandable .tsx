import { IService, IShiftResponse } from '@/types/shift/activity';
import { useSignal } from '@preact/signals';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import ShowFiles from '@/components/common/file/show.file';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';

const ServiceInfo = ({
  service,
  shift,
}: {
  service: IService;
  shift: IShiftResponse;
}) => {
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
        <div className='flex flex-row items-center justify-between mb-3'>
          <h4 className='font-semibold mb-3 flex items-center'>
            <span className='!text-primary mr-2 vox-icon size-sm vx-icon-341'></span>
            Detalles del Servicio
          </h4>
          <Badge label={service.state} status='info' outline />
        </div>

        <div className='space-y-4'>
          <div>
            <p className='mb-1 font-semibold'>Nombre del Servicio</p>
            <TextEllipsis
              text={service.description}
              maxWidth='500px'
            ></TextEllipsis>
          </div>
          {shift.resource && (
            <div className='w-40'>
              {/* <p className='mb-1 font-semibold'>Archivos</p> */}
              <ShowFiles resources={shift.resource} />
            </div>
          )}
          <div>
            <p className='mb-1 font-semibold'>Contrato</p>
            <p className='text-primary capitalize'>{service.contract.name}</p>
          </div>
          {/* <div className='flex flex-row items-center justify-between mb-3'>
            <h4 className='font-semibold'>Contrato</h4>
              <p className='text-primary capitalize'>{service.contract.name}</p>
          </div> */}
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
            <p className='text-primary capitalize'>{service.round.name}</p>
          </div>
        </div>
      </div>

      {/* Área de cobertura */}
      <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-3 flex-1 shadow-sm text-t-light dark:text-t-dark'>
        <div className='flex flex-row items-center justify-between mb-3'>
          <h4 className='font-semibold'>Área de cobertura</h4>
          <Badge
            label={`Radio: ${service.place.radius || 50}m`}
            color='primary'
            status='info'
            outline
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
