import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { Memo } from '../../utils/memos';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/button/button';
import { useEffect, useState } from 'preact/hooks';
import { MemoService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { DateUtils } from '@/utils/utilities/dates';
import ShowFiles from '@/components/common/file/show.file';
import { useTranslation } from 'react-i18next';
import { useSignal } from '@preact/signals';

const InfoContainer = ({
  label,
  icon,
  header,
}: {
  label?: string;
  icon?: string;
  header: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className='flex items-start gap-2'>
      <Avatar name='CL' size='sm' icon={icon} />
      <div>
        <p className='font-bold min-h-4'>{t(header)}</p>
        <p className='min-h-4 text-xs'>{t(label || '')}</p>
      </div>
    </div>
  );
};

const SupervisorInfo = ({
  memo,
  onStatusChange,
}: {
  memo: Memo;
  //evento para actualizar el estado de la memo
  onStatusChange?: (newStatus: string, memoId: number) => void;
}) => {
  const { t } = useTranslation();
  const [btnLabel, setBtnLabel] = useState('Check In');
  const status = useSignal<string | undefined>(memo.state);

  const getStatus = (state: string) => {
    const statesToSolve = new Set(['IN_REVISION', 'CREATED']);
    const status = statesToSolve.has(state) ? 'OPENED' : 'SOLVE';
    setBtnLabel(status);
  };

  useEffect(() => {
    getStatus(memo.state || '');
  }, [memo.state]);

  const getLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );
      return position;
    } catch (error) {
      getErrorGeolocation(error as GeolocationPositionError);
      return null;
    }
  };

  const getErrorGeolocation = (error: GeolocationPositionError) => {
    if (!(error instanceof GeolocationPositionError)) return;

    if (error.code === error.PERMISSION_DENIED) {
      showAlert({
        title: t('i_location_title'),
        message: t('i_location_message'),
        onConfirm: () => {},
        onCancel: () => {},
      });
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      ToastManager.error('s_gps_error');
    } else {
      ToastManager.error('s_gps_timeout');
    }
  };

  const handleCheck = async () => {
    const position = await getLocation();
    if (!position) return null;

    const checkData = {
      latitude: position.coords.latitude.toString(),
      longitude: position.coords.longitude.toString(),
      date: new Date().toISOString(),
      platform: 'web',
      type: btnLabel === 'OPENED' ? 'OPENED' : 'SOLVE',
    };

    const response = await MemoService.createCheck(checkData, memo.id);
    if (response.getStatus()) {
      const label = memo.panicUuid ? 'panic.success' : 'panic.success_novelty';
      ToastManager.success(t(label));
      const newStatus = 'RESOLVED';
      status.value = newStatus;
      onStatusChange?.(newStatus, memo.id);
    }
  };

  return (
    <div className='w-full rounded-lg shadow-sm'>
      <div className='flex flex-row gap-4 w-full'>
        <div className='w-8/12 flex flex-col'>
          <div className='flex items-center justify-between gap-1 border-b border-b-light-dark dark:border-b-dark max-h-20 w-full dark:bg-b-dark-dark bg-b-light-dark rounded-lg px-5'>
            <div className='flex-1'>
              {memo?.resource && (
                <ShowFiles resources={memo.resource} alertEmpty={true} />
              )}
            </div>
            {status.value != 'IN_REVISION' && status.value != 'CREATED' && (
              <Button
                name='btn-check-memo'
                label={status.value === 'OPENED' ? 'SOLVE' : 'RESOLVED'}
                icon='030'
                disabled={status.value === 'RESOLVED'}
                onClick={() =>
                  showAlert({
                    title: memo?.panicUuid
                      ? t('panic.title')
                      : t('panic.title_novelty'),
                    message: memo?.panicUuid
                      ? t('panic.body')
                      : t('panic.body_novelty'),
                    onConfirm: () => handleCheck(),
                    onCancel: () => {},
                  })
                }
                permissions={{ name: 'memo', state: 'close' }}
              />
            )}
          </div>
          <div className='w-full h-9/12 flex'>
            <div className='w-1/2 grid grid-cols-2 gap-1 p-2'>
              <InfoContainer
                header='h_supervisor'
                label={memo?.extraData?.company?.name}
                icon='321'
              />
              <InfoContainer
                header='h_service'
                label={
                  memo.panicUuid
                    ? t('panic_description')
                    : memo?.extraData?.service?.name
                }
                icon='432'
              />
              <InfoContainer
                header='h_updated'
                label={DateUtils.dateToFrontend(memo.updatedAt, {
                  format: 'datetime',
                })}
                icon='067'
              />
              <InfoContainer
                header='h_place'
                label={memo?.extraData?.place?.address || ''}
                icon='151'
              />
              <InfoContainer
                header='h_client'
                label={memo?.extraData?.client?.name}
                icon='045'
              />
              <InfoContainer
                header={t('h_city')}
                label={memo?.extraData?.city?.name}
                icon='320'
              />
              <InfoContainer
                header={t('d_company')}
                label={memo?.extraData?.company?.name}
                icon='023'
              />
              <InfoContainer
                header='h_address'
                label={memo?.extraData?.place?.address}
                icon='321'
              />
            </div>
            <div className='w-1/2 p-2 flex flex-col justify-between'>
              <div className='w-full'>
                <p className='mb-2 leading-tight text-lg'>
                  {memo.panicUuid ? t('panic_description') : ''}
                </p>
              </div>
              {/*
              <div className='w-full'>
                <div className='flex gap-1'>
                  <Chip label='Tarea 1' width='sm' icon='123' />
                  <Chip label='Tarea 1' width='sm' icon='123' />
                  <Chip label='Tarea 1' width='sm' icon='123' />
                </div>
              </div>
              */}
            </div>
          </div>
        </div>
        <div className='w-4/12 h-[250px]'>
          <MapLibrePointsMap
            name='map-points'
            pointsRef={[
              {
                id: memo?.id,
                position: {
                  lat: memo?.latitude,
                  lng: memo?.longitude,
                },
              },
            ]}
            center={{
              lat: memo?.latitude || 0,
              lng: memo?.longitude || 0,
            }}
            sendPoints={() => {}}
            height='100%'
            disablePointSelection={true}
          />
        </div>
      </div>
    </div>
  );
};

export default SupervisorInfo;
