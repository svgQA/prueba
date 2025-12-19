import { toSafeNumber } from '@/utils/general';
import { useTranslation } from 'react-i18next';

export const MetricTile = ({
  label,
  value,
  icon,
  tone,
  loading,
  unit,
}: {
  label: string;
  unit?: string;
  value: number | string;
  icon: string;
  tone?: 'primary' | 'secondary' | 'error' | 'neutral';
  loading?: boolean;
}) => {
  const { t } = useTranslation();
  const toneCls =
    tone === 'secondary'
      ? '!text-secondary'
      : tone === 'error'
        ? 'text-error'
        : tone === 'neutral'
          ? 'text-t-light-dark dark:text-t-dark'
          : '!text-primary';

  return (
    <div className='rounded-lg bg-white/60 dark:bg-b-dark-dark/30 border border-b-light dark:border-b-dark-light p-3'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <div className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark'>
            {t(label)}
          </div>
          <div className='mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100'>
            {loading ? '—' : toSafeNumber(value).toFixed(1)} {unit}
          </div>
        </div>
        <span className={`vox-icon vx-icon-${icon} ${toneCls} !text-base`} />
      </div>
    </div>
  );
};
