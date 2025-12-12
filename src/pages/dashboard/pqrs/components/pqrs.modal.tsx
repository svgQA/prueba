import { Signal, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import dayjs from 'dayjs';

import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  MessageEvent,
  MESSAGE_LISTENERS,
  SOCKET_MESSAGE_EVENTS,
} from '@/utils/socket/manager/types';

import { Modal } from '@/components/common/modal/modal';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { FormattedDate } from '@/components/compose/forms';
import MapLibreShowPoints from '@/components/common/map/MapLibreShowPoints';

import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';

import { PqrsService } from '@/services/pqrs/pqrs';

import { ICPqrsRequest } from '../utils/interface';
import PqrsInferenceModal from './modal/pqrs-inference.modal';
import PqrsGeneralModal from './modal/pqrs-general.modal';
// import { OtsService } from '@/services/pqrs/ots';
// import { Button } from '@/components/common/button/button';

interface IProps {
  showModal: Signal<boolean>;
  closeModal: () => void;
  id?: number;
  tags?: any[];
  areas?: any;
}

export const PqrsModal = ({
  showModal,
  closeModal,
  id,
  tags,
  // areas,
}: IProps) => {
  const { t } = useTranslation();
  const { selectedCompany } = useUserStore();

  const loading = useSignal<boolean>(false);
  const pqrs = useSignal<ICPqrsRequest | null>(null);
  const activeTab = useSignal<string>('general');

  useEffect(() => {
    if (selectedCompany) {
      fetchInitialValues();

      WebSocketManager.add(
        SOCKET_MESSAGE_AREA.PQRS,
        handleMessage,
        MESSAGE_LISTENERS.PQRS_AI
      );
      return () => {
        WebSocketManager.remove(
          SOCKET_MESSAGE_AREA.PQRS,
          MESSAGE_LISTENERS.PQRS_AI
        );
      };
    }
  }, [selectedCompany, id]);

  const handleMessage = (event: InSocketMessage<MessageEvent>) => {
    const { type: name } = event.payload;
    if (name === SOCKET_MESSAGE_EVENTS.UPDATE) fetchInitialValues();
  };

  const fetchInitialValues = async () => {
    if (!id) return;
    loading.value = true;
    const response = await PqrsService.get_by_id(String(id));
    if (!response.getStatus()) return;
    pqrs.value = response.getOne();
    loading.value = false;
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '310' },
    { id: 'analysis', label: 'Análisis IA', icon: '311' },
    ...(pqrs.value?.lat && pqrs.value?.lng
      ? [{ id: 'location', label: 'Ubicación', icon: 'location' }]
      : []),
  ];

  const getBadgeStatus = ():
    | 'error'
    | 'success'
    | 'warning'
    | 'info'
    | 'ternary' => {
    const pqrsType = pqrs.value?.extraData?.pqrsType?.toLowerCase();
    if (pqrsType === 'queja') return 'error';
    if (pqrsType === 'sugerencia') return 'success';
    if (pqrsType === 'reclamo') return 'warning';
    if (pqrsType === 'recurso') return 'ternary';
    return 'info';
  };

  // const handleCreateOts = async (pqrsId: number) => {
  //   loading.value = true;
  //   const response = await OtsService.create(pqrsId);
  //   if (!response.getStatus()) return (loading.value = false);
  //   closeModal();
  //   loading.value = false;
  // };

  const calculateDaysToExpire = () => {
    if (!pqrs.value?.startDate) return null;
    
    const startDate = dayjs(pqrs.value.startDate);
    const expirationDate = startDate.add(15, 'days');
    const today = dayjs();
    
    const daysRemaining = expirationDate.diff(today, 'days');
    
    return {
      daysRemaining,
      isExpired: daysRemaining < 0,
      isExpiringSoon: daysRemaining >= 0 && daysRemaining <= 3,
    };
  };

  const expirationStatus = calculateDaysToExpire();

  return (
    <Modal
      open={showModal.value}
      onClose={closeModal}
      name='modal-pqrs-details'
      width='w-11/12 max-w-6xl'
      position='fixed'
      header={
        <div className='flex flex-col gap-1'>
          <h3 className='text-xl font-semibold text-t-light dark:text-white'>
            {t('h_pqrs_details')}
          </h3>
          <p className='text-sm text-gray-text-light dark:text-b-light-dark'>
            Visualiza los datos clave del caso y el análisis de IA con una vista
            más legible.
          </p>
        </div>
      }
    >
      <div class='h-[75vh] w-full flex flex-col gap-4 bg-white dark:bg-b-dark px-4 pb-6 pt-2 overflow-hidden'>
        <div class='bg-b-light dark:bg-b-dark-light border border-gray-border dark:border-b-dark-light rounded-xl p-4 shadow-sm'>
          <div class='flex items-start justify-between gap-3 mb-3'>
            <div class='flex-1 min-w-0'>
              <div class='flex items-center gap-2 mb-1'>
                <h4 class='font-semibold text-t-light dark:text-white text-lg leading-tight'>
                  {pqrs.value?.extraData?.title || 'Sin nombre'}
                </h4>
              </div>
              <div class='flex items-center gap-2 text-xs text-gray-text-light dark:text-b-light-dark'>
                {pqrs.value?.identifier && (
                  <>
                    <span class='font-mono'>
                      #{pqrs.value.identifier}
                    </span>
                    {pqrs.value?.contract && (
                      <>
                        <span>•</span>
                        <span>{pqrs.value.contract}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {pqrs.value?.extraData?.pqrsType && (
              <Badge
                label={pqrs.value.extraData.pqrsType}
                status={getBadgeStatus()}
                outline={false}
                size='md'
                width='w-fit'
              />
            )}

            {/*pqrs.value?.area?.name && pqrs.value.id && (
              <Button
                name='btn-click-ots'
                label='create OTS'
                onClick={() => handleCreateOts(pqrs.value?.id!!)}
              />
            )*/}
          </div>

          {pqrs.value?.extraData?.observation && (
            <div class='mb-3 pb-3 border-b border-gray-border dark:border-b-dark-light'>
              <TextEllipsis
                text={pqrs.value.extraData.observation}
                maxWidth='100%'
                lines={2}
                className='text-sm text-gray-text-light dark:text-b-light-dark leading-relaxed'
              />
            </div>
          )}

          <div class='space-y-3'>
            <div class='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs'>
              {pqrs.value?.startDate && (
                <div class='flex items-center gap-1.5 text-gray-text-light dark:text-b-light-dark bg-white dark:bg-b-dark rounded-lg px-3 py-2 border border-gray-border dark:border-b-dark-light'>
                  <span>📅</span>
                  <FormattedDate
                    date={String(pqrs.value?.startDate)}
                    format='date'
                  />
                </div>
              )}

              {/* {areas && (
                <div class='flex items-center gap-1.5 text-gray-text-light dark:text-b-light-dark bg-white dark:bg-b-dark rounded-lg px-3 py-2 border border-gray-border dark:border-b-dark-light'>
                  <span>🏢</span>
                  <span class='truncate capitalize'>
                    {areas.replace(/_/g, ' ')}
                  </span>
                </div>
              )} */}

              {pqrs.value?.contactEmail && (
                <div class='flex items-center gap-1.5 text-gray-text-light dark:text-b-light-dark bg-white dark:bg-b-dark rounded-lg px-3 py-2 border border-gray-border dark:border-b-dark-light'>
                  <span>📧</span>
                  <TextEllipsis
                    text={pqrs.value.contactEmail}
                    maxWidth='100%'
                    lines={1}
                  />
                </div>
              )}
            </div>


            <div class='flex flex-wrap gap-1.5 pt-2 border-t border-gray-border dark:border-b-dark-light'>
              {tags &&
                tags.map((tag, idx) => (
                  <span
                    key={idx}
                    class='px-2 py-0.5 bg-b-light dark:bg-b-dark text-gray-text-light dark:text-b-light-dark text-xs rounded border border-gray-border/60 dark:border-b-dark-light/60'
                  >
                    #{String(tag)}
                  </span>
                ))}

              {pqrs.value?.resources && (
                <span class='px-2 py-0.5 bg-primary-opacity text-primary text-xs rounded flex items-center gap-1 border border-primary/30'>
                  📎 Archivos
                </span>
              )}

              {expirationStatus?.isExpired && (
                <span class='px-2 py-0.5 bg-error-opacity text-error text-xs rounded flex items-center gap-1 font-medium border border-error/40'>
                  ⏰ Expirado hace {Math.abs(expirationStatus.daysRemaining)}d
                </span>
              )}

              {expirationStatus?.isExpiringSoon && !expirationStatus?.isExpired && (
                <span class='px-2 py-0.5 bg-warning-opacity text-warning text-xs rounded flex items-center gap-1 font-medium border border-warning/40'>
                  ⏰ Expira en {expirationStatus.daysRemaining}d
                </span>
              )}
            </div>
          </div>
        </div>

        {/*This is the tabs*/}
        <div class='border-b border-gray-border dark:border-b-dark-light mb-1 px-1'>
          <nav class='flex space-x-1 overflow-x-auto vox-scroll-design pb-1'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                class={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab.value === tab.id
                    ? 'bg-primary-opacity text-primary border-b-2 border-primary shadow-sm'
                    : 'text-gray-text-light dark:text-b-light-dark hover:text-t-light hover:bg-b-light dark:hover:bg-b-dark-light'
                  }`}
                onClick={() => (activeTab.value = tab.id)}
              >
                <span class={`mr-1 vox-icon vx-icon-${tab.icon}`}></span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div class='flex-1 overflow-y-auto p-3 rounded-lg bg-b-light dark:bg-b-dark-light shadow-inner vox-scroll-design'>
          {activeTab.value === 'general' && <PqrsGeneralModal pqrs={pqrs} />}
          {activeTab.value === 'analysis' && <PqrsInferenceModal pqrs={pqrs} />}
          {pqrs.value?.lat &&
            pqrs.value?.lng &&
            activeTab.value === 'location' && (
              <MapLibreShowPoints
                name='pqrs-location-map'
                pointsRef={[
                  {
                    id: pqrs.value.id || 0,
                    position: {
                      lat: pqrs.value.lat,
                      lng: pqrs.value.lng,
                    },
                    name:
                      pqrs.value?.clientName ||
                      'Ubicación PQRS',
                  },
                ]}
                sendPoints={() => { }}
                center={{ lat: pqrs.value.lat, lng: pqrs.value.lng }}
                height='100%'
                disablePointSelection={true}
              />
            )}
        </div>
      </div>
    </Modal>
  );
};
