import { Gauge } from '@/components/common/gauge/gauge';
import { useTranslation } from 'react-i18next';

type Point = {
  id: number;
  latitude: number;
  longitude: number;
  task: any[];
  form: string;
  roundHistory: any[];
};

interface CardTaskProps {
  point: Point;
  frequency: number;
}

export const CardTask = ({ point, frequency }: CardTaskProps) => {
  const { t } = useTranslation();
  const percent = ((point?.roundHistory?.length || 0) / frequency) * 100;
  return (
    <div className='flex flex-col items-center justify-between bg-b-light-dark dark:bg-b-dark-dark rounded-lg p-3'>
      <div className='flex flex-row justify-between pb-3 w-full items-center px-2'>
        <p>
          {t('h_point')}: {point.id}
        </p>
        <p>Freq: {frequency}</p>
        <Gauge progress={percent} />
      </div>

      <div className='flex flex-row items-center justify-between w-full justify-wrap max-w-96'>
        <div className='mx-1 rounded-md w-40 flex items-center flex-col bg-b-light-light text-t-light dark:bg-b-dark-light dark:text-t-dark-light justify-center'>
          <span className='vox-icon vx-icon-128 !text-primary mr-1'></span>
          <p className='font-bold text-2xl'>
            {point?.roundHistory?.length || 0}
          </p>
        </div>
        <div className='mx-1 rounded-md w-40 flex items-center flex-col bg-b-light-light text-t-light dark:bg-b-dark-light dark:text-t-dark-light justify-center'>
          <span className='vox-icon vx-icon-129 !text-orange-500 mr-1'></span>
          <p className='font-bold text-2xl'>0</p>
        </div>
      </div>
    </div>
  );
};
