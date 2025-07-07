import { ComponentChildren } from 'preact';
import { DateUtils } from '@/utils/utilities/dates';

type DateFormat = 'human' | 'date' | 'datetime' | 'time' | 'relative';
type TimeZone = 'local' | 'utc';

interface FormattedDateProps {
  date: string | Date | null | undefined;
  format?: DateFormat;
  timeZone?: TimeZone;
  className?: string;
  children?: ComponentChildren;
  emptyValue?: string;
}

export const FormattedDate = ({
  date,
  format = 'datetime',
  timeZone = 'local',
  className,
  children,
  emptyValue = '-',
}: FormattedDateProps) => {
  if (!date) return <span className={className}>{emptyValue}</span>;
  const formatDate = (): string => {
    switch (format) {
      case 'human':
        return DateUtils.dateToFrontend(date, {
          format: 'D [de] MMMM [de] YYYY',
        });

      case 'date':
        return DateUtils.dateToFrontend(date, { format: 'DD/MM/YYYY' });

      case 'datetime':
        return DateUtils.dateToFrontend(date, { format: 'DD/MM/YYYY HH:mm' });

      case 'time':
        return DateUtils.hourToFrontend(date);

      case 'relative':
        return DateUtils.getRelativeTime(date);

      default:
        return DateUtils.dateToFrontend(date);
    }
  };

  const formattedDate: string =
    timeZone === 'utc' ? DateUtils.dateToBackend(date) : formatDate();

  return <span className={className}>{children || formattedDate}</span>;
};
