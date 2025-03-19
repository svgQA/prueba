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
    <div class='p-6 bg-gray-100 rounded-lg shadow-md'>
      <div class='grid grid-cols-3 gap-4'>
        {/* Detalles del Servicio */}
        <div class='bg-white p-4 rounded-lg shadow'>
          <h4 class='text-blue-600 font-semibold flex items-center gap-2'>
            📄 Detalles del Servicio
          </h4>
          <p>
            <strong>Nombre del Servicio:</strong> {service.description}
          </p>
          <p>
            <strong>Estado:</strong>
            <span class='px-3 py-1 bg-blue-100 text-blue-600 rounded-full'>
              {service.state}
            </span>
          </p>
          <p>
            <strong>Contrato:</strong>
            <a href='#' class='text-blue-500'>
              {service.contract.name}
            </a>
          </p>
        </div>

        {/* Ubicación y Descripción */}
        <div class='bg-white p-4 rounded-lg shadow'>
          <h4 class='text-blue-600 font-semibold flex items-center gap-2'>
            📍 Ubicación y Descripción
          </h4>
          <p>
            <strong>Ubicación:</strong> 🏢 {service.place.name}
          </p>
          <p>
            <strong>Descripción:</strong>
            {service.place.description}
          </p>
          <p>
            <strong>Ronda:</strong>{' '}
            <a href='#' class='text-blue-500'>
              {service.round.name}
            </a>
          </p>
        </div>

        {/* Área de cobertura */}
        <div class='bg-white p-4 rounded-lg shadow'>
          <h4 class='text-blue-600 font-semibold'>Área de cobertura</h4>
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
            clickPoint={() => {}}
          />
          <p class='text-gray-500 text-sm'>
            📍 Radio: {service.place.radius || 50}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
