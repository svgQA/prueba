import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { Memo } from '../../utils/memos';
import { Chip } from '@/components/common/chip/chip';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/button/button';
import { useEffect, useState } from 'preact/hooks';
import { MemoService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import i18n from '@/i18n';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { DateUtils } from '@/utils/utilities/dates';
import { showFiles } from '@/components/common/file/show.file';

const SupervisorInfo = ({
  memo,
  resolved = false,
}: {
  memo: Memo;
  resolved?: boolean;
}) => {
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
      <div className='flex flex-row gap-4 p-3'>
        {/* Primera columna */}
        <div className='w-[30%] flex flex-col gap-4'>
          {/* Primera fila - Archivos y Botón */}
          <div className='w-full flex items-center gap-4'>
            <div className='flex-1'>
              {memo?.resource ? showFiles(memo?.resource) : <div>No hay archivos adjuntos</div>}
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

          {/* Segunda fila - Descripción */}
          <div className='w-full'>
            <p className='mb-2 leading-tight text-lg'>{memo?.description}</p>
          </div>

          {/* Tercera fila - Chips */}
          <div className='w-full'>
            <div className='flex gap-1'>
              <Chip label='Tarea' width='sm' />
              <Chip label='Tarea' width='sm' />
              <Chip label='Tarea' width='sm' />
            </div>
          </div>
        </div>

        {/* Segunda columna - Información */}
        <div className='w-[30%]'>
          <div className='flex gap-4'>
            {/* Columna de Supervisores */}
            <div className='w-1/2 space-y-2 mt-7'>
              <div className='flex items-start gap-2'>
                <Avatar name='SV' size='sm' />
                <div>
                  <p className='font-medium'>Supervisor</p>
                  <p>{memo?.extraData?.company.name}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Avatar name='SV' size='sm' />
                <div>
                  <p className='font-medium'>Servicio</p>
                  <p>{memo?.novelty?.name}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Avatar name='AU' size='sm' />
                <div>
                  <p className='font-medium'>Actualizado</p>
                  <p>
                    {DateUtils.dateToFrontend(memo.updatedAt, {
                      format: 'datetime',
                    })}
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Avatar name='LG' size='sm' />
                <div>
                  <p className='font-medium'>Lugar</p>
                  <p>{memo?.extraData?.place.address}</p>
                </div>
              </div>
            </div>

            {/* Columna de Clientes */}
            <div className='w-1/2 space-y-2 mt-7'>
              <div className='flex items-start gap-2'>
                <Avatar name='CL' size='sm' />
                <div>
                  <p className='font-medium'>Cliente</p>
                  <p>{memo?.extraData?.client.name}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Avatar name='CD' size='sm' />
                <div>
                  <p className='font-medium'>Ciudad</p>
                  <p>{memo?.extraData?.city.name}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Avatar name='CP' size='sm' />
                <div>
                  <p className='font-medium'>Compañía</p>
                  <p>{memo?.extraData?.company?.name}</p>
                </div>
              </div>
              <div className='flex items-start gap-2'>
                <Avatar name='DR' size='sm' />
                <div>
                  <p className='font-medium'>Dirección</p>
                  <p>{memo?.extraData?.place?.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tercera columna - Mapa */}
        <div className='w-[40%] h-[250px] rounded-lg overflow-hidden'>
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
