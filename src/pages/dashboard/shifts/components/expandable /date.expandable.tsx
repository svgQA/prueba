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
    <div class='w-full max-w-sm p-4 bg-white shadow-lg rounded-lg flex flex-col gap-4'>
      <h2 class='text-lg font-semibold'>{title}</h2>
      <div class='flex items-center gap-4'>
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
        <div>
          <p class='font-semibold'>{name}</p>
          <span class={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {status}
          </span>
        </div>
      </div>
      <div class='text-sm text-gray-600 space-y-2'>
        <div class='flex items-center gap-2'>
          <span class='w-4 h-4'>📅</span> <span>{date}</span>
        </div>
        <div class='flex items-center gap-2'>
          <span class='w-4 h-4'>⏰</span> <span>{time}</span>
        </div>
        <div class='flex items-center gap-2'>
          <span class='w-4 h-4'>🌍</span> <span>{source}</span>
        </div>
      </div>
      <div class='relative w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center'>
        <span class='text-xs bg-white px-2 py-1 rounded shadow'>
          {distance}
        </span>
      </div>
    </div>
  );
};

export default DateInfo;
