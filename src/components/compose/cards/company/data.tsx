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
      <div className='flex items-center gap-6 min-w-96'>
        <span
          className={`vox-icon vx-icon-${icon} w-20 h-20 flex items-center justify-center rounded-full bg-sky-100 shrink-0`}
          style={{ fontSize: '2.5em', color: '#00BDD6' }}
        />
        <div className='flex-1 min-h-[60px] overflow-hidden'>
          <h3 className='text-xl font-bold truncate'>{title}</h3>
          <p className={`text-2xl font-bold ${color} truncate`}>{count}</p>
          <p className='text-t-light-dark dark:text-t-dark-light truncate'>
            {subtitle}
          </p>
        </div>
      </div>
    </Card>
  )
);
