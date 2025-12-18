import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { ToastManager } from '@/utils/toast/toast-manager';

import { ShiftService } from '@/services';
import { Button } from '@/components/common/button/button';
import { useEffect, useState } from 'preact/hooks';
import { FormattedDate } from '@/components/compose/forms';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { IPresignedRequest } from '@/types/file';
import ShowFiles from '@/components/common/file/show.file';
import { Avatar } from '@/components/common/Avatar';
import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';
import { toSafeInteger } from 'lodash';
import { toSafeNumber } from '@/utils/general';
interface ICheckData {
  time?: string;
  date?: string;
  platform: string;
  distance?: string;
  location: { lat: string; lng: string };
  type: string;
  file: IPresignedRequest[];
}

interface ICheckStatus {
  message: string;
  color: StatusColor;
  label: string;
}

type StatusColor = 'error' | 'success' | 'warning' | 'info' | 'ternary';

const DateInfo = ({ checkIn, checkOut, employee, shift, onCheck }: any) => {
  const { t } = useTranslation();
  const [checkInData, setCheckInData] = useState(checkIn);
  const [checkOutData, setCheckOutData] = useState(checkOut);

  const checkInStatus = useSignal<ICheckStatus>({
    message: t('l_check_pending'),
    color: 'info',
    label: '',
  });
  const checkOutStatus = useSignal<ICheckStatus>({
    message: t('l_check_pending'),
    color: 'info',
    label: '',
  });

  const calculateCheckStatus: (
    checkTime: string,
    scheduleTime: string,
    isCheckIn: boolean
  ) => ICheckStatus = (checkTime, scheduleTime, isCheckIn) => {
    if (!checkTime)
      return {
        message: t('l_check_pending'),
        color: 'info',
        label: '',
      };

    const check = new Date(checkTime);
    const schedule = new Date(scheduleTime);

    const diffMinutes = (check.getTime() - schedule.getTime()) / (1000 * 60);

    if (isCheckIn) {
      // Para check in, es tarde si llega después de la hora programada
      if (diffMinutes > 0) {
        return {
          message: t('l_check_error'),
          color: 'error',
          label: t('l_check_late'),
        };
      } else {
        return {
          message: t('l_check_success'),
          color: 'success',
          label: t('l_check_on_time'),
        };
      }
    } else {
      // Para check out, es temprano si sale antes de la hora programada
      if (diffMinutes < 0) {
        return {
          message: t('l_check_success'),
          color: 'success',
          label: t('l_check_early'),
        };
      } else {
        return {
          message: t('l_check_error'),
          color: 'error',
          label: t('l_check_late'),
        };
      }
    }
  };

  const employeeName =
    employee?.name && employee?.surname
      ? `${employee.name} ${employee.surname}`
      : '';

  const handleCheck = (checkData: ICheckData) => {
    const check = {
      time: checkData.time,
      platform: checkData.platform,
      distance: checkData.distance,
      location: {
        lat: toSafeInteger(checkData.location.lat),
        lng: toSafeInteger(checkData.location.lng),
      },
      url: '',
      type: checkData.type,
    };

    onCheck(check);
  };
  useEffect(() => {
    checkInStatus.value = calculateCheckStatus(
      checkIn?.time ?? checkIn?.date,
      shift.start,
      true
    );
    checkOutStatus.value = calculateCheckStatus(
      checkOut?.time ?? checkOut?.date,
      shift.end,
      false
    );
    setCheckInData(checkIn);
    setCheckOutData(checkOut);
  }, [checkIn, checkOut, shift]);

  const ci_longitude = toSafeNumber(
    checkInData?.location?.lng ||
      checkInData?.lng ||
      checkInData?.longitude ||
      0.0
  );

  const ci_latitude = toSafeNumber(
    checkInData?.location?.lat ||
      checkInData?.lat ||
      checkInData?.latitude ||
      0.0
  );

  const co_latitude = toSafeNumber(
    checkOutData?.location?.lat ||
      checkOutData?.lat ||
      checkInData?.latitude ||
      0.0
  );

  const co_longitude = toSafeNumber(
    checkOutData?.location?.lng ||
      checkOutData?.lng ||
      checkInData?.longitude ||
      0.0
  );

  return (
    <div class='flex gap-6 justify-center'>
      {/* Inicio del Turno */}
      <ShiftCard
        // title={t('shiftStart')}
        name={employeeName}
        date={checkInData?.time || checkInData?.date || ''}
        time={checkInData?.time || checkInData?.date || ''}
        source={checkInData?.platform || ''}
        status={checkInStatus.value.message || ''}
        statusColor={checkInStatus.value.color || ''}
        label={checkInStatus.value.label}
        distance={checkInData?.distance || ''}
        btnLabel='Check In' // TODO: No traducir, porque se usa para una condiciòn
        shiftId={shift?.id || 0}
        latitude={ci_longitude}
        longitude={ci_latitude}
        file={checkInData?.file || []}
        disabled={shift?.status !== 'CREATED'}
        onCheck={handleCheck}
      />

      {/* Finalización del Turno */}
      <ShiftCard
        // title={t('shiftEnd')}
        name={employeeName}
        date={checkOutData?.time || checkOutData?.date || ''}
        time={checkOutData?.time || checkOutData?.date || ''}
        source={checkOutData?.platform || ''}
        status={checkOutStatus.value.message || ''}
        statusColor={checkOutStatus.value.color || ''}
        label={checkOutStatus.value.label}
        distance={checkOutData?.distance || ''}
        btnLabel='Check Out' // TODO: No traducir, porque se usa para una condiciòn
        shiftId={shift?.id || 0}
        latitude={co_latitude}
        longitude={co_longitude}
        file={checkOutData?.file || []}
        disabled={shift?.status !== 'OPENED'}
        onCheck={handleCheck}
        resource={shift.resource}
      />
    </div>
  );
};

