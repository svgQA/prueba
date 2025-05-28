import { Avatar } from '@/components/common/Avatar';
import { Chip } from '@/components/common/chip/chip';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { ToastManager } from '@/utils/toast/toast-manager';
import i18n from '@/i18n';
import { ShiftService } from '@/services';
import { Button } from '@/components/common/button/button';
import { useState } from 'preact/hooks';

interface ICheckData {
  time: string;
  platform: string;
  distance?: string;
  location: { lat: string; lng: string };
  url: string;
  type: string;
}

import { FormattedDate } from '@/components/compose/forms';
const DateInfo = ({ checkIn, checkOut, employee, shift }: any) => {
  const [checkInData, setCheckInData] = useState(checkIn);
  const [checkOutData, setCheckOutData] = useState(checkOut);

  const calculateCheckStatus = (
    checkTime: string,
    scheduleTime: string,
    isCheckIn: boolean
  ) => {
    if (!checkTime)
      return {
        message: 'Pendiente',
        color: 'bg-gray-200 text-gray-700',
      };

    const check = new Date(checkTime);
    const schedule = new Date(scheduleTime);

    const diffMinutes = (check.getTime() - schedule.getTime()) / (1000 * 60);

    if (isCheckIn) {
      // Para check in, es tarde si llega después de la hora programada
      if (diffMinutes > 0) {
        return {
          message: i18n.t('shift.expandable.date.checkError'),
          color: 'bg-red-200 text-red-700',
        };
      } else {
        return {
          message: i18n.t('shift.expandable.date.checkSuccess'),
          color: 'bg-green-200 text-green-700',
        };
      }
    } else {
      // Para check out, es temprano si sale antes de la hora programada
      if (diffMinutes < 0) {
        return {
          message: i18n.t('shift.expandable.date.checkSuccess'),
          color: 'bg-green-200 text-green-700',
        };
      } else {
        return {
          message: i18n.t('shift.expandable.date.checkError'),
          color: 'bg-red-200 text-red-700',
        };
      }
    }
  };

  const employeeName =
    employee?.name && employee?.surname
      ? `${employee.name} ${employee.surname}`
      : '';

  const checkInStatus = calculateCheckStatus(checkIn?.time, shift.start, true);
  const checkOutStatus = calculateCheckStatus(checkOut?.time, shift.end, false);

  const handleCheck = (checkData: ICheckData) => {
    const checkInData = {
      time: checkData.time,
      platform: checkData.platform,
      distance: checkData.distance,
      location: {
        lat: checkData.location.lat,
        lng: checkData.location.lng,
      },
      url: '',
    };

    if (checkData.type === 'CHECK_IN') {
      setCheckInData(checkInData);
    } else {
      setCheckOutData(checkOutData);
    }
  };

  return (
    <div class='flex gap-6 justify-center'>
      {/* Inicio del Turno */}
      <ShiftCard
        title='Inicio del Turno'
        name={employeeName}
        date={checkInData?.time || ''}
        time={checkInData?.time || ''}
        source={checkInData?.platform || ''}
        status={checkInStatus?.message || ''}
        statusColor={checkInStatus?.color || ''}
        distance={checkInData?.distance || ''}
        btnLabel='Check In'
        shiftId={shift?.id || 0}
        latitude={checkInData?.location.lat || 4.649251}
        longitude={checkInData?.location.lng || -74.106992}
        url={checkInData?.url || ''}
        disabled={!!checkOutData?.distance}
        onCheck={handleCheck}
      />

      {/* Finalización del Turno */}
      <ShiftCard
        title='Finalización del Turno'
        name={employeeName}
        date={checkOutData?.time || ''}
        time={checkOutData?.time || ''}
        source={checkOutData?.platform || ''}
        status={checkOutStatus?.message || ''}
        statusColor={checkOutStatus?.color || ''}
        distance={checkOutData?.distance || ''}
        btnLabel='Check Out'
        shiftId={shift?.id || 0}
        latitude={checkOutData?.location.lat || 4.649251}
        longitude={checkOutData?.location.lng || -74.106992}
        url={checkOutData?.url || ''}
        disabled={!checkInData?.distance || !!checkOutData?.distance}
        onCheck={handleCheck}
      />
    </div>
  );
};

interface IShiftCardProps {
  title: string;
  name: string;
  date: string;
  time: string;
  source: string;
  status: string;
  statusColor: string;
  btnLabel: string;
  shiftId: number;
  distance?: string;
  latitude: number;
  longitude: number;
  url: string;
  disabled: boolean;
  onCheck: (checkData: ICheckData) => void;
}

const ShiftCard = ({
  title,
  name,
  date,
  time,
  source,
  status,
  statusColor,
  distance,
  btnLabel,
  shiftId,
  latitude,
  longitude,
  url,
  disabled,
  onCheck,
}: IShiftCardProps) => {
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
      type: btnLabel === 'Check In' ? 'CHECK_IN' : 'CHECK_OUT',
    };

    const response = await ShiftService.createCheck(checkData, shiftId);
    if (response.getStatus()) {
      const { distance } = response.getOne();
      ToastManager.success(i18n.t('shift.expandable.date.success'));
      onCheck({
        type: checkData.type,
        time: checkData.date,
        platform: checkData.platform,
        distance: distance,
        location: {
          lat: checkData.latitude,
          lng: checkData.longitude,
        },
        url: '',
      });
    }
  };

  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm w-full text-t-light dark:text-t-dark flex flex-row gap-4 p-4'>
      {/* Título */}
      <div>
        <h2 className='font-medium mb-4'>{title}</h2>
        <div className='flex flex-col gap-4'>
          {/* Columna izquierda - Foto y nombre */}
          <div className='flex flex-col items-center mr-4 w-full'>
            <Avatar icon='023' src={url} />
            <p className='font-medium text-center'>{name}</p>
            <Chip label={status} color={statusColor} />
          </div>

          {/* Columna central - Información */}
          <div className='flex flex-col justify-center space-y-3 mr-4'>
            <div className='flex items-center'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-323'></span>
              </div>
              <div>
                <p className='font-semibold'>Fecha</p>
                <FormattedDate date={date} format='datetime' />
              </div>
            </div>

            <div className='flex items-center'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-325'></span>
              </div>
              <div>
                <p className='font-semibold'>Hora</p>
                <FormattedDate date={time} format='time' />
              </div>
            </div>

            <div className='flex items-center'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-326'></span>
              </div>
              <div>
                <p className='font-semibold'>Fuente</p>
                <p>{source}</p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-326'></span>
              </div>
              <div>
                <p className='font-semibold'>Distancia</p>
                <p>{distance}</p>
              </div>
            </div>

            <Button
              label={btnLabel}
              icon={btnLabel === 'Check In' ? '023' : '024'}
              disabled={disabled}
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
          </div>
        </div>
      </div>

      {/* Columna derecha - Mapa */}
      <div className='flex-1 w-full max-h-96 overflow-hidden'>
        <MapLibrePointsMap
          sendPoints={() => {}}
          name='Map'
          center={{
            lat: latitude,
            lng: longitude,
          }}
          pointsAmount={1}
          // pointsRef={points.value}
          pointsRef={[
            {
              id: 1,
              position: {
                lat: latitude,
                lng: longitude,
              },
            },
          ]}
          condition={false}
          errorCondition=''
          radialPoint={null}
          errorRadialPoint=''
          radius={50}
          draggable={true}
          width='100%'
          clickPoint={() => {}}
        />
      </div>
    </div>
  );
};

export default DateInfo;
