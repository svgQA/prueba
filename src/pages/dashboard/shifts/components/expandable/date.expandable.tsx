import { Avatar } from '@/components/common/Avatar';
import { Chip } from '@/components/common/chip/chip';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { toast } from 'react-toastify';
import i18n from '@/i18n';
import dayjs from 'dayjs';
import { ShiftService } from '@/services';
const DateInfo = ({ checkIn, checkOut, employee, shift }: any) => {
  console.log('shift ==>', shift);

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

  return (
    <div class='flex gap-6 justify-center p-4'>
      {/* Inicio del Turno */}
      <ShiftCard
        title='Inicio del Turno'
        name={employeeName}
        date={checkIn?.time || ''}
        time={checkIn?.time || ''}
        source={checkIn?.platform || ''}
        status={checkInStatus?.message || ''}
        statusColor={checkInStatus?.color || ''}
        distance={checkIn?.distance || ''}
        btnLabel='Check In'
        shiftId={shift?.id || 0}
        latitude={checkIn?.location.lat || 4.649251}
        longitude={checkIn?.location.lng || -74.106992}
        url={checkIn?.url || ''}
      />

      {/* Finalización del Turno */}
      <ShiftCard
        title='Finalización del Turno'
        name={employeeName}
        date={checkOut?.time || ''}
        time={checkOut?.time || ''}
        source={checkOut?.platform || ''}
        status={checkOutStatus?.message || ''}
        statusColor={checkOutStatus?.color || ''}
        distance={checkOut?.distance || ''}
        btnLabel='Check Out'
        shiftId={shift?.id || 0}
        latitude={checkOut?.location.lat || 4.649251}
        longitude={checkOut?.location.lng || -74.106992}
        url={checkOut?.url || ''}
      />
    </div>
  );
};

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
}: {
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
}) => {
  const getLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );
      return position;
    } catch (error) {
      console.log('error', error);
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
      toast.error(i18n.t('shift.expandable.date.location.gpsMessage'), {
        position: 'top-right',
      });
    } else {
      toast.error(i18n.t('shift.expandable.date.location.timeoutMessage'), {
        position: 'top-right',
      });
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
      toast.success(i18n.t('shift.expandable.date.success'));
    }
  };

  return (
    <div className='bg-b-light-dark dark:bg-b-dark-light rounded-lg shadow-sm p-4 w-full text-t-light dark:text-t-dark flex flex-row gap-4'>
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
                <p className='text-sm'>{dayjs(date).format('DD/MM/YYYY')}</p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-325'></span>
              </div>
              <div>
                <p className='font-semibold'>Hora</p>
                <p className='text-sm'>{dayjs(time).format('HH:mm')}</p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-326'></span>
              </div>
              <div>
                <p className='font-semibold'>Fuente</p>
                <p className='text-sm'>{source}</p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-326'></span>
              </div>
              <div>
                <p className='font-semibold'>Distancia</p>
                <p className='text-sm'>{distance}</p>
              </div>
            </div>

            <button
              onClick={() =>
                showAlert({
                  title: btnLabel,
                  message: `¿Está seguro de que desea realizar el ${btnLabel}?`,
                  onConfirm: () => handleCheck(),
                  onCancel: () => {},
                })
              }
              className='px-3 py-1 text-sm text-primary border border-primary rounded-md hover:bg-primary-opacity'
            >
              {btnLabel}
            </button>
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
