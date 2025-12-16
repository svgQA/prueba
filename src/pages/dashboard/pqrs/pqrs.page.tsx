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
// import { Loading } from '@/components/common/loading/loading';
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
import { useUserStore } from '@/store/slices';

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

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      Promise.all([fetchingAllData()]);
    }
  }, [selectedCompany, location]);

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

    const finishedFound = list.find((item) => item.label === 'finished');
    const finishedStatus = finishedFound
      ? { ...finishedFound, label: 'pqrs.finished' }
      : { value: uuid(), label: 'pqrs.finished' };

    const errorFound = list.find((item) => item.label === 'error');
    const errorStatus = errorFound
      ? { ...errorFound, label: 'pqrs.error' }
      : { value: uuid(), label: 'pqrs.error' };

    const middleStatuses = list.filter((item) => item.label !== 'error' && item.label !== 'finished');
    const orderedList = [...middleStatuses, finishedStatus, errorStatus];

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
          normalizedStatus !== 'finished' &&
          normalizedStatus !== 'error'
        ) {
          const lastInference = item.inferences[item.inferences.length - 1];
          if (lastInference?.stage?.visibility == false) return;
          normalizedStatus =
            lastInference?.stage?.stageName.toLowerCase() || null;
        }

        // Normaliza claves: si el estado es finished/error, usa prefijo 'pqrs.'
        if (normalizedStatus === 'finished') normalizedStatus = 'pqrs.finished';
        if (normalizedStatus === 'error') normalizedStatus = 'pqrs.error';

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
      { colorClass: 'text-ternary', bgColorClass: 'bg-primary-opacity-2' },
      { colorClass: 'text-ternary', bgColorClass: 'bg-primary-opacity-2' },
      { colorClass: 'text-ternary', bgColorClass: 'bg-secondary-opacity' },
      { colorClass: 'text-ternary', bgColorClass: 'bg-primary-opacity' },
      { colorClass: 'text-ternary', bgColorClass: 'bg-caution-opacity' },
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
  /*
  const getColumnBadgeStatus = (
    colorClass: string
  ): 'error' | 'success' | 'warning' | 'info' | 'ternary' => {
    if (colorClass.includes('error')) return 'error';
    if (colorClass.includes('secondary')) return 'success';
    if (colorClass.includes('caution')) return 'warning';
    if (colorClass.includes('ternary')) return 'ternary';
    return 'info';
  };
  */

  const closeModalUpsert = async () => {
    openModalUpsert.value = false;
    await fetchingAllData();
  };

  const cardOnClick = (id: number, tags: unknown[], areas: any) => {
    pqrsSelected.value = { id, tags, areas };
    openModalData.value = true;
  };

  return (
    <div class='min-h-full text-t-light dark:text-t-dark'>
      <div class='w-full mx-auto p-2 space-y-2'>
        <div class='bg-white/90 dark:bg-b-dark-light/80 border border-gray-border/60 dark:border-gray-border/20 rounded-lg shadow-sm px-4 py-3 md:px-6 md:py-4 flex flex-col'>
          <div class='flex flex-row xl:justify-between w-full items-center flex-wrap gap-y-2 justify-center'>
            <div class='space-y-2'>
              <div class='flex items-center gap-3 flex-wrap'>
                <h1 class='text-2xl font-semibold text-t-light dark:text-white'>
                  {t('pq_title')}
                </h1>
                <Badge
                  label='pq_name'
                  status='info'
                  outline
                  size='sm'
                  width='w-fit'
                />
              </div>
              <p class='text-sm text-gray-text-light dark:text-t-dark'>
                {t('pq_description')}
              </p>
            </div>

            <div class='bg-b-light dark:bg-b-dark rounded-full py-1 px-4 flex gap-1 shadow-sm h-12 items-center'>
              {viewMode.value === ViewMode.CARDS && (
                <div class='flex gap-2 border-r border-b-light-dark dark:border-b-dark-light px-2'>
                  <Button
                    name='btn-refresh'
                    onClick={() => fetchingAllData()}
                    label='h_refresh'
                    icon='050'
                    borderless
                    iconSize='sm'
                    className='!bg-primary/15 !text-primary !border-none hover:!bg-primary/25'
                  />
                  <Button
                    name='btn-upsert-pqrs'
                    onClick={() => (openModalUpsert.value = true)}
                    label='create'
                    icon='044'
                    borderless
                    iconSize='sm'
                    className='!bg-secondary/15 !text-secondary !border-none hover:!bg-secondary/25'
                  />
                </div>
              )}
              {[
                { id: ViewMode.CARDS, label: 'Tarjetas' },
                { id: ViewMode.DASHBOARD, label: 'Dashboard' },
                { id: ViewMode.OTS, label: 'OTS' },
              ].map((option) => (
                <button
                  key={option.id}
                  class={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    viewMode.value === option.id
                      ? 'bg-primary text-white shadow-primary/25'
                      : 'text-gray-text-light hover:text-t-light dark:text-t-dark'
                  }`}
                  onClick={() => (viewMode.value = option.id as ViewMode)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {/*
          <div class='grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4'>
            <div class='rounded-xl border border-gray-border/60 dark:border-gray-border/20 bg-b-light dark:bg-b-dark/60 px-3 py-2 flex items-center justify-between'>
              <span class='text-sm text-gray-text-light dark:text-t-dark'>
                Total casos
              </span>
              <span class='text-lg font-semibold text-t-light dark:text-white'>
                {pqrs.value.length}
              </span>
            </div>
            <div class='rounded-xl border border-gray-border/60 dark:border-gray-border/20 bg-b-light dark:bg-b-dark/60 px-3 py-2 flex items-center justify-between'>
              <span class='text-sm text-gray-text-light dark:text-t-dark'>
                Actualizado
              </span>
              <span class='text-sm font-medium text-t-light dark:text-white'>
                {lastUpdated.value ? lastUpdated.value.toLocaleString() : '--'}
              </span>
            </div>
            <div class='rounded-xl border border-gray-border/60 dark:border-gray-border/20 bg-b-light dark:bg-b-dark/60 px-3 py-2 flex items-center justify-between'>
              <span class='text-sm text-gray-text-light dark:text-t-dark'>
                Vista
              </span>
              <span class='text-sm font-medium text-primary'>
                {viewMode.value === ViewMode.CARDS
                  ? 'Tarjetas'
                  : viewMode.value === ViewMode.DASHBOARD
                    ? 'Dashboard'
                    : 'OTS'}
              </span>
            </div>
          </div>
          */}
        </div>

        {/* border border-gray-border/50 dark:border-gray-border/20 shadow-sm */}
        {viewMode.value === ViewMode.CARDS && (
          <div className='w-full h-[calc(100vh-14vh)] vox-scroll-design overflow-y-auto vox-scroll-design rounded-lg bg-white/80 dark:bg-b-dark-light/70 px-3 md:px-4 py-4 space-y-4 border border-gray-border/60 dark:border-gray-border/20'>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5 w-full'>
              {columns.value.map((column, index) => {
                const items = groupedPqrs.value[column.title] ?? [];
                return (
                  <div
                    key={`${column.title}-${index}`}
                    className='group rounded-lg p-2 min-h-96 w-full border border-gray-border/80 bg-white/90 dark:bg-b-dark-light/90 dark:border-gray-border/10'
                  >
                    <div className='flex items-center justify-between mb-3 gap-2 sticky top-0 bg-white/90 dark:bg-b-dark-light/90 py-1 -mx-1 px-1 backdrop-blur-sm border-b border-transparent '>
                      <TextEllipsis
                        text={t(column.title)}
                        maxWidth='16rem'
                        lines={1}
                        className='capitalize'
                      />
                      <span className='font-bold px-2 bg-teal-700 rounded-md'>
                        {String(items.length)} und
                      </span>
                    </div>

                    <div class='space-y-2 max-h-96 overflow-y-auto'>
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
                        <div class='text-center py-8 text-gray-text-light opacity-80 border border-dashed border-gray-border rounded-lg bg-white/70 dark:bg-b-dark dark:text-t-dark-light dark:border-gray-border/30'>
                          <p class='text-sm'>
                            {t('pq_no_case')}
                            {/* No hay PQRS en esta columna */}
                          </p>
                          <p class='text-xs mt-1'>
                            {t('pq_new_case')}
                            {/* Crea un nuevo caso para empezar. */}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {/*
              {!loading.value && columns.value.length === 0 && (
                <div class='text-center py-8 text-gray-text-light opacity-80 border border-dashed border-gray-border rounded-lg bg-white/70 dark:bg-b-dark dark:text-t-dark-light dark:border-gray-border/30 w-full'>
                  <p class='text-sm font-medium text-t-light'>
                    Aún no hay estados configurados
                  </p>
                  <p class='text-xs mt-1'>
                    Actualiza o crea un caso para ver columnas disponibles.
                  </p>
                </div>
              )}
              */}
            </div>
          </div>
        )}

        {viewMode.value === ViewMode.DASHBOARD && <DashboardPreview />}
        {viewMode.value === ViewMode.OTS && <OtsPage />}

        {/*
        {loading.value && (
          <div class='flex justify-center items-center h-96'>
            <Loading />
          </div>
        )}
        */}
      </div>

      {/* Modals */}
      <PqrsUpsert
        showModal={openModalUpsert}
        closeModal={() => closeModalUpsert()}
      />

      <PqrsModal
        id={pqrsSelected.value.id}
        showModal={openModalData}
        closeModal={() => {
          openModalData.value = false;
        }}
      />
    </div>
  );
};