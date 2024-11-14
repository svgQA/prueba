import { Card } from '@/components/common';
import { FunctionalComponent } from 'preact';
import { memo } from 'preact/compat';

type CardProps = {
  title: string;
  count: number;
  subtitle: string;
  color: string;
  icon: string;
};

export const CardData: FunctionalComponent<CardProps> = memo(
  ({ title, count, subtitle, color, icon = '071' }) => (
    <Card name={`card-data-${title}`} shadow>
      <div className=' p-6 flex items-center'>
        <span className={`vox-icon vx-icon-${icon} size-xl mr-4`} />
        <div>
          <h3 className='text-xl font-bold mb-2'>{title}</h3>
          <p className={`text-3xl font-bold ${color}`}>{count}</p>
          <p className='mt-2 text-t-light-dark dark:text-t-dark-light'>
            {subtitle}
          </p>
        </div>
      </div>
    </Card>
  )
);
