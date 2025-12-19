import { useTranslation } from 'react-i18next';

export const SectionHeader = ({
  icon,
  title,
  right,
  center,
}: {
  icon: string;
  title: string;
  right?: any;
  center?: any;
}) => {
  const { t } = useTranslation();
  return (
    <div className='flex items-center justify-between gap-2 pb-2 border-b border-b-light dark:border-b-dark-light'>
      <div className='flex items-center gap-2 min-w-0'>
        <span
          className={`vox-icon vx-icon-${icon} !text-primary !text-sm shrink-0`}
        />
        <span className='text-xs font-semibold text-gray-800 dark:text-gray-100 truncate'>
          {t(title)}
        </span>
      </div>
      {center}
      {right}
    </div>
  );
};
