import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { Memo } from '../../utils/memos';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/button/button';
import { useEffect, useState } from 'preact/hooks';
import { MemoService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import i18n from '@/i18n';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { DateUtils } from '@/utils/utilities/dates';
import ShowFiles from '@/components/common/file/show.file';
import { useTranslation } from 'react-i18next';

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
        <p className='min-h-4 text-xs'>{label}</p>
      </div>
    </div>
  );
};

const SupervisorInfo = ({
  memo,
  resolved = false,
}: {
  memo: Memo;
  resolved?: boolean;
}) => {
  const { t } = useTranslation();
  const [btnLabel, setBtnLabel] = useState('Check In');

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
        title: i18n.t('shift.expandable.date.location.title'),
        message: i18n.t('shift.expandable.date.location.message'),
        onConfirm: () => {},
        onCancel: () => {},
      });
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      ToastManager.error(i18n.t('shift.expandable.date.location.gpsMessage'));
    } else {
      ToastManager.error(
        i18n.t('shift.expandable.date.location.timeoutMessage')
      );
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

    // const response = await MemoService.createCheck(checkData, memo.id);
    await MemoService.createCheck(checkData, memo.id);

    // if (response.getStatus()) {
    //   ToastManager.success(i18n.t('shift.expandable.date.success'));
    // }
  };

  return (
    <div className='w-full bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm p-3 text-b-dark-light dark:text-b-light-dark'>
      <div className='flex flex-row gap-4 w-full'>
        <div className='w-8/12 flex flex-col'>
          <div className='w-full h-3/12 flex flex-row justify-between'>
            <div className='flex-1'>
              {memo?.resource && (
                <ShowFiles resources={memo.resource} alertEmpty={true} />
              )}
            </div>
            {resolved &&
              memo.state !== 'RESOLVED' &&
              memo.state !== 'CLOSED' && (
                <Button
                  label={btnLabel}
                  icon={
                    btnLabel === 'OPENED' || btnLabel === 'SOLVE'
                      ? '023'
                      : '024'
                  }
                  disabled={btnLabel === 'SOLVE'}
                  onClick={() =>
                    showAlert({
                      title: btnLabel,
                      message: `¿Está seguro de que desea realizar el ${btnLabel}?`,
                      onConfirm: () => handleCheck(),
                      onCancel: () => {},
                    })
                  }
                  name={btnLabel}
                />
              )}
          </div>
          <div className='w-full h-9/12 flex'>
            <div className='w-1/2 grid grid-cols-2 gap-1 p-2'>
              <InfoContainer
                header={t('memos.supervisor.supervisor')}
                label={memo?.extraData?.company?.name}
                icon='321'
              />
              <InfoContainer
                header={t('memos.supervisor.service')}
                label={memo?.novelty?.name}
                icon='432'
              />
              <InfoContainer
                header={t('memos.supervisor.updated')}
                label={DateUtils.dateToFrontend(memo.updatedAt, {
                  format: 'datetime',
                })}
                icon='067'
              />
              <InfoContainer
                header={t('memos.supervisor.place')}
                label={memo?.extraData?.place?.address}
                icon='151'
              />
              <InfoContainer
                header={t('memos.supervisor.client')}
                label={memo?.extraData?.client?.name}
                icon='045'
              />
              <InfoContainer
                header={t('memos.supervisor.city')}
                label={memo?.extraData?.city?.name}
                icon='320'
              />
              <InfoContainer
                header={t('memos.supervisor.company')}
                label={memo?.extraData?.company?.name}
                icon='023'
              />
              <InfoContainer
                header={t('memos.supervisor.address')}
                label={memo?.extraData?.place?.address}
                icon='321'
              />
            </div>
            <div className='w-1/2 p-2 flex flex-col justify-between'>
              <div className='w-full'>
                <p className='mb-2 leading-tight text-lg'>
                  {memo?.description}
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
                  lat: memo?.extraData?.place?.latitude,
                  lng: memo?.extraData?.place?.longitude,
                },
              },
            ]}
            center={{
              lat: memo?.extraData?.place?.latitude || 0,
              lng: memo?.extraData?.place?.longitude || 0,
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
