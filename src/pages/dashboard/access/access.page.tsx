import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { Section } from '@/components/common/section/section';
// Ajusta si tu Section está en otro lado
import { Table } from '@/components/common/table/table';
import { getColumns } from './components/access.columns';
import { ExpandableAccess } from '@/components/compose/table/expandable/access';
import { CardData } from '@/components/compose/cards';
import { useTranslation } from 'react-i18next';
import { AccessesService } from '@/services/access/accesses';
import { useSignal } from '@preact/signals';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { defaultSummary, IResponseSummary } from '@/services';
import { AccessForm } from './components/access.upsert.form';
import { IRowAction } from '@/components/common/table/interface';
import { IAccess } from '@/types/access/accesses';
import { modulesReport } from '@/types/form';
import { useUserStore } from '@/store/slices';

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

export const AccessPage: FunctionalComponent = () => {
  const { t } = useTranslation();
  const { selectedCompany, selectedPlace } = useUserStore();

  const accesses = useSignal<IAccess[]>([]);
  const summary = useSignal<IResponseSummary>(defaultSummary);
  const showUpsertModal = useSignal<boolean>(false);
  const idAccess = useSignal<string>();

  useEffect(() => {
    document.title = t('p_access');
    fetchInitialData();
  }, [selectedPlace, selectedCompany]);

  const fetchInitialData = async () => {
    const [accessesresponse, summaryresponse] = await Promise.all([
      AccessesService.get_all(),
      AccessesService.getAccessesSummary(),
    ]);

    if (accessesresponse.getStatus()) {
      accesses.value = accessesresponse.getMany();
    }

    if (summaryresponse.getStatus()) {
      summary.value = summaryresponse.getOne();
    }
  };

  useEffect(() => {
    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.ACCESS,
      handleMessage,
      MESSAGE_LISTENERS.ACCESS
    );
    return () => {
      WebSocketManager.remove(
        SOCKET_MESSAGE_AREA.ACCESS,
        MESSAGE_LISTENERS.ACCESS
      );
    };
  }, []);

  const handleMessage = (event: InSocketMessage<MessageEvent>) => {
    const { type: name, message } = event.payload;

    if (
      name === SOCKET_MESSAGE_EVENTS.UPDATE ||
      name === SOCKET_MESSAGE_EVENTS.UPDATE_CHECK
    ) {
      const index = accesses.value.findIndex(
        (value: any) => value.id === message.id
      );
      if (index < 0) return;
      const copy: IAccess[] = accesses.value;
      copy[index] = message;
      accesses.value = [...copy];
    }

    if (name === SOCKET_MESSAGE_EVENTS.CREATE) fetchInitialData();
  };

  const toggleUpsertModal = () => {
    showUpsertModal.value = !showUpsertModal.value;
  };

  const clearUpsertModal = () => {
    idAccess.value = undefined;
    showUpsertModal.value = false;
  };

  const handleUpsert = (id?: string) => {
    clearUpsertModal();
    if (id) idAccess.value = id;
    toggleUpsertModal();
  };

  const deleteUpsert = async (id: string) => {
    const response = await AccessesService.deleteAccesses(id);
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
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='h_accessess_total'
          count={summary.value?.total}
          subtitle='h_accessess_subtitle'
          color='text-secondary'
          icon='189'
        />
        <CardData
          title='h_accessess_in_progress'
          count={calculatePercentage(summary.value)}
          subtitle='h_accessess_entered_subtitle'
          color='text-primary'
          icon='183'
        />
        <CardData
          title='h_accessess_completed'
          count={calculatePercentage(summary.value, true)}
          subtitle='h_accessess_entered_subtitle'
          color='text-error'
          icon='221'
        />
      </div>

      <div className='max-h-screen'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-row items-center justify-between'>
            {/* <Button
              name='button-create-shift'
              label='create'
              onClick={() => handleUpsert()}
              icon='044'
              iconSize='sm'
            />
            <AudioButton /> */}
          </div>
        </div>

        <Table<IAccess>
          data={accesses.value}
          columns={getColumns(onClickAction)}
          pageSize={10}
          // Reutilizando la propiedad "expandable" (igual que en shifts)
          expandable={(row: IAccess) => <ExpandableAccess row={row} />}
          visibility={{
            id: false,
            updatedAt: false,
          }}
          modules={modulesReport.Access}
        />
      </div>

      {showUpsertModal.value && (
        <AccessForm
          closed={showUpsertModal.value}
          onClose={() => {
            toggleUpsertModal();
            fetchInitialData();
          }}
          id={idAccess.value}
        />
      )}
    </Section>
  );
};
