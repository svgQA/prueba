import { IService, IShiftResponse } from '@/types/shift/activity';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import ShowFiles from '@/components/common/file/show.file';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from './header';
import { FieldInline } from './inline';

const ServiceInfo = ({
  service,
  shift,
}: {
  service: IService;
  shift: IShiftResponse;
}) => {
  const { t } = useTranslation();

  const lat = service?.place?.latitude;
  const lng = service?.place?.longitude;
  const radius = service?.place?.radius || 50;

  const pointsRef = [
    {
      id: 1,
      position: { lat, lng },
    },
  ];

  return (
    <div className='w-full'>
      <div className='bg-b-light-light dark:bg-b-dark-light rounded-xl border border-b-light dark:border-b-dark-light shadow-sm'>
        <div className='p-4'>
          <div className='grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch'>
            <div className='xl:col-span-4'>
              <div className='h-full rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
                <SectionHeader
                  icon='341'
                  title={t('h_service')}
                  right={<Badge label={service?.state} status='info' outline />}
                />

                <div className='pt-3 grid grid-cols-1 gap-2'>
                  <div className='min-w-0'>
                    <div className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark'>
                      {t('h_name')}
                    </div>
                    <div className='text-xs text-gray-800 dark:text-gray-100'>
                      <TextEllipsis
                        text={service?.description || '-'}
                        maxWidth='420px'
                      />
                    </div>
                  </div>

                  <FieldInline
                    label={t('h_contract')}
                    value={service?.contract?.name}
                    icon='195'
                  />

                  <FieldInline
                    label={t('h_round')}
                    value={service?.round?.name}
                    icon='331'
                  />

                  {shift?.resource && (
                    <div className='pt-2'>
                      <div className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark mb-2'>
                        {t('h_files')}
                      </div>
                      <ShowFiles resources={shift.resource} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='xl:col-span-4'>
              <div className='h-full rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
                <SectionHeader
                  icon='103'
                  title={t('h_location')}
                  right={
                    <Badge
                      label={`${t('h_radius')}: ${radius}m`}
                      color='primary'
                      status='info'
                      outline
                    />
                  }
                />

                <div className='pt-3 grid grid-cols-1 gap-2'>
                  <FieldInline
                    label={t('h_location')}
                    value={service?.place?.name}
                    icon='351'
                  />
                  <FieldInline
                    label={t('h_city')}
                    value={service?.place?.municipality?.name}
                    icon='072'
                  />
                  <FieldInline
                    label={t('h_address')}
                    value={service?.place?.address}
                    icon='072'
                  />

                  <div className='pt-2'>
                    <div className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark'>
                      {t('h_description')}
                    </div>
                    <div className='text-xs text-gray-800 dark:text-gray-100 line-clamp-3'>
                      {service?.place?.description || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='xl:col-span-4'>
              <div className='h-full rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light flex flex-col'>
                <MapLibrePointsMap
                  sendPoints={() => {}}
                  name='Map'
                  center={{ lat, lng }}
                  pointsAmount={1}
                  pointsRef={pointsRef}
                  condition={false}
                  errorCondition=''
                  radialPoint={null}
                  errorRadialPoint=''
                  radius={radius}
                  draggable={true}
                  height='100%'
                  clickPoint={() => {}}
                  disablePointSelection={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
