import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  SOCKET_MESSAGE_EVENTS,
  MessageEvent,
  MESSAGE_LISTENERS,
} from '@/utils/socket/manager/types';

import { Button } from '@/components/common/button/button';
import { Loading } from '@/components/common/loading/loading';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { Badge } from '@/components/common/badge/badge';
import { IOption } from '@/components/common/smart-selector/smart-select';

import { uuid } from 'short-uuid';
import { useTranslation } from 'react-i18next';

import { StageService } from '@/services/pqrs/stage';
import { PqrsService } from '@/services/pqrs/pqrs';

import { PqrsCards } from './components/pqrs.card';
import { PqrsUpsert } from './components/pqrs.upsert';
import { PqrsModal } from './components/pqrs.modal';
import OtsPage from './components/pqrs.ots';
import DashboardPreview from './components/pqrs.dashboard';

import { ICPqrsRequest } from './utils/interface';

interface ColumnConfig {
  title: string;
  colorClass: string;
  bgColorClass: string;
}

enum ViewMode {
  CARDS,
  DASHBOARD,
  OTS,
}

export const PqrsPage: FunctionComponent = () => {
  const { t } = useTranslation();

  const pqrs = useSignal<ICPqrsRequest[]>([]);
  const loading = useSignal<boolean>(true);
  const groupedPqrs = useSignal<Record<string, ICPqrsRequest[]>>({});
  const columns = useSignal<ColumnConfig[]>([]);
  const openModalUpsert = useSignal<boolean>(false);
  const openModalData = useSignal<boolean>(false);
  const viewMode = useSignal<ViewMode>(ViewMode.CARDS);
  const lastUpdated = useSignal<Date | null>(null);
  const pqrsSelected = useSignal<any>({ id: 0, tags: [], area: {} });

  useEffect(() => {
    Promise.all([fetchingAllData()]);
  }, []);

  useEffect(() => {
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
  }, []);

  const handleMessage = async (event: InSocketMessage<MessageEvent>) => {
    const { type: name } = event.payload;
    if (name === SOCKET_MESSAGE_EVENTS.CHANGE_STATUS) await fetchingAllData();
  };

  const fetchingAllData = async () => {
    await getPqrs();
    await getPqrsGrouped();
    lastUpdated.value = new Date();
  };

  const getPqrs = async () => {
    loading.value = true;
    try {
      const response = await PqrsService.get_all();
      if (!response.getStatus()) return;
      pqrs.value = response.getMany();
    } finally {
      loading.value = false;
    }
  };

  const getStatus = async () => {
    const response = await StageService.getSimpleList();
    if (!response.getStatus()) return;
    groupedPqrs.value = {};
    const list: IOption[] = response.getMany();

    const createdStatus = list.find((item) => item.label === 'created') || {
      value: uuid(),
      label: 'created',
    };
    const finishedStatus = list.find((item) => item.label === 'finished') || {
      value: uuid(),
      label: 'finished',
    };
    const middleStatuses = list.filter(
      (item) => item.label !== 'created' && item.label !== 'finished'
    );
    const orderedList = [createdStatus, ...middleStatuses, finishedStatus];

    orderedList.forEach((statusItem) => {
      const normalizedStatus = statusItem.label.toLowerCase();
      if (!groupedPqrs.value[normalizedStatus]) {
        groupedPqrs.value[normalizedStatus] = [];
      }
    });
  };

  const getPqrsGrouped = async () => {
    loading.value = true;
    try {
      await getStatus();

      pqrs.value.forEach((item: any) => {
        let normalizedStatus: string = item.status.toLowerCase();
        if (
          Array.isArray(item.inferences) &&
          item.inferences.length > 0 &&
          normalizedStatus !== 'created' &&
          normalizedStatus !== 'finished' &&
          normalizedStatus !== 'error'
        ) {
          const lastInference = item.inferences[item.inferences.length - 1];
          if (lastInference?.stage?.visibility == false) return;
          normalizedStatus =
            lastInference?.stage?.stageName.toLowerCase() || null;
        }

        if (!groupedPqrs.value[normalizedStatus])
          groupedPqrs.value[normalizedStatus] = [];
        groupedPqrs.value[normalizedStatus].push(item);
      });

      columns.value = getColumns(groupedPqrs.value);
    } finally {
      loading.value = false;
    }
  };

  const getColumns = (
    grouped: Record<string, ICPqrsRequest[]>
  ): ColumnConfig[] => {
    const colors = [
      { colorClass: 'text-caution', bgColorClass: 'bg-caution-opacity' },
      { colorClass: 'text-primary', bgColorClass: 'bg-primary-opacity' },
      { colorClass: 'text-secondary', bgColorClass: 'bg-secondary-opacity' },
      { colorClass: 'text-error', bgColorClass: 'bg-error-opacity' },
      { colorClass: 'text-ternary', bgColorClass: 'bg-primary-opacity' },
    ];

    return Object.entries(grouped).map(([status], index) => {
      return {
        title: status,
        colorClass: colors[index % colors.length].colorClass,
        bgColorClass: colors[index % colors.length].bgColorClass,
      };
    });
  };

  // Mapear colorClass a status del Badge
  const getColumnBadgeStatus = (
    colorClass: string
  ): 'error' | 'success' | 'warning' | 'info' | 'ternary' => {
    if (colorClass.includes('error')) return 'error';
    if (colorClass.includes('secondary')) return 'success';
    if (colorClass.includes('caution')) return 'warning';
    if (colorClass.includes('ternary')) return 'ternary';
    return 'info';
  };

  const closeModalUpsert = async () => {
    openModalUpsert.value = false;
    await fetchingAllData();
  };

  const cardOnClick = (id: number, tags: unknown[], areas: any) => {
    pqrsSelected.value = { id, tags, areas };
    openModalData.value = true;
  };

  return (
    <div class='p-6 h-full space-y-4'>
      <div class='flex flex-col gap-2 justify-center md:flex-row md:items-center md:justify-between w-full'>
        <div class='w-full md:w-1/2 flex flex-row md:flex-col justify-between'>
          <h1 class='text-2xl font-bold text-t-light dark:text-white'>
            Gestión y experiencia
          </h1>
          <div class='flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-text-light'>
            <span class='px-2 py-1 rounded-full bg-b-light dark:bg-b-dark-light dark:text-white'>
              Total de casos: {pqrs.value.length}
            </span>
            {lastUpdated.value && (
              <span class='px-2 py-1 rounded-full bg-b-light dark:bg-b-dark-light dark:text-white'>
                Actualizado: {lastUpdated.value.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div class='flex justify-between items-center md:justify-end gap-3 md:w-1/2'>
          {viewMode.value === ViewMode.CARDS && (
            <div class='flex gap-2'>
              <Button
                name='btn-refresh'
                onClick={() => fetchingAllData()}
                label='h_refresh'
                icon='050'
                iconSize='sm'
              />
              <Button
                name='btn-upsert-pqrs'
                onClick={() => (openModalUpsert.value = true)}
                label='create'
                icon='044'
                iconSize='sm'
              />
            </div>
          )}

          <div class='bg-b-light dark:bg-b-dark-light rounded-full p-1 flex gap-1'>
            {[
              { id: ViewMode.CARDS, label: 'Tarjetas' },
              { id: ViewMode.DASHBOARD, label: 'Dashboard' },
              { id: ViewMode.OTS, label: 'OTS' },
            ].map((option) => (
              <button
                key={option.id}
                class={`px-4 py-2 text-sm font-medium rounded-full transition-all shadow-sm ${
                  viewMode.value === option.id
                    ? 'bg-primary text-white shadow-primary/20'
                    : 'text-gray-text-light hover:text-t-light dark:text-white'
                }`}
                onClick={() => (viewMode.value = option.id as ViewMode)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode.value === ViewMode.CARDS && (
        <div class='flex flex-row flex-wrap gap-2 w-full justify-center'>
          {columns.value.map((column, index) => {
            const items = groupedPqrs.value[column.title] ?? [];
            return (
              <div
                key={`${column.colorClass}-${index}`}
                class={`${column.bgColorClass} rounded-xl p-4 min-h-96 w-80 flex-shrink-0 border border-gray-border/60 shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-sm`}
              >
                <div class='flex items-center justify-between mb-4 gap-2'>
                  <h3
                    class={`font-semibold flex items-center gap-2 ${column.colorClass} flex-1 min-w-0`}
                  >
                    <div
                      class={`w-3 h-3 rounded-full flex-shrink-0 ${column.colorClass.replace('text-', 'bg-')}`}
                    />
                    <TextEllipsis
                      text={t(column.title)}
                      maxWidth='100%'
                      lines={1}
                    />
                  </h3>
                  <Badge
                    label={String(items.length)}
                    status={getColumnBadgeStatus(column.colorClass)}
                    outline
                    borderless
                    size='xs'
                    width='w-fit'
                  />
                </div>

                <div class='space-y-2 max-h-96 overflow-y-auto vox-scroll-design pr-1'>
                  {items.map((item: ICPqrsRequest, index) => {
                    return (
                      <PqrsCards
                        key={`${item.id}-${index}`}
                        pqrs={item}
                        index={index}
                        columnColorClass={column.colorClass}
                        onClick={cardOnClick}
                      />
                    );
                  })}
                  {items.length === 0 && (
                    <div class='text-center py-8 text-gray-text-light opacity-60 border border-dashed border-gray-border rounded-lg bg-white/60'>
                      <p class='text-sm'>No hay PQRS en esta columna</p>
                      <p class='text-xs mt-1'>
                        Crea un nuevo caso para empezar.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {!loading.value && columns.value.length === 0 && (
            <div class='text-center py-8 text-gray-text-light opacity-70 border border-dashed border-gray-border rounded-lg bg-white/60 w-full'>
              <p class='text-sm font-medium text-t-light'>
                Aún no hay estados configurados
              </p>
              <p class='text-xs mt-1'>
                Actualiza o crea un caso para ver columnas disponibles.
              </p>
            </div>
          )}
        </div>
      )}

      {viewMode.value === ViewMode.DASHBOARD && <DashboardPreview />}
      {viewMode.value === ViewMode.OTS && <OtsPage />}

      <PqrsUpsert
        showModal={openModalUpsert}
        closeModal={() => closeModalUpsert()}
      />

      <PqrsModal
        id={pqrsSelected.value.id}
        tags={pqrsSelected.value.tags}
        showModal={openModalData}
        closeModal={() => (openModalData.value = false)}
      />

      {loading.value && (
        <div class='flex justify-center items-center h-96'>
          <Loading />
        </div>
      )}
    </div>
  );
};
