import { useEffect, useState } from 'preact/hooks';
import { ShiftService } from '@/services';
import { Badge } from '@/components/common/badge/badge';
import { Gauge } from '@/components/common/gauge/gauge';
import { useTranslation } from 'react-i18next';
import MapViewer from '@/components/common/file/components/mapViewer';
import { Button } from '@/components/common/button/button';
import { MapPoint } from '@/components/common/map/utils/interface';

interface PointStatus {
  point: string | number;
  total: number;
  status: {
    valid: number;
    invalid: number;
  };
}

interface PointsHistory {
  id: number,
  latitude: number,
  longitude: number,
}

const RoundInfo = ({
  shift,
  round,
  frequency,
}: {
  shift: number;
  round: number;
  frequency: number;
}) => {
  const { t } = useTranslation();
  const [points, setPoints] = useState<PointStatus[]>([]);
  const [pointsHistory, setPointsHistory] = useState<MapPoint[]>([]);

  useEffect(() => {
    getData();
    if (points) getPointsHistory();
  }, [shift]);

  const getData = async () => {
    const data = await ShiftService.getRoundHistory<PointStatus>(shift, round);
    if (!data.getStatus()) return;
    setPoints(data.getMany());
  };

  const getPointsHistory = async () => {
    const data = await ShiftService.getPointsHistory<PointsHistory>(shift, round);
    if (!data.getStatus()) return;
    setPointsHistory(data.getMany().map((point) => ({
      id: point.id,
      position: { lat: point.latitude, lng: point.longitude },
    })));
  };

  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm text-t-light dark:text-t-dark py-2 relative'>
      <div className='flex items-center justify-between absolute top-0 right-0 w-full'>
        <h2 className='font-medium p-2 bg-ternary text-white rounded-ee-lg'>
          {t('h_round')}
        </h2>
        <MapViewer
          mapPoint={pointsHistory}
          clickable={<Button name='btn-map-viewer' icon='289'></Button>}
        />
      </div>
      {points.length === 0 ? (
        <div className='flex items-center justify-center h-32'>
          <p className='text-gray-500 dark:text-gray-400'>{t('empty')}</p>
        </div>
      ) : (
        <div className='flex flex-row gap-2 flex-wrap justify-center'>
          {points.map((point: PointStatus, index: number) => {
            const percent =
              ((point?.status?.valid || 0) / (frequency || 1)) * 100;
            return (
              <div
                key={`point-${index}-${shift}`}
                className='
                flex flex-col border p-2 rounded-lg
                border-gray-200 dark:border-b-dark-dark
                bg-gray-50 dark:bg-b-dark text-gray-700 dark:text-gray-300
                '
              >
                <div className='flex flex-row justify-between gap-1'>
                  <Badge
                    label={`${t('h_point')}: ${point.point}`}
                    status='info'
                  />
                  <span>
                    {t('h_frequency')}: {frequency}
                  </span>
                </div>

                <div className='flex flex-row m-2 justify-between gap-2'>
                  <div className='flex flex-col w-6/12'>
                    <span className='font-thin text-sm text-center'>
                      {t('h_scans')}
                    </span>
                    <div className='flex flex-col justify-center items-center px-2 rounded-md h-full'>
                      <div className='text-green-300'>
                        <span className='vx-icon vx-icon-037' />
                        <strong className='text-2xl px-3'>
                          {point?.status?.valid}
                        </strong>
                      </div>
                      <div className='text-red-300'>
                        <span className='vx-icon vx-icon-008' />
                        <strong className='text-2xl px-3'>
                          {point?.status?.invalid}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col w-6/12'>
                    <span className='font-thin text-sm text-center'>
                      {t('h_percentage')}
                    </span>
                    <div className='bg-b-light-light dark:bg-b-dark-dark flex flex-row justify-center items-center px-2 rounded-md h-full'>
                      <Gauge progress={percent} size={14} color='teal' />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoundInfo;
