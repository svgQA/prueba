import { VNode } from 'preact';
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
import { Chip } from '@/components/common/chip/chip';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { Button } from '@/components/common/button/button';

import { DateUtils } from '@/utils/utilities/dates';
import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';

import { PqrsService } from '@/services/pqrs/pqrs';
import { OtsService } from '@/services/pqrs/ots';

import { ICPqrsRequest } from '../utils/interface';
import PqrsInferenceModal from './modal/pqrs-inference.modal';
import PqrsGeneralModal from './modal/pqrs-general.modal';

interface IProps {
  showModal: Signal<boolean>;
  closeModal: () => void;
  id?: number;
  tags?: any[];
}

export const PqrsModal = ({ showModal, closeModal, id, tags }: IProps) => {
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

  const tabs: ITab[] = [
    { id: 'general', label: 'General', icon: '310' },
    { id: 'analysis', label: 'Análisis IA', icon: '311' },
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

  const handleCreateOts = async (pqrsId: number) => {
    loading.value = true;
    const response = await OtsService.create(pqrsId);
    if (!response.getStatus()) return (loading.value = false);
    closeModal();
    loading.value = false;
  };

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

  const HeaderInformation = () => (
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
                <span class='font-mono'>#{pqrs.value.identifier}</span>
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
            size='sm'
            outline
          />
        )}

        {pqrs.value?.area && (
          <Badge
            label={pqrs.value?.area.name}
            status='info'
            size='sm'
            outline
          />
        )}

        {pqrs.value?.subarea && (
          <Badge
            label={pqrs.value?.subarea.name}
            status='success'
            size='sm'
            outline
          />
        )}

        {pqrs.value?.priority && (
          <Badge
            label={pqrs.value?.priority.name}
            status='warning'
            size='sm'
            outline
          />
        )}

        {pqrs.value?.area?.name === 'Mantenimiento' && pqrs.value.id && (
          <Button
            name='btn-click-ots'
            label='create OTS'
            onClick={() => handleCreateOts(pqrs.value?.id!!)}
          />
        )}
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
            <Badge
              label={
                'fecha: ' +
                DateUtils.dateToFrontend(pqrs.value?.startDate, {
                  format: 'DD/MM/YYYY',
                })
              }
              status='info'
              size='sm'
              outline
              full
            />
          )}

          {pqrs.value?.clientName && (
            <Badge
              label={'clientName: ' + pqrs.value?.clientName}
              status='info'
              size='sm'
              outline
              full
            />
          )}

          {pqrs.value?.contactEmail && (
            <Badge
              label={'contactEmail: ' + pqrs.value?.contactEmail}
              status='info'
              size='sm'
              outline
              full
            />
          )}

          {pqrs.value?.identifier && (
            <Badge
              label={'Cedula: ' + pqrs.value?.identifier}
              status='info'
              size='sm'
              outline
              full
            />
          )}

          {pqrs.value?.contract && (
            <Badge
              label={'contract: ' + pqrs.value?.contract}
              status='info'
              size='sm'
              outline
              full
            />
          )}

          {pqrs.value?.address && (
            <Badge
              label={'address: ' + pqrs.value?.address}
              status='info'
              size='sm'
              outline
              full
            />
          )}
        </div>

        <div class='flex flex-wrap gap-1.5 pt-2 border-t border-gray-border dark:border-b-dark-light'>
          {tags &&
            tags.map((tag, idx) => (
              <Chip key={idx} label={`#${String(tag)}`} width='lg' />
            ))}

          {pqrs.value?.resources && <Chip label={'📎 Archivos'} width='lg' />}

          {expirationStatus?.isExpired && (
            <Chip
              label={`⏰ Expirado hace ${Math.abs(expirationStatus.daysRemaining)}d`}
              width='lg'
            />
          )}

          {expirationStatus?.isExpiringSoon && !expirationStatus?.isExpired && (
            <Chip
              label={`⏰ Expira en ${expirationStatus.daysRemaining}d`}
              width='full'
            />
          )}
        </div>
      </div>
    </div>
  );

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
        <HeaderInformation />

        <TabInformation tabs={tabs} activeTab={activeTab}>
          <>
            {activeTab.value === 'general' && <PqrsGeneralModal pqrs={pqrs} />}
            {activeTab.value === 'analysis' && (
              <PqrsInferenceModal pqrs={pqrs} />
            )}
          </>
        </TabInformation>
      </div>
    </Modal>
  );
};

interface ITab<T = string> {
  id: T;
  label: string;
  icon: string;
}
interface ITabProp {
  tabs: ITab[];
  children: VNode | VNode[];
  activeTab: Signal<string>;
}

const TabInformation = ({ tabs, children, activeTab }: ITabProp) => (
  <>
    <div class='border-b border-gray-border dark:border-b-dark-light mb-1 px-1'>
      <nav class='flex space-x-1 overflow-x-auto vox-scroll-design pb-1'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            class={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab.value === tab.id
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
      {children}
    </div>
  </>
);