interface IShiftCardProps {
  title?: string;
  name: string;
  date: string;
  time: string;
  source: string;
  status: string;
  statusColor: StatusColor;
  label: string;
  btnLabel: string;
  shiftId: number;
  distance?: string;
  latitude: number | string;
  longitude: number | string;
  file: IPresignedRequest[];
  disabled: boolean;
  onCheck: (checkData: ICheckData) => void;
  resource?: IPresignedRequest[];
}

const ShiftCard = ({
  // title,
  name,
  date,
  time,
  source,
  status,
  statusColor,
  label,
  distance,
  btnLabel,
  shiftId,
  latitude,
  longitude,
  file,
  disabled,
  // onCheck,
  resource,
}: IShiftCardProps) => {
  const { t } = useTranslation();

  const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
  const lng = typeof longitude === 'number' ? longitude : parseFloat(longitude);

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
      type: btnLabel === 'Check In' ? 'CHECK_IN' : 'CHECK_OUT',
    };

    const response = await ShiftService.createCheck(checkData, shiftId);
    if (response.getStatus()) {
      // const { distance } = response.getOne();
      ToastManager.success(t('s_success'));
      // onCheck({
      //   type: checkData.type,
      //   time: checkData.date,
      //   platform: checkData.platform,
      //   distance: distance,
      //   location: {
      //     lat: checkData.latitude,
      //     lng: checkData.longitude,
      //   },
      //   file: [],
      // });
    }
  };

  const formatResource = (resource: any) => {
    if (Array.isArray(resource)) {
      return resource;
    }
    if (typeof resource === 'object' && resource !== null) {
      if (resource.tracking) return resource.tracking;
    }
    return [];
  };

  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm w-full text-t-light dark:text-t-dark flex flex-row gap-3 p-1'>
      <div className='flex flex-col justify-between h-full'>
        {/* Columna izquierda - Foto y nombre */}
        <div className='flex flex-col items-center w-full'>
          {file.length ? (
            <ShowFiles resources={file} />
          ) : (
            <Avatar icon='023' size='md' />
          )}
          <div className='flex flex-col justify-center items-center pt-3'>
            <TextEllipsis text={name} maxWidth='200px'></TextEllipsis>
            <Badge label={status} status={statusColor} outline />
            <p>{label}</p>
          </div>
        </div>

        {/* Columna central - Información */}
        <div className='flex flex-col justify-center space-y-3 w-full'>
          <div className='flex items-center gap-x-2'>
            <span className='!text-primary vox-icon size-sm vx-icon-120'></span>
            <div className='flex flex-row justify-between w-full'>
              <p className='font-semibold'>{t('h_date')}</p>
              <FormattedDate date={date} format='date' />
            </div>
          </div>

          <div className='flex items-center gap-x-2'>
            <span className='!text-primary vox-icon size-sm vx-icon-130'></span>
            <div className='flex flex-row justify-between w-full'>
              <p className='font-semibold'>{t('h_time')}</p>
              <FormattedDate date={time} format='time' />
            </div>
          </div>

          <div className='flex items-center gap-x-2'>
            <span className='!text-primary vox-icon size-sm vx-icon-130'></span>
            <div className='flex flex-row justify-between w-full'>
              <p className='font-semibold'>{t('h_device')}</p>
              <p>{source}</p>
            </div>
          </div>

          <div className='flex items-center gap-x-2'>
            <span className='!text-primary vox-icon size-sm vx-icon-326'></span>
            <div className='flex flex-row justify-between w-full'>
              <p className='font-semibold'>{t('h_distance')}</p>
              <p>{(Number(distance) / 1000).toFixed(2)} Km</p>
            </div>
          </div>
        </div>

        {resource && (
          <div className='flex flex-col items-center mr-4 w-full'>
            <ShowFiles resources={formatResource(resource)} />
          </div>
        )}

        <Button
          label={btnLabel}
          icon={btnLabel === 'Check In' ? '023' : '024'}
          disabled={disabled}
          onClick={() =>
            showAlert({
              title: btnLabel,
              message: `${t('s_request')} ${btnLabel}`,
              onConfirm: () => handleCheck(),
              onCancel: () => {},
            })
          }
          name={btnLabel}
        />
      </div>

      {/* Columna derecha - Mapa */}
      <div
        className={`flex-1 w-full max-h-[44vh] overflow-hidden ring-1 rounded-lg ${lat + lng === 0 ? ' ring-error' : 'ring-primary'}`}
      >
        <MapLibrePointsMap
          sendPoints={() => {}}
          name='Map'
          center={{
            lat: lat,
            lng: lng,
          }}
          pointsAmount={1}
          pointsRef={[
            {
              id: 1,
              position: {
                lat: lat,
                lng: lng,
              },
            },
          ]}
          condition={false}
          errorCondition=''
          radialPoint={null}
          errorRadialPoint=''
          radius={50}
          draggable={false}
          disablePointSelection={true}
          width='100%'
          clickPoint={() => {}}
        />
      </div>
    </div>
  );
};

export default DateInfo;
