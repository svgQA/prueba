import { Map } from '@/components/common/map/map';
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
  distance,
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
    <div className="bg-b-white rounded-lg shadow-sm p-4 w-full">
      {/* Título */}
      <h2 className="text-t-light font-medium mb-4">{title}</h2>

      <div className="flex">
        {/* Columna izquierda - Foto y nombre */}
        <div className="flex flex-col items-center mr-4 w-24">
          {/* <div className="w-16 h-16 rounded-full overflow-hidden bg-b-light-dark mb-2">
            <img src="/placeholder.svg" alt={name} className="w-full h-full object-cover" />
          </div> */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-b-light mb-2">
            <span className="!text-primary vox-icon size-lg vx-icon-308"></span>
          </div>
          <p className="text-t-light font-medium text-center">{name}</p>
          <span className={`mt-1 inline-block px-3 py-0.5 rounded-full text-xs ${statusColor}`}>{status}</span>
        </div>

        {/* Columna central - Información */}
        <div className="flex flex-col justify-center space-y-3 mr-4">
        <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              <span className="!text-primary vox-icon size-sm vx-icon-323"></span>
            </div>
            <div>
              <p className="text-xs text-t-light-dark">Fecha</p>
              <p className="text-sm text-t-light">{date}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              <span className="!text-primary vox-icon size-sm vx-icon-325"></span>
            </div>
            <div>
              <p className="text-xs text-t-light-dark">Hora</p>
              <p className="text-sm text-t-light">{time}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              <span className="!text-primary vox-icon size-sm vx-icon-326"></span>
            </div>
            <div>
              <p className="text-xs text-t-light-dark">Fuente</p>
              <p className="text-sm text-t-light">{source}</p>
            </div>
          </div>
        </div>

        {/* Columna derecha - Mapa */}
        <div className="flex-1">
          <div className="relative h-32 rounded-lg overflow-hidden">
            <Map
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
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-b-white px-2 py-1 rounded-full text-xs shadow-sm">
              {distance}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateInfo;
