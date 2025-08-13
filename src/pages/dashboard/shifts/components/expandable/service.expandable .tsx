import { IService, IShiftResponse } from '@/types/shift/activity';
import { useSignal } from '@preact/signals';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import ShowFiles from '@/components/common/file/show.file';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { useTranslation } from 'react-i18next';

const ServiceInfo = ({
  service,
  shift,
}: {
  service: IService;
  shift: IShiftResponse;
}) => {
  const { t } = useTranslation();
  const points = useSignal<any>([
    {
      id: 1,
      position: {
        lat: service?.place?.latitude,
        lng: service?.place?.longitude,
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
            {t('h_service')}
          </h4>
          <Badge label={service?.state} status='info' outline />
        </div>

        <div className='space-y-4'>
          <div>
            <p className='mb-1 font-semibold'>{t('h_name')}</p>
            <TextEllipsis
              text={service?.description}
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
            <p className='mb-1 font-semibold'>{t('h_contract')}</p>
            <p className='text-primary capitalize'>{service?.contract?.name}</p>
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
          {t('h_location')}
        </h4>
        <div className='space-y-4'>
          <div>
            <p className='mb-1 font-semibold'>{t('h_location')}</p>
            <div className='flex items-center'>
              <span className='!text-primary mr-2 vox-icon size-sm vx-icon-351'></span>
              <p>{service?.place?.name}</p>
            </div>
          </div>
          <div>
            <p className='mb-1 font-semibold'>{t('h_description')}</p>
            <p>{service?.place?.description}</p>
          </div>
          <div>
            <p className='mb-1 font-semibold'>{t('h_round')}</p>
            <p className='text-primary capitalize'>{service?.round?.name}</p>
          </div>
        </div>
      </div>

      {/* Área de cobertura */}
      <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg p-3 flex-1 shadow-sm text-t-light dark:text-t-dark'>
        <div className='flex flex-row items-center justify-between mb-3'>
          <h4 className='font-semibold'>{t('h_coverage')}</h4>
          <Badge
            label={t('h_radius', {
              value: service?.place?.radius || 50,
            })}
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
              lat: service?.place?.latitude,
              lng: service?.place?.longitude,
            }}
            pointsAmount={1}
            pointsRef={points.value}
            condition={false}
            errorCondition=''
            radialPoint={null}
            errorRadialPoint=''
            radius={service?.place?.radius || 50}
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
