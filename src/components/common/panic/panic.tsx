import { useEffect, useRef } from 'preact/hooks';
import { IPanic, IPanicProps } from './utils/interface';
import { EventBus } from '@/utils/network/event.bus';
import {
  IBaseSSE,
  SSE_EVENTS,
  SSE_TYPE,
} from '@/utils/network/sse/base';
import { FloatBadge } from '../badge/float';
import { Button } from '../button/button';
import { useSignal } from '@preact/signals';
import ExpanderNotification from '../notifications/components/expander.notification';
import { PanicService } from '@/services/memo/panic';
import { useUserStore } from '@/store/slices';
import NotificationBanner from '../notifications/components/notification.banner';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../Avatar';
// import { handleSendNotificationEvent } from '../notifications/components/notification.event';
import { useLocation } from 'wouter';

const Panic = (_panic: IPanicProps) => {
  const allPanic = useSignal<IPanic[]>([]);
  const { selectedCompany } = useUserStore();
  const isOpen = useSignal<boolean>(false);
  const notificationBannerRef = useRef<{
    startBannerAnimation: () => void;
    closeBanner: () => void;
  }>(null);
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!selectedCompany) return;
    fetchPanic();
    // fetchSSE();
    EventBus.on(SSE_TYPE.PANIC, handlePanicSSE);
    return () => {
      EventBus.off(SSE_TYPE.PANIC, handlePanicSSE);
    };
  }, [selectedCompany]);

  // const fetchSSE = useCallback(
  //   async () => await SseManager.getQuery(['panic', 'panic-button']),
  //   []
  // );

  const handlePanicSSE = async (event: IBaseSSE) => {
    if (event.name === SSE_EVENTS.PANIC) {
      await fetchPanic();

      if (event.message.id) {
        notificationBannerRef.current?.startBannerAnimation();
        const panic = allPanic.value.find(
          (panic) => panic.id === event.message.id
        );
        _panic.emitPanic?.(panic as IPanic);
      }
    }
  };

  const fetchPanic = async () => {
    const responsePanic = await PanicService.get_all_panic();
    if (!responsePanic.getStatus()) return;

    allPanic.value = responsePanic.getMany();
  };

  const handleChangeStatus = async (id: string) => {
    const response = await PanicService.changeStatusPanic(id);
    if (!response.getStatus()) return;
    notificationBannerRef.current?.closeBanner();
  };

  const handleRedirect = async (
    panicId: string,
    event: MouseEvent,
    panicUuId: string
  ) => {
    event.stopPropagation();
    if (panicUuId) {
      const eventEmit = new CustomEvent('go-to-panic-table', {
        detail: { id: panicUuId },
      });
      window.dispatchEvent(eventEmit);
    }

    navigate(panicUuId ? `/?notificationId=${panicUuId}` : '/');
    // handleSendNotificationEvent(panicUuId, 'go-to-panic-table', t);
    // navigate('/');
    await handleChangeStatus(panicId);
    isOpen.value = false;
  };

  return (
    <div className='relative flex flex-row justify-center items-center gap-2'>
      <NotificationBanner
        ref={notificationBannerRef}
        message='panic_button'
        color='error'
      />
      <FloatBadge
        label={allPanic.value.length || '0'}
        color='bg-red-500 text-white'
        animate={isOpen.value}
      >
        <Button
          name='user-action'
          icon='020'
          iconSize='xsm'
          borderless
          unpadded
          iconColor='text-red-500'
          onClick={() => (isOpen.value = !isOpen.value)}
        />
      </FloatBadge>
      <ExpanderNotification isOpen={isOpen.value}>
        {allPanic.value.length > 0 ? (
          allPanic.value.map((panic: IPanic) => (
            <div
              key={panic.id}
              className='px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between gap-1'
            >
              {panic.user && (
                <div className='flex flex-col items-center gap-2'>
                  <Avatar
                    name={panic.user?.name + ' ' + panic.user?.surname}
                    src={panic.user?.image}
                    size='sm'
                    square
                  />
                  <span className='text-xs text-gray-700 dark:text-gray-200'>
                    {panic.user?.name + ' ' + panic.user?.surname}
                  </span>
                </div>
              )}
              <span
                className='text-sm item-center text-gray-700 dark:text-gray-200'
                onClick={() => handleChangeStatus(panic.id)}
              >
                {t('panic_button')}
              </span>

              {/* {panic.user && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-700 dark:text-gray-200'>
                    {panic.user?.name + ' ' + panic.user?.surname}
                  </span>
                </div>
              )} */}

              <span
                className='vx-icon vx-icon-061 text-gray-400 hover:text-red-500 transition-colors'
                onClick={(e) => handleRedirect(panic.id, e, panic?.uuid)}
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

export default Panic;
