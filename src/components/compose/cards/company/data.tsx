import { Card } from '@/components/common/card/card';
import { FunctionalComponent } from 'preact';
import { memo } from 'preact/compat';

type CardProps = {
  title: string;
  count: number | string;
  subtitle: string;
  color: string;
  icon: string;
};

export const CardData: FunctionalComponent<CardProps> = memo(
  ({ title, count, subtitle, color, icon = '071' }) => (
    <Card name={`card-data-${title}`}>
      <div className='flex items-center gap-6 w-full p-3'>
        <span
          className={`vox-icon vx-icon-${icon} w-20 h-20 flex items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40 !text-sky-500 dark:!text-sky-300 shrink-0 size-xl`}
        />
        <div className='flex-1 min-h-[60px] flex flex-col justify-center overflow-hidden'>
          <div className='w-full overflow-hidden min-h-8'>
            <h3 className='text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis'>
              {title}
            </h3>
          </div>
          <div className='w-full overflow-hidden min-h-8'>
            <p
              className={`text-2xl font-bold ${color} whitespace-nowrap overflow-hidden text-ellipsis`}
            >
              {count}
            </p>
          </div>
          <div className='w-full overflow-hidden min-h-6'>
            <p className='text-t-light-dark dark:text-t-dark-light whitespace-nowrap overflow-hidden text-ellipsis'>
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
);
