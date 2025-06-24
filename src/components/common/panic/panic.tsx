import { useCallback, useEffect } from 'preact/hooks';
import { IPanic, IPanicProps } from './interface';
import { EventBus } from '@/utils/network/event.bus';
import {
  IBaseSSE,
  SSE_EVENTS,
  SSE_TYPE,
  SseManager,
} from '@/utils/network/sse/base';
import { FloatBadge } from '../badge/float';
import { Button } from '../button/button';
import { useSignal } from '@preact/signals';
import ExpanderNotification from '../notifications/expander.notification';
import { PanicService } from '@/services/memo/panic';
import { TextEllipsis } from '../text-ellipsis';
import { useUserStore } from '@/store/slices';

const Panic = (_panic: IPanicProps) => {
  const allPanic = useSignal<IPanic[]>([]);
  const { selectedCompany } = useUserStore();
  const isOpen = useSignal<boolean>(false);

  useEffect(() => {
    if (!selectedCompany) return;
    fetchPanic();
    fetchSSE();
    EventBus.on(SSE_TYPE.PANIC, handlePanicSSE);
  }, [selectedCompany]);

  const fetchSSE = useCallback(
    async () => await SseManager.getQuery(['panic', 'panic-button']),
    []
  );

  const handlePanicSSE = async (event: IBaseSSE) => {
    if (event.name === SSE_EVENTS.PANIC) {
      await fetchPanic();

      if(event.message.id){
        const panic = allPanic.value.find((panic) => panic.id === event.message.id);
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

    if (response.getStatus()) {
      return;
    }
  };

  return (
    <div className='relative flex flex-row justify-center items-center gap-2'>
      {allPanic.value.length > 0 ? (
        <TextEllipsis text={allPanic.value[0].message} maxWidth='200px' />
      ) : null}
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
              className='px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between gap-2'
              onClick={() => handleChangeStatus(panic.id)}
            >
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-700 dark:text-gray-200'>
                  {panic.message}
                </span>
              </div>

              {panic.user && (
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-700 dark:text-gray-200'>
                    {panic.user?.name + ' ' + panic.user?.surname}
                  </span>
                </div>
              )}
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
