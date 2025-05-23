import { ComponentChildren } from 'preact';
import { Badge } from '@/components/common/badge/badge';
import { DateUtils, TimeStatus } from '@/utils/utilities/dates';

type BadgeStatus = 'success' | 'warning' | 'error' | 'info';

interface Location {
  lat: number;
  lng: number;
}

interface DateContrastProps {
  scheduledDate: string | Date;
  actualDate?: {
    time?: string;
    location?: Location | string;
  } | null;
  className?: string;
  children?: ComponentChildren;
  emptyValue?: string;
  type?: 'start' | 'end';
  toleranceMinutes?: number;
  showLocation?: boolean;
  customStatus?: (scheduled: string, actual: string) => TimeStatus;
}

const mapStatusToBadge = (status: TimeStatus): BadgeStatus => {
  if (status === 'default') return 'info';
  return status;
};

const formatLocation = (location: Location | string | undefined): string => {
  if (!location) return '';
  if (typeof location === 'string') return location;
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
};

export const DateContrast = ({
  scheduledDate,
  actualDate,
  className,
  children,
  emptyValue = '...',
  type = 'start',
  toleranceMinutes = 10,
  showLocation = false,
  customStatus,
}: DateContrastProps) => {
  if (!scheduledDate) return <span className={className}>{emptyValue}</span>;

  // Formatear para visualización en hora local
  const formatTime = (date: string | Date | null | undefined): string => {
    if (!date) return emptyValue;
    return DateUtils.fromUTCToLocal(date, 'DD HH:mm');
  };

  const scheduledTime = formatTime(scheduledDate);
  const actualTime = formatTime(actualDate?.time);

  const getStatus = (): TimeStatus => {
    if (customStatus) {
      return customStatus(scheduledTime, actualTime);
    }

    if (!actualDate?.location) return 'default';
    return DateUtils.getTimeStatus(
      actualDate.time,
      scheduledDate,
      type,
      toleranceMinutes
    );
  };

  const getLabel = () => {
    const baseLabel = `${scheduledTime} → ${actualTime}`;
    if (showLocation && actualDate?.location) {
      const locationStr = formatLocation(actualDate.location);
      if (locationStr) {
        return `${baseLabel} (${locationStr})`;
      }
    }
    return baseLabel;
  };

  return (
    <span className={className}>
      {children || (
        <Badge
          label={getLabel()}
          status={mapStatusToBadge(getStatus())}
          outline
          full
          size='xs'
        />
      )}
    </span>
  );
};
