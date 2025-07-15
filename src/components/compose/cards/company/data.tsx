import { Card } from '@/components/common/card/card';
import { FunctionalComponent } from 'preact';
import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

type CardProps = {
  title: string;
  count: number | string;
  subtitle: string;
  color: string;
  icon: string;
};

export const CardData: FunctionalComponent<CardProps> = memo(
  ({ title, count, subtitle, icon = '071' }) => {
    const { t } = useTranslation();
    return (
      <Card name={`card-data-${title}`}>
        <div className='flex items-center gap-6 w-full p-3'>
          <span
            className={`vox-icon vx-icon-${icon} w-16 h-16 flex items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900/40 !text-sky-500 dark:!text-sky-300 shrink-0 size-lg`}
          />
          <div className='flex-1 min-h-[60px] flex flex-row justify-center overflow-hidden'>
            <div className='w-full overflow-hidden min-h-12'>
              <h3 className='text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis'>
                {t(title)}
              </h3>
              <p className='text-t-light-dark dark:text-t-dark-light whitespace-nowrap overflow-hidden text-ellipsis'>
                {t(subtitle)}
              </p>
            </div>
            <div className='overflow-hidden px-3 text-center items-center text-3xl font-bold flex justify-center bg-sky-100 dark:bg-sky-900/40 rounded-full min-w-32'>
              {count}
            </div>
          </div>
        </div>
      </Card>
    );
  }
);
