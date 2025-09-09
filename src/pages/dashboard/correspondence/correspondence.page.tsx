// src/pages/dashboard/correspondence/correspondence.page.tsx

import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { CardData } from '@/components/compose/cards';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';

import { defaultSummary, IResponseSummary } from '@/services';
import { CorrespondenceService } from '@/services/access/correspondence';

import { useTranslation } from 'react-i18next';

import { getColumns } from './components/correspondence.columns';
import { ICorrespondence } from '@/types/access';
import { CorrespondenceForm } from './components/upsert.form';
import { modulesReport } from '@/types/form';

/**
 * TODO: WebSocket
 */
import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  SOCKET_MESSAGE_EVENTS,
  MessageEvent,
  MESSAGE_LISTENERS,
} from '@/utils/socket/manager/types';

export const CorrespondencePage: FunctionalComponent = () => {
  const { t } = useTranslation();

  const correspondence = useSignal<ICorrespondence[]>([]);
  const summary = useSignal<IResponseSummary>(defaultSummary);
  const showUpsertModal = useSignal<boolean>(false);
  const idCorrespondence = useSignal<string>();

  useEffect(() => {
    document.title = t('p_correspondence');
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const [correspondenceResponse, summaryResponse] = await Promise.all([
      CorrespondenceService.get_all(),
      CorrespondenceService.getCorrespondenceSummary(),
    ]);

    if (correspondenceResponse.getStatus()) {
      correspondence.value = correspondenceResponse.getMany();
    }

    if (summaryResponse.getStatus()) {
      summary.value = summaryResponse.getOne();
    }
  };

  useEffect(() => {
    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.CORRESPONDENCE,
      handleMessage,
      MESSAGE_LISTENERS.CORRESPONDENCE
    );
    return () => {
      WebSocketManager.remove(
        SOCKET_MESSAGE_AREA.CORRESPONDENCE,
        MESSAGE_LISTENERS.CORRESPONDENCE
      );
    };
  }, []);

  const handleMessage = (event: InSocketMessage<MessageEvent>) => {
    const { type: name, message } = event.payload;

    if (
      name === SOCKET_MESSAGE_EVENTS.UPDATE ||
      name === SOCKET_MESSAGE_EVENTS.UPDATE_CHECK
    ) {
      const index = correspondence.value.findIndex(
        (value: any) => value.id === message.id
      );
      if (index < 0) return;
      const copy: ICorrespondence[] = correspondence.value;
      copy[index].observation = message.observation;
      correspondence.value = [...copy];
    }

    if (name === SOCKET_MESSAGE_EVENTS.CREATE) fetchInitialData();
  };

  const toggleUpsertModal = () => {
    showUpsertModal.value = !showUpsertModal.value;
  };

  const clearUpsertModal = () => {
    idCorrespondence.value = undefined;
    showUpsertModal.value = false;
  };

  const handleUpsert = (id?: string) => {
    clearUpsertModal();
    if (id) idCorrespondence.value = id;
    toggleUpsertModal();
  };

  const deleteUpsert = async (id: string) => {
    const response = await CorrespondenceService.deleteCorrespondence(id);
    if (!response.getStatus()) return;
    fetchInitialData();
  };

  const onClickAction = async (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        handleUpsert(String(action.id));
        break;
      case ROW_ACTIONS.DELETE:
        deleteUpsert(String(action.id));
        break;
    }
  };

  /**
   *
   * @param summary
   * @param isResolve
   * @returns
   */
  const calculatePercentage = (
    summary: IResponseSummary,
    isResolve: boolean = false
  ): string => {
    const inProgress = summary.in_progress || 0;
    const completed = summary.completed || 0;
    const total = inProgress + completed;
    if (total === 0) return '0%';
    const value = isResolve ? completed : inProgress;
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <Section>
      {/* Tarjetas superiores, como en Access o Shifts */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='h_correspondence_total'
          count={summary.value?.total}
          subtitle='h_correspondence_subtitle'
          color='text-secondary'
          icon='189'
        />
        <CardData
          title='h_correspondence_in_progress'
          count={calculatePercentage(summary.value)}
          subtitle='h_correspondence_delivered_subtitle'
          color='text-primary'
          icon='183'
        />
        <CardData
          title='h_correspondence_completed'
          count={calculatePercentage(summary.value, true)}
          subtitle='h_correspondence_delivered_subtitle'
          color='text-error'
          icon='221'
        />
      </div>

      <div className='max-h-screen'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-row items-center justify-between'>
            {/*<Button
              name='button-create-shift'
              label='create'
              onClick={() => handleUpsert()}
              icon='044'
              iconSize='sm'
            />
             <AudioButton /> */}
          </div>
        </div>

        <Table<ICorrespondence>
          data={correspondence.value}
          columns={getColumns(onClickAction)}
          pageSize={10}
          // Expansible (similar a Access)
          // expandable={(row: ICorrespondence) => (
          //   <ExpandableCorrespondence row={row} />
          // )}
          modules={modulesReport.Correspondence}
        />
      </div>

      {showUpsertModal.value && (
        <CorrespondenceForm
          closed={showUpsertModal.value}
          onClose={() => {
            toggleUpsertModal();
            fetchInitialData();
          }}
          id={idCorrespondence.value}
        />
      )}
    </Section>
  );
};
