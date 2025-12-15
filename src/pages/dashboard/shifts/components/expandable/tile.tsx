export const MetricTile = ({
  label,
  value,
  icon,
  tone,
  loading,
}: {
  label: string;
  value: any;
  icon: string;
  tone?: 'primary' | 'secondary' | 'error' | 'neutral';
  loading?: boolean;
}) => {
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
            {label}
          </div>
          <div className='mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100'>
            {loading ? '—' : value}
          </div>
        </div>
        <span className={`vox-icon vx-icon-${icon} ${toneCls} !text-base`} />
      </div>
    </div>
  );
};
