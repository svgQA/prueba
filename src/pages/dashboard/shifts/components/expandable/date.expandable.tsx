import { Avatar } from '@/components/common/Avatar';
import { Chip } from '@/components/common/chip/chip';
import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { useSignal } from '@preact/signals';

const DateInfo = ({ data = {} }: any) => {
  return (
    <div class='flex gap-6 justify-center p-4'>
      {/* Inicio del Turno */}
      <ShiftCard
        title='Inicio del Turno'
        name={data.name || 'Brian Scott'}
        date={data.startDate || '11/03/2024'}
        time={data.startTime || '17:53'}
        source={data.startSource || 'Desde la web'}
        status={data.startStatus || 'Temprano'}
        statusColor='bg-blue-200 text-blue-700'
        distance={data.startDistance || '8 metros'}
      />

      {/* Finalización del Turno */}
      <ShiftCard
        title='Finalización del Turno'
        name={data.name || 'Brian Scott'}
        date={data.endDate || '11/03/2024'}
        time={data.endTime || '17:53'}
        source={data.endSource || 'Desde la app'}
        status={data.endStatus || 'A Tiempo'}
        statusColor='bg-green-200 text-green-700'
        distance={data.endDistance || '6 metros'}
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
}: {
  title: string;
  name: string;
  date: string;
  time: string;
  source: string;
  status: string;
  statusColor: string;
  distance: string;
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

  return (
    <div className='bg-b-light-dark dark:bg-b-dark-light rounded-lg shadow-sm p-4 w-full text-t-light dark:text-t-dark flex flex-row gap-4'>
      {/* Título */}
      <div>
        <h2 className='font-medium mb-4'>{title}</h2>
        <div className='flex flex-col gap-4'>
          {/* Columna izquierda - Foto y nombre */}
          <div className='flex flex-col items-center mr-4 w-full'>
            <Avatar icon='023' />
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
                <p className='text-sm'>{date}</p>
              </div>
            </div>

            <div className='flex items-center'>
              <div className='flex-shrink-0 mr-2'>
                <span className='!text-primary vox-icon size-sm vx-icon-325'></span>
              </div>
              <div>
                <p className='font-semibold'>Hora</p>
                <p className='text-sm'>{time}</p>
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
          </div>
        </div>
      </div>

      {/* Columna derecha - Mapa */}
      <div className='flex-1 w-full max-h-96 overflow-hidden'>
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
      </div>
    </div>
  );
};

export default DateInfo;
