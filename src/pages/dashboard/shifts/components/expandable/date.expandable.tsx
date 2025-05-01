import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useSignal } from '@preact/signals';
import { toast } from 'react-toastify';
import i18n from '@/i18n';
import { ShiftService } from '@/services/shift';
import dayjs from 'dayjs';
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
}: {
  title: string;
  name: string;
  date: string;
  time: string;
  source: string;
  status: string;
  statusColor: string;
  distance: string;
  btnLabel: string;
  shiftId: number;
}) => {
  const points = useSignal<any>([
    [
      {
        id: 1,
        position: {
          lat: 4.649251,
          lng: -74.106992,
        },
      },
    ],
  ]);

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
    <div className='bg-b-white rounded-lg shadow-sm p-4 w-full'>
      {/* Título */}
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-t-light font-medium'>{title}</h2>
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

      <div className='flex'>
        {/* Columna izquierda - Foto y nombre */}
        <div className='flex flex-col items-center mr-4 w-24'>
          {/* <div className="w-16 h-16 rounded-full overflow-hidden bg-b-light-dark mb-2">
            <img src="/placeholder.svg" alt={name} className="w-full h-full object-cover" />
          </div> */}
          <div className='w-16 h-16 rounded-full flex items-center justify-center bg-primary-opacity mb-2'>
            <span className='!text-primary vox-icon size-lg vx-icon-063'></span>
          </div>
          <p className='text-t-light font-medium text-center'>{name}</p>
          <span
            className={`mt-1 inline-block px-3 py-0.5 rounded-full text-xs ${statusColor}`}
          >
            {status}
          </span>
        </div>

        {/* Columna central - Información */}
        <div className='flex flex-col justify-center space-y-3 mr-4'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 mr-2'>
              <span className='!text-primary vox-icon size-sm vx-icon-323'></span>
            </div>
            <div>
              <p className='text-xs text-t-light-dark'>Fecha</p>
              <p className='text-sm text-t-light'>
                {dayjs(date).format('DD/MM/YYYY')}
              </p>
            </div>
          </div>

          <div className='flex items-center'>
            <div className='flex-shrink-0 mr-2'>
              <span className='!text-primary vox-icon size-sm vx-icon-325'></span>
            </div>
            <div>
              <p className='text-xs text-t-light-dark'>Hora</p>
              <p className='text-sm text-t-light'>
                {dayjs(time).format('HH:mm')}
              </p>
            </div>
          </div>

          <div className='flex items-center'>
            <div className='flex-shrink-0 mr-2'>
              <span className='!text-primary vox-icon size-sm vx-icon-326'></span>
            </div>
            <div>
              <p className='text-xs text-t-light-dark'>Fuente</p>
              <p className='text-sm text-t-light'>{source}</p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Mapa */}
        <div className='flex-1'>
          <div className='relative h-32 rounded-lg overflow-hidden'>
            {/* <Map
              sendPoints={() => {}}
              name='Map'
              center={{
                lat: 4.649251,
                lng: -74.106992,
              }}
              pointsAmount={1}
              pointsRef={points.value}
              condition={false}
              errorCondition=''
              radialPoint={null}
              errorRadialPoint=''
              radius={50}
              draggable={true}
              width='100%'
              clickPoint={() => {}}
            /> */}
            <MapLibrePointsMap
              sendPoints={() => {}}
              name='Map'
              center={{
                lat: 4.649251,
                lng: -74.106992,
              }}
              pointsAmount={1}
              pointsRef={points.value}
              condition={false}
              errorCondition=''
              radialPoint={null}
              errorRadialPoint=''
              radius={50}
              draggable={true}
              width='100%'
              clickPoint={() => {}}
            />
            <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-b-white px-2 py-1 rounded-full text-xs shadow-sm'>
              {distance}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateInfo;
