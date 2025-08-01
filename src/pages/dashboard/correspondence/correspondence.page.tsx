// src/pages/dashboard/correspondence/correspondence.page.tsx

import { FunctionalComponent } from 'preact';
import { useCallback, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { CardData } from '@/components/compose/cards';
import { ExpandableCorrespondence } from '@/components/compose/table/expandable/correspondence';
import { Button } from '@/components/common/button/button';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';

import { EventBus } from '@/utils/network/event.bus';
import { IBaseSSE, SSE_EVENTS, SSE_TYPE, SseManager } from '@/utils/network/sse/base';

import { defaultSummary, IResponseSummary } from '@/services';
import { CorrespondenceService } from '@/services/access/correspondence';

import { useTranslation } from 'react-i18next';

import { ICorrespondence } from './utils';
import { getColumns } from './components/correspondence.columns';


export const CorrespondencePage: FunctionalComponent = () => {
  const { t } = useTranslation();

  const correspondence = useSignal<ICorrespondence[]>([]);
  const summary = useSignal<IResponseSummary>(defaultSummary);
  const showUpsertModal = useSignal<boolean>(false);
  const idCorrespondence = useSignal<string>();

  useEffect(() => {
    document.title = t('p_correspondence');
    fetchInitialData();
    fetchSSE();
    EventBus.on(SSE_TYPE.CORRESPONDENCE, handleSSE);
  }, []);

  const fetchInitialData = async () => {
    const [
      correspondenceResponse,
      summaryResponse
    ] = await Promise.all([
      CorrespondenceService.get_all(),
      CorrespondenceService.getCorrespondenceSummary()
    ]);

    if (correspondenceResponse.getStatus()) {
      correspondence.value = correspondenceResponse.getMany();
    }

    if (summaryResponse.getStatus()) {
      summary.value = summaryResponse.getOne();
    }
  }

  const fetchSSE = useCallback(async () => {
    await SseManager.getQuery(['correspondences', 'stream']);
  }, []);

  const handleSSE = async (event: IBaseSSE) => {
    const { name, message } = event;

    if (name === SSE_EVENTS.UPDATE || name === SSE_EVENTS.UPDATE_CHECK) {
      const index = correspondence.value.findIndex((value: any) => value.id === message.id);
      if (index < 0) return;
      const copy: ICorrespondence[] = correspondence.value;
      copy[index].observation = message.observation;
      correspondence.value = [...copy];
    }

    if (name === SSE_EVENTS.CREATE) fetchInitialData();
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
          title='Visitas Mensuales'
          count={summary.value?.total}
          subtitle='Registros de este mes'
          color='text-secondary'
          icon='189'
        />
        <CardData
          title='Vehículos que ingresaron'
          count={calculatePercentage(summary.value)}
          subtitle='Por día'
          color='text-primary'
          icon='183'
        />
        <CardData
          title='Vehículos que ingresaron y salieron'
          count={calculatePercentage(summary.value, true)}
          subtitle='Por día'
          color='text-error'
          icon='221'
        />
      </div>

      <div className='max-h-screen'>
        <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-10 bg-b-content dark:bg-b-dark'>
          <div className='flex flex-row items-center justify-between'>
            <Button
              name='button-create-shift'
              label='create'
              onClick={() => handleUpsert()}
              icon='044'
              iconSize='sm'
            />
            {/* <AudioButton /> */}
          </div>
        </div>

        <Table<ICorrespondence>
          data={correspondence.value}
          columns={getColumns(onClickAction)}
          pageSize={10}
          // Expansible (similar a Access)
          expandable={(row: ICorrespondence) => (
            <ExpandableCorrespondence row={row} />
          )}
        // Si deseas ocultar columnas, p. ej. con visibility
        // visibility={{ whoPickedUp: true, ... etc}}
        />
      </div>

    </Section>
  );
};
