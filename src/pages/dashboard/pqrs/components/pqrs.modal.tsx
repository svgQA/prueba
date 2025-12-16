import { VNode } from 'preact';
import { Signal, useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';

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
import { Button } from '@/components/common/button/button';

import { DateUtils } from '@/utils/utilities/dates';
import { useUserStore } from '@/store/slices';
import { useTranslation } from 'react-i18next';

import { PqrsService } from '@/services/pqrs/pqrs';
import { OtsService } from '@/services/pqrs/ots';

import { ICPqrsRequest, IPqrsArea } from '../utils/interface';
import PqrsInferenceModal from './modal/pqrs-inference.modal';
import PqrsGeneralModal from './modal/pqrs-general.modal';
import { PqrsAiService } from '@/services/pqrs/ai-pqrs';
import PqrsOTSModal from './modal/pqrs.ots.modal';

interface IProps {
  showModal: Signal<boolean>;
  closeModal: () => void;
  id?: number;
}

export const PqrsModal = ({ showModal, closeModal, id }: IProps) => {
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
    ...(pqrs.value?.pqrs_ots
      ? [{ id: 'ots', label: 'Órdenes de Trabajo', icon: '320' }]
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

  const handleCreateOts = async (pqrsId: number, areaId: number) => {
    loading.value = true;
    const response = await OtsService.create(pqrsId, areaId);
    if (!response.getStatus()) return (loading.value = false);
    const ots = response.getOne();
    await PqrsAiService.execute_ai_process_again(pqrsId, {
      otsId: ots.id,
      areaId,
    });
    loading.value = false;
    closeModal();
  };

  const HeaderInformation = () => (
    <div class='bg-white/95 dark:bg-b-dark-light/90 border border-gray-border/70 dark:border-b-dark-light rounded-2xl p-4 shadow-sm space-y-4'>
      <div class='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
        <div class='flex-1 min-w-0 space-y-1.5'>
          <div class='flex items-start gap-2 flex-wrap'>
            <h4 class='font-semibold text-t-light dark:text-white text-lg leading-tight'>
              {pqrs.value?.extraData?.title}
            </h4>
          </div>
          <div class='flex items-center flex-wrap gap-2 text-xs text-gray-text-light dark:text-b-light-dark'>
            {pqrs.value?.clientName && (
              <span class='font-mono px-2 py-0.5 rounded-full bg-b-light dark:bg-b-dark'>
                Nombre: {pqrs.value.clientName}
              </span>
            )}
            {pqrs.value?.identifier && (
              <span class='font-mono px-2 py-0.5 rounded-full bg-b-light dark:bg-b-dark'>
                Cedula: {pqrs.value.identifier}
              </span>
            )}
            {pqrs.value?.contract && (
              <span class='px-2 py-0.5 rounded-full bg-b-light dark:bg-b-dark'>
                contract: {pqrs.value.contract}
              </span>
            )}
            {pqrs.value?.startDate && (
              <span class='px-2 py-0.5 rounded-full bg-b-light dark:bg-b-dark'>
                fecha:{' '}
                {DateUtils.dateToFrontend(pqrs.value?.startDate, {
                  format: 'DD/MM/YYYY',
                })}
              </span>
            )}
            {pqrs.value?.contactEmail && (
              <span class='px-2 py-0.5 rounded-full bg-b-light dark:bg-b-dark'>
                Email: {pqrs.value.contactEmail}
              </span>
            )}
            {pqrs.value?.address && (
              <span class='px-2 py-0.5 rounded-full bg-b-light dark:bg-b-dark'>
                Dirección: {pqrs.value.address}
              </span>
            )}
          </div>
        </div>
      </div>

      {/**
       * TODO: REFACTORIZAR ESTA PARTE PORQUE NO DEBE IR AQUI:
       */}
      {pqrs.value?.area &&
        pqrs.value?.area.map((area: IPqrsArea) => (
          <div class='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
            <div class='flex items-start gap-2'>
              <Badge
                key={area?.area?.id}
                label={area?.area?.name ?? ''}
                status='warning'
                size='sm'
                outline
                width='w-fit'
              />
            </div>

            {area.subarea && (
              <div class='flex items-start gap-2'>
                <Badge
                  key={area?.subarea?.id}
                  label={area?.subarea?.name}
                  status='warning'
                  size='sm'
                  outline
                  width='w-fit'
                />
              </div>
            )}

            <div class='flex items-start gap-2'>
              <Button
                name='btn-click-ots'
                label='create OTS'
                onClick={() =>
                  Promise.all([
                    handleCreateOts(pqrs.value?.id!, area?.area?.id!),
                  ])
                }
                className='!bg-secondary/15 !text-secondary hover:!bg-secondary/25'
              />
            </div>
          </div>
        ))}

      {pqrs.value?.extraData?.observation && (
        <div class='mb-3 pb-3 border-b border-gray-border/70 dark:border-b-dark-light'>
          <TextEllipsis
            text={pqrs.value.extraData.observation}
            maxWidth='100%'
            lines={3}
            className='text-sm text-gray-text-light dark:text-b-light-dark leading-relaxed'
          />
        </div>
      )}
      {/* Mover badges al final para que no queden junto al título */}
      <div class='flex items-start gap-2 flex-wrap'>
        {pqrs.value?.extraData?.pqrsType && (
          <Badge
            label={pqrs.value.extraData.pqrsType}
            status={getBadgeStatus()}
            size='sm'
            outline
            width='w-fit'
          />
        )}
        {pqrs.value?.priority && (
          <Badge
            label={pqrs.value?.priority.name}
            status='warning'
            size='sm'
            outline
            width='w-fit'
          />
        )}
      </div>
    </div>
  );

  return (
    <Modal
      open={showModal.value}
      onClose={closeModal}
      name='modal-pqrs-details'
      width='w-full max-w-7xl'
      position='fixed'
      expandable
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
              <PqrsInferenceModal
                inferences={
                  pqrs.value?.inferences?.filter(
                    (inf) => inf.ots == null || inf.otsId == null
                  ) ?? []
                }
              />
            )}
            {activeTab.value === 'ots' && <PqrsOTSModal pqrs={pqrs} />}
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
  <div class='rounded-2xl border border-gray-border/70 dark:border-b-dark-light bg-white/90 dark:bg-b-dark-light/90 shadow-sm overflow-hidden flex flex-col h-full'>
    <div class='border-b border-gray-border/60 dark:border-b-dark-light bg-b-light/60 dark:bg-b-dark/60 px-2'>
      <nav class='flex space-x-1 overflow-x-auto vox-scroll-design py-2'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            class={`px-3 py-2 text-sm font-medium rounded-xl transition-colors border ${
              activeTab.value === tab.id
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white/80 dark:bg-b-dark/80 border-transparent text-gray-text-light dark:text-b-light-dark hover:border-gray-border/60 dark:hover:border-b-dark-light hover:text-t-light'
            }`}
            onClick={() => (activeTab.value = tab.id)}
          >
            <span class={`mr-1 vox-icon vx-icon-${tab.icon}`}></span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>

    <div class='flex-1 overflow-y-auto p-4 bg-b-light/60 dark:bg-b-dark/60 vox-scroll-design'>
      {children}
    </div>
  </div>
);
