import { useTranslation } from 'react-i18next';

export const FieldInline = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: any;
  icon?: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className='flex items-center justify-between gap-3 min-w-0'>
      <div className='flex items-center gap-2 min-w-0'>
        {icon && (
          <span
            className={`vox-icon vx-icon-${icon} !text-primary !text-xs shrink-0`}
          />
        )}
        <span className='text-[11px] font-semibold text-t-light-dark dark:text-t-dark whitespace-nowrap'>
          {t(label)}
        </span>
      </div>
      <span className='text-xs text-gray-800 dark:text-gray-100 truncate'>
        {value || '-'}
      </span>
    </div>
  );
};
