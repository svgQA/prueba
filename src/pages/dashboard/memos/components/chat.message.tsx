import { Badge } from '@/components/common/badge/badge';
import { Button } from '@/components/common/button/button';
import MapViewer from '@/components/common/file/components/mapViewer';
import ShowFiles from '@/components/common/file/show.file';
import { MapPoint } from '@/components/common/map/interface';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { FormattedDate } from '@/components/compose/forms';
import { MemoService } from '@/services';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';

interface ChatMessageProps {
  message: string;
  isSender: boolean;
  title?: string;
  resource?: any;
  date?: string | Date;
  priority?: any;
  children?: React.ReactNode;
  id?: number;
  onReply?: (id: number) => void;
  isSelected?: boolean;
  status?: string;
  btrLabel?: string;
  solved?: boolean;
  reload?: () => void;
  mapPoint?: MapPoint;
}

export const ChatMessage = ({
  message,
  isSender,
  title,
  resource,
  date,
  priority,
  children,
  id,
  onReply,
  isSelected,
  status,
  solved = false,
  reload,
  mapPoint,
}: ChatMessageProps) => {
  const { t } = useTranslation();
  const [btnLabel, setBtnLabel] = useState('Check in');

  const getStatus = (state: string) => {
    const statesToSolve = new Set(['OPENED', 'IN_REVISION', 'CREATED']);
    const status = statesToSolve.has(state) ? 'SOLVE' : 'RESOLVED';
    setBtnLabel(status);
  };

  const getLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );
      return position;
    } catch (error) {
      getErrorGeolocation(error as GeolocationPositionError);
      return null;
    }
  };

  const getErrorGeolocation = (error: GeolocationPositionError) => {
    if (!(error instanceof GeolocationPositionError)) return;

    if (error.code === error.PERMISSION_DENIED) {
      showAlert({
        title: t('shift.expandable.date.location.title'),
        message: t('shift.expandable.date.location.message'),
        onConfirm: () => {},
        onCancel: () => {},
      });
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      ToastManager.error(t('shift.expandable.date.location.gpsMessage'));
    } else {
      ToastManager.error(t('shift.expandable.date.location.timeoutMessage'));
    }
  };

  const handleCheck = async () => {
    if (!id) return;
    const position = await getLocation();
    if (!position) return null;

    const checkData = {
      latitude: position.coords.latitude.toString(),
      longitude: position.coords.longitude.toString(),
      date: new Date().toISOString(),
      platform: 'web',
      type: btnLabel === 'SOLVE' ? 'SOLVE' : 'RESOLVED',
    };

    await MemoService.createCheck(checkData, id);
    reload?.();
  };

  status && solved && getStatus(status);

  return (
    <div
      className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} mb-4 text-black dark:text-white`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg cursor-pointer transition-colors duration-200 relative min-w-[350px]
          ${isSelected ? 'ring-2 ring-primary' : ''}
          ${isSender ? 'bg-primary-opacity dark:bg-gray-600 border-primary' : 'bg-b-light-light dark:bg-b-dark-light border-b-light-dark'}`}
      >
        {!isSender && (
          <span className='top-0 -right-10 absolute w-[35px]'>
            <Button
              name='btn-reply-memo'
              icon='221'
              square
              transparent
              borderless
              onClick={() => id && onReply?.(id)}
            />
            {solved && (
              <Button
                icon={
                  btnLabel === 'SOLVE' || btnLabel === 'RESOLVED'
                    ? '030'
                    : '032'
                }
                borderless
                transparent
                onClick={() =>
                  showAlert({
                    title: btnLabel,
                    message: `${t('message.confirm')} ${btnLabel}`,
                    onConfirm: () => handleCheck(),
                    onCancel: () => {},
                  })
                }
                name='btn-check-memo'
              />
            )}
            <MapViewer
              mapPoint={mapPoint}
              clickable={
                <Button
                  name='btn-map-viewer'
                  icon='289'
                  borderless
                  transparent
                ></Button>
              }
            />
          </span>
        )}
        {
          <div className='flex items-center gap-2 w-full justify-end'>
            {title && (
              <Badge
                label={title}
                icon='232'
                status='info'
                width='w-auto'
                borderless
              />
            )}
            {children}
          </div>
        }
        <div className='mb-2'>{message}</div>
        {resource && resource.length > 0 && (
          <div className='w-full flex flex-row items-center'>
            <ShowFiles
              resources={resource}
              // isSender={isSender}
              // mapPoint={mapPoint}
            />
            <MapViewer mapPoint={mapPoint} />
          </div>
        )}
        <div className='flex items-center gap-5 text-xs justify-end mt-2'>
          {/*
          {solved && (
            <div className='flex items-center gap-2'>
              <Button
                label={btnLabel}
                icon={
                  btnLabel === 'SOLVE' || btnLabel === 'RESOLVED'
                    ? '030'
                    : '032'
                }
                disabled={btnLabel === 'RESOLVED'}
                borderless
                onClick={() =>
                  showAlert({
                    title: btnLabel,
                    message: `¿Está seguro de que desea realizar el ${btnLabel}?`,
                    onConfirm: () => handleCheck(),
                    onCancel: () => {},
                  })
                }
                name={btnLabel}
              />
            </div>
          )}
          */}
          {priority && (
            <Badge
              label={priority}
              status={
                (priority === 'Alta'
                  ? 'error'
                  : priority === 'Media'
                    ? 'warning'
                    : 'success') as 'info' | 'error' | 'warning' | 'success'
              }
              outline
            />
          )}
          {date && <FormattedDate date={date} format='datetime' />}
          {status && (
            <div
              className={`w-3.5 h-3.5 rounded-full bg-${status === 'OPENED' ? 'primary' : status === 'RESOLVED' ? 'secondary' : 'ternary'}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
