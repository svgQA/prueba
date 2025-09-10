import { useRef, useState, useEffect } from 'preact/hooks';
import { FloatBadge } from '../badge/float';
import { Button } from '../button/button';
import { INotification, INotificationsProps } from './utils/interface';
import { useLocation } from 'wouter';
import { localStorage } from '@/utils/storage';
import { SIDEBAR_MENUS } from '@/utils/menus/sidebar';
import ExpanderNotification from './components/expander.notification';
import { useSignal } from '@preact/signals';
import { Badge } from '../badge/badge';
// import { handleSendNotificationEvent } from './components/notification.event';
// import { useTranslation } from 'react-i18next';

/**
 * TODO: WebSocket
 */
import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  MessageEvent,
  MESSAGE_LISTENERS,
} from '@/utils/socket/manager/types';

const STORAGE_KEY = 'notifications';

const Notifications = ({ icon, iconSize = 'xsm' }: INotificationsProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isOpen = useSignal<boolean>(false);
  const [localNotifications, setLocalNotifications] = useState<INotification[]>(
    []
  );
  const [badgeColor, setBadgeColor] = useState('bg-primary');
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  // const { t } = useTranslation();

  useEffect(() => {
    const storedNotifications = localStorage.get<INotification[]>(STORAGE_KEY);
    const initialNotifications = Array.isArray(storedNotifications)
      ? storedNotifications
      : [];
    setLocalNotifications(initialNotifications);
    setNotifications(initialNotifications);
    // EventBus.on(SSE_TYPE.ALL, handleNotificationSSE);
    // return () => {
    //   EventBus.off(SSE_TYPE.ALL, handleNotificationSSE);
    // };
  }, []);

  useEffect(() => {
    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.ALL,
      handleMessage,
      MESSAGE_LISTENERS.ALL
    );
    return () => {
      WebSocketManager.remove(
        SOCKET_MESSAGE_AREA.ALL,
        MESSAGE_LISTENERS.ALL
      );
    };
  }, []);

  const handleMessage = (event: InSocketMessage<MessageEvent>) => {
    const { message, notification } = event.payload;
    const { area } = event.from;
    if (!notification) return;

    let newNotification = {
      id: String(notifications.length + 1),
      id_message: message?.id,
      label: area,
      value: message,
      status: notification,
      icon: SIDEBAR_MENUS.find((menu) => menu.label === area)?.icon,
      redirect: SIDEBAR_MENUS.find((menu) => menu.id === area)?.to,
    };

    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications, newNotification];
      setLocalNotifications(updatedNotifications);
      localStorage.set(STORAGE_KEY, updatedNotifications);
      return updatedNotifications;
    });

    audioRef.current?.play();
    setShouldAnimate(true);
    setTimeout(() => setShouldAnimate(false), 500);
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const uniqueNotifications = notifications.filter(
        (newNotif) =>
          !localNotifications.some(
            (existingNotif) => existingNotif.value === newNotif.value
          )
      );

      if (uniqueNotifications.length > 0) {
        const allNotifications = [
          ...localNotifications,
          ...uniqueNotifications,
        ];
        setLocalNotifications(allNotifications);
        localStorage.set(STORAGE_KEY, allNotifications);

        // Efecto especial para múltiples notificaciones
        if (uniqueNotifications.length > 1) {
          let pulseCount = 0;
          const maxPulses = 6; // 3 segundos con cambios cada 500ms

          const pulseInterval = setInterval(() => {
            setBadgeColor((prev) =>
              prev === 'bg-secondary' ? 'bg-primary' : 'bg-secondary'
            );
            pulseCount++;

            if (pulseCount >= maxPulses) {
              clearInterval(pulseInterval);
              setBadgeColor('bg-primary');
            }
          }, 500);

          return () => clearInterval(pulseInterval);
        } else {
          // Efecto normal para una sola notificación
          setBadgeColor('bg-caution');
          const timer = setTimeout(() => {
            setBadgeColor('bg-primary');
          }, 3000);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [notifications]);

  const handleRedirect = (info: INotification) => {
    if (!info.redirect) return;
    const updatedNotifications = localNotifications.filter(
      (n) => n.value !== info.value
    );
    setLocalNotifications(updatedNotifications);
    localStorage.set(STORAGE_KEY, updatedNotifications);
    const index = notifications.indexOf(info);
    if (index > -1) notifications.splice(index, 1);

    // Emit custom event for notification click
    if (info.id_message) {
      const event = new CustomEvent('notification-click', {
        detail: { id: info.id_message },
      });
      window.dispatchEvent(event);
    }

    navigate(
      info.id_message
        ? `${info.redirect}?notificationId=${info.id_message}`
        : info.redirect
    );

    // handleSendNotificationEvent(info.id_message, 'notification-click', t);
    // navigate(info.redirect);
    isOpen.value = false;
  };

  const handleDelete = (info: INotification, event: MouseEvent) => {
    event.stopPropagation();
    const updatedNotifications = localNotifications.filter(
      (n) => n.value !== info.value
    );
    setLocalNotifications(updatedNotifications);
    localStorage.set(STORAGE_KEY, updatedNotifications);

    const index = notifications.indexOf(info);
    if (index > -1) {
      notifications.splice(index, 1);
    }
  };

  const allNotifications =
    notifications.length > 0 ? notifications : localNotifications;

  return (
    <div className='relative'>
      <audio ref={audioRef} src='/sound/sound.mp3' preload='auto' />
      <FloatBadge
        label={allNotifications.length || '0'}
        color={badgeColor}
        animate={shouldAnimate}
      >
        <Button
          name='user-action'
          icon={icon}
          iconSize={iconSize}
          borderless
          unpadded
          onClick={() => (isOpen.value = !isOpen.value)}
        />
      </FloatBadge>
      <ExpanderNotification isOpen={isOpen.value}>
        {allNotifications.length > 0 ? (
          allNotifications.map((notification: any) => (
            <div
              key={notification.value}
              className='px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between gap-2'
              onClick={() => handleRedirect(notification)}
            >
              <div className='flex justify-between items-center gap-2 w-full'>
                {notification.icon && (
                  <span className={`vx-icon vx-icon-${notification.icon}`} />
                )}
                <div className='flex flex-row justify-between w-full'>
                  <span className='text-sm text-gray-700 dark:text-gray-200'>
                    {notification.label}
                  </span>
                  <Badge
                    label={notification.status || ''}
                    outline
                    status='warning'
                    width='w-20'
                  />
                </div>
              </div>
              <span
                className='vx-icon vx-icon-053 text-gray-400 hover:text-red-500 transition-colors'
                onClick={(e) => handleDelete(notification, e)}
              />
            </div>
          ))
        ) : (
          <div className='px-4 py-2 text-sm text-gray-500 dark:text-gray-400'>
            No hay notificaciones
          </div>
        )}
      </ExpanderNotification>
    </div>
  );
};

export default Notifications;
